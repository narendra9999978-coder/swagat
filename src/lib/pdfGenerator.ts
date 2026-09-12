import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Approval } from '../types/swagat';

export interface PdfProjectDetails {
  sector: string;
  state: string;
  investmentSize: string;
  planningStage?: string;
  businessType?: string;
}

export interface PdfRoadmapData {
  projectDetails: PdfProjectDetails;
  approvals: Approval[];
}

/**
 * Sanitizes a string for use in safe filenames.
 */
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

/**
 * Renders the SWAGAT emblem vector directly on the jsPDF canvas.
 */
function drawSwagatEmblem(doc: jsPDF, x: number, y: number, size: number) {
  doc.saveGraphicsState();

  // Outer rounded square background (deep navy #06152B)
  doc.setFillColor(6, 21, 43);
  doc.roundedRect(x, y, size, size, size * 0.22, size * 0.22, 'F');

  // Subtle border
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, size, size, size * 0.22, size * 0.22, 'S');

  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.32;

  // Saffron arc (top-right to middle)
  doc.setDrawColor(255, 153, 51); // #FF9933
  doc.setLineWidth(size * 0.085);
  doc.circle(cx - r * 0.15, cy - r * 0.35, r * 0.65, 'S');

  // India green arc (bottom-left to middle)
  doc.setDrawColor(19, 136, 8); // #138808
  doc.circle(cx + r * 0.15, cy + r * 0.35, r * 0.65, 'S');

  // Center Ashoka Chakra Hub (Sky Blue)
  doc.setFillColor(6, 21, 43);
  doc.setDrawColor(56, 189, 248); // #38BDF8
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r * 0.42, 'FD');

  // Center pupil
  doc.setFillColor(56, 189, 248);
  doc.circle(cx, cy, r * 0.14, 'F');

  // Saffron dot top-right & Green dot bottom-left
  doc.setFillColor(255, 153, 51);
  doc.circle(cx + r * 0.62, cy - r * 0.62, r * 0.14, 'F');

  doc.setFillColor(25, 167, 69);
  doc.circle(cx - r * 0.62, cy + r * 0.62, r * 0.14, 'F');

  doc.restoreGraphicsState();
}

/**
 * Dynamically resolves the specific state authority name based on selected state.
 */
function getTailoredDepartment(app: Approval, state: string): string {
  if (app.centralOrState === 'Central') {
    return app.department || 'Central Regulatory Authority';
  }

  const dep = app.department || '';
  if (dep.includes('Pollution Control Board')) {
    const sMap: Record<string, string> = {
      Maharashtra: 'Maharashtra Pollution Control Board (MPCB)',
      Karnataka: 'Karnataka State Pollution Control Board (KSPCB)',
      Gujarat: 'Gujarat Pollution Control Board (GPCB)',
      'Tamil Nadu': 'Tamil Nadu Pollution Control Board (TNPCB)',
      'Uttar Pradesh': 'Uttar Pradesh Pollution Control Board (UPPCB)',
      Telangana: 'Telangana State Pollution Control Board (TSPCB)',
      Rajasthan: 'Rajasthan State Pollution Control Board (RSPCB)',
      Delhi: 'Delhi Pollution Control Committee (DPCC)',
      Haryana: 'Haryana State Pollution Control Board (HSPCB)',
      'West Bengal': 'West Bengal Pollution Control Board (WBPCB)',
      'Andhra Pradesh': 'Andhra Pradesh Pollution Control Board (APPCB)',
      Punjab: 'Punjab Pollution Control Board (PPCB)',
      'Madhya Pradesh': 'Madhya Pradesh Pollution Control Board (MPPCB)'
    };
    return sMap[state] || `${state} State Pollution Control Board (SPCB)`;
  }

  if (dep.includes('Industrial Safety and Health') || dep.includes('DISH')) {
    return `${state} Directorate of Industrial Safety and Health (DISH) / Labour Dept`;
  }

  if (dep.includes('Fire')) {
    return `${state} Directorate of Fire & Emergency Services`;
  }

  if (dep.includes('Electricity')) {
    const dMap: Record<string, string> = {
      Maharashtra: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
      Karnataka: 'Bangalore Electricity Supply Company (BESCOM) / KPTCL',
      Gujarat: 'Uttar Gujarat Vij Company Ltd (UGVCL) / GUVNL',
      'Tamil Nadu': 'Tamil Nadu Generation and Distribution Corp (TANGEDCO)',
      'Uttar Pradesh': 'Uttar Pradesh Power Corporation Ltd (UPPCL)',
      Telangana: 'Telangana State Southern Power Distribution Co. (TSSPDCL)',
      Delhi: 'BSES / Tata Power Delhi Distribution Limited',
      Rajasthan: 'Jaipur Vidyut Vitran Nigam Ltd (JVVNL)',
      Haryana: 'Dakshin Haryana Bijli Vitran Nigam (DHBVN)',
      'West Bengal': 'WBSEDCL / CESC Limited'
    };
    return dMap[state] || `${state} State Electricity Distribution Corporation (Discom)`;
  }

  if (dep.includes('Industrial Land') || dep.includes('Industrial Development Corporation') || dep.includes('MIDC')) {
    const lMap: Record<string, string> = {
      Maharashtra: 'Maharashtra Industrial Development Corporation (MIDC)',
      Karnataka: 'Karnataka Industrial Areas Development Board (KIADB)',
      Gujarat: 'Gujarat Industrial Development Corporation (GIDC)',
      'Tamil Nadu': 'State Industries Promotion Corporation of Tamil Nadu (SIPCOT)',
      'Uttar Pradesh': 'Uttar Pradesh State Industrial Development Authority (UPSIDA)',
      Telangana: 'Telangana State Industrial Infrastructure Corporation (TSIIC)',
      Rajasthan: 'Rajasthan State Industrial Development & Investment Corp (RIICO)',
      Haryana: 'Haryana State Industrial and Infrastructure Development Corp (HSIIDC)',
      Odisha: 'Industrial Infrastructure Development Corporation (IDCO)',
      'Madhya Pradesh': 'MP Industrial Development Corporation (MPIDC)'
    };
    return lMap[state] || `${state} State Industrial Development Corporation`;
  }

  if (dep.includes('Municipal') || dep.includes('Urban Local Body')) {
    const mMap: Record<string, string> = {
      Maharashtra: 'Brihanmumbai Municipal Corporation (BMC) / Municipal Corp',
      Karnataka: 'Bruhat Bengaluru Mahanagara Palike (BBMP) / Municipal Corp',
      Delhi: 'Municipal Corporation of Delhi (MCD)',
      'Tamil Nadu': 'Greater Chennai Corporation (GCC) / Municipal Admin',
      Telangana: 'Greater Hyderabad Municipal Corporation (GHMC)',
      Gujarat: 'Amdavad Municipal Corporation (AMC) / Local Urban Body',
      'Uttar Pradesh': 'Municipal Corporation / Directorate of Local Bodies UP',
      'West Bengal': 'Kolkata Municipal Corporation (KMC) / Municipal Affairs'
    };
    return mMap[state] || `${state} Urban Local Body / Municipal Corporation`;
  }

  return dep || `${state} State Department`;
}

/**
 * Dependency lookup helper for approvals.
 */
function getApprovalDependencies(approval: Approval): string {
  const code = (approval.code || '').toUpperCase();
  const name = (approval.name || '').toLowerCase();

  if (name.includes('consent to establish') || code.includes('CTE')) {
    return 'Land Possession / Allotment Order, Site Layout Plan, ETP/STP Blueprint';
  }
  if (name.includes('consent to operate') || code.includes('CTO')) {
    return 'Consent to Establish (CTE), ETP/STP Installation Verification, Stack Installation';
  }
  if (name.includes('factory license') || code.includes('FAC')) {
    return 'DISH Building Plan Approval, Stability Certificate, SPCB CTE / CTO, Electrical Safety NOC';
  }
  if (name.includes('fire safety') || code.includes('FIRE')) {
    return 'Architectural Layout Plan, Structural Evacuation Plan, Water Storage Tank Provisions';
  }
  if (name.includes('power load') || code.includes('UTIL') || code.includes('ELEC')) {
    return 'Land Title / Allotment Letter, Electrical Contractor Test Report, CEIG Safety Inspection Approval';
  }
  if (name.includes('food') || code.includes('FSSAI')) {
    return 'Premises Layout Blueprint, NABL Water Potability Certificate, FSMS Compliance Plan';
  }
  if (name.includes('importer-exporter') || code.includes('IEC')) {
    return 'Entity PAN Card, Bank Account Certificate or Cancelled Cheque, DSC / e-Sign';
  }
  if (name.includes('land') || name.includes('allotment') || code.includes('LAND')) {
    return 'Detailed Project Report (DPR), Financing Sanction, Entity Registration (CIN/LLP)';
  }
  if (name.includes('drug') || name.includes('cdsco') || code.includes('CDSCO')) {
    return 'GMP Certification, Plant Layout Approved by State Licensing Authority, Technical Staff Bio-data';
  }
  if (name.includes('bis') || code.includes('CRS')) {
    return 'Product Test Report from BIS Accredited Laboratory, Trademark / Brand Authorization';
  }
  if (name.includes('peso') || code.includes('PESO')) {
    return 'Site Plan with Safety Distances, Storage Tank Fabrication Drawing, SPCB CTE';
  }
  if (name.includes('trade') || code.includes('TRD')) {
    return 'Registered Lease Deed / Tax Receipt, Fire Safety Self-declaration, Shop Act Registration';
  }

  return 'Entity PAN, Certificate of Incorporation / Business Registration, Site Ownership / Lease Deed';
}

/**
 * Core PDF Generator Function
 */
export async function generateApprovalRoadmapPdf(data: PdfRoadmapData): Promise<void> {
  const { projectDetails, approvals } = data;
  const sector = projectDetails.sector || 'General Business';
  const state = projectDetails.state || 'All States';
  const investment = projectDetails.investmentSize || 'Not specified';
  const planningStage = projectDetails.planningStage || 'New Business Setup';

  // Separate Central and State approvals
  const centralApprovals = approvals.filter(a => a.centralOrState === 'Central');
  const stateApprovals = approvals.filter(a => a.centralOrState === 'State');
  const totalApprovals = centralApprovals.length + stateApprovals.length;

  // Initialize jsPDF document (Portrait, A4, millimeters)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  const bottomMargin = 22;

  let currentY = 14;

  // Helper to check for page overflow
  const ensureSpace = (requiredHeight: number): void => {
    if (currentY + requiredHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = 18; // Start below running header
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. COVER / HEADER SECTION (Page 1)
  // ─────────────────────────────────────────────────────────────────────────────

  // Top Navy Banner Background
  const bannerHeight = 36;
  doc.setFillColor(7, 24, 44); // #07182C
  doc.rect(marginX, currentY, contentWidth, bannerHeight, 'F');

  // Tricolour Stripe along bottom of banner
  const stripeY = currentY + bannerHeight - 1.8;
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(marginX, stripeY, contentWidth / 3, 1.8, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(marginX + contentWidth / 3, stripeY, contentWidth / 3, 1.8, 'F');
  doc.setFillColor(19, 136, 8); // India Green
  doc.rect(marginX + (contentWidth / 3) * 2, stripeY, contentWidth / 3, 1.8, 'F');

  // Draw Logo Emblem inside banner
  drawSwagatEmblem(doc, marginX + 4, currentY + 4, 25);

  // Title Text next to emblem
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SWAGAT', marginX + 33, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('SINGLE WINDOW APPROVAL GATEWAY', marginX + 33, currentY + 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 193, 7); // Amber/Gold
  doc.text('APPROVAL ROADMAP', marginX + 33, currentY + 24);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Comprehensive PAN-India Statutory Clearances, Licenses & Approvals Report', marginX + 33, currentY + 29);

  currentY += bannerHeight + 5;

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PROJECT METADATA & SUMMARY COUNTERS
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(40);

  // Metadata Container Card
  const metaBoxHeight = 36;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, metaBoxHeight, 2, 2, 'FD');

  // Left Column: Project Parameters
  const col1X = marginX + 5;
  let textY = currentY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Project / Business:', col1X, textY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(sector, col1X + 36, textY);

  textY += 6.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('State / UT:', col1X, textY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136); // Teal
  doc.text(state, col1X + 36, textY);

  textY += 6.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Investment:', col1X, textY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(investment, col1X + 36, textY);

  textY += 6.5;
  const nowFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Generated On:', col1X, textY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(nowFormatted, col1X + 36, textY);

  // Right Column: Dynamic Counters (Total, Central, State)
  const counterBoxWidth = 26;
  const counterBoxHeight = 24;
  const startCounterX = marginX + contentWidth - (counterBoxWidth * 3 + 8);
  const counterY = currentY + 6;

  // Box 1: Total Approvals
  doc.setFillColor(7, 24, 44);
  doc.roundedRect(startCounterX, counterY, counterBoxWidth, counterBoxHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 193, 7); // Gold
  doc.text(`${totalApprovals}`, startCounterX + counterBoxWidth / 2, counterY + 11, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', startCounterX + counterBoxWidth / 2, counterY + 17, { align: 'center' });
  doc.text('APPROVALS', startCounterX + counterBoxWidth / 2, counterY + 21, { align: 'center' });

  // Box 2: Central Approvals
  const centralBoxX = startCounterX + counterBoxWidth + 3.5;
  doc.setFillColor(30, 58, 138); // Blue 900
  doc.roundedRect(centralBoxX, counterY, counterBoxWidth, counterBoxHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(147, 197, 253);
  doc.text(`${centralApprovals.length}`, centralBoxX + counterBoxWidth / 2, counterY + 11, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CENTRAL', centralBoxX + counterBoxWidth / 2, counterY + 17, { align: 'center' });
  doc.text('APPROVALS', centralBoxX + counterBoxWidth / 2, counterY + 21, { align: 'center' });

  // Box 3: State Approvals
  const stateBoxX = centralBoxX + counterBoxWidth + 3.5;
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.roundedRect(stateBoxX, counterY, counterBoxWidth, counterBoxHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(167, 243, 208);
  doc.text(`${stateApprovals.length}`, stateBoxX + counterBoxWidth / 2, counterY + 11, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('STATE', stateBoxX + counterBoxWidth / 2, counterY + 17, { align: 'center' });
  const stateLabel = state.length > 7 ? state.substring(0, 7) + '..' : state;
  doc.text(`(${stateLabel})`, stateBoxX + counterBoxWidth / 2, counterY + 21, { align: 'center' });

  currentY += metaBoxHeight + 6;

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. APPROVAL SUMMARY TABLE (Table of Contents)
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 24, 44);
  doc.text('APPROVAL SUMMARY', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Master statutory index of all ${totalApprovals} recommended clearances for ${sector} in ${state}.`, marginX, currentY + 4.5);

  currentY += 7;

  // Build Table Data for Central & State approvals
  const summaryRows: (string | number)[][] = [];
  let indexCounter = 1;

  centralApprovals.forEach((app) => {
    summaryRows.push([
      String(indexCounter++).padStart(2, '0'),
      app.name,
      'Central',
      app.department || app.ministry || 'Government of India',
      app.mandatory ? 'MANDATORY' : (app.status === 'Recommended' ? 'RECOMMENDED' : 'CONDITIONAL')
    ]);
  });

  stateApprovals.forEach((app) => {
    const dep = getTailoredDepartment(app, state);
    summaryRows.push([
      String(indexCounter++).padStart(2, '0'),
      app.name,
      `State (${state})`,
      dep,
      app.mandatory ? 'MANDATORY' : (app.status === 'Recommended' ? 'RECOMMENDED' : 'CONDITIONAL')
    ]);
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    head: [['#', 'Approval', 'Level', 'Department', 'Status']],
    body: summaryRows,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 24, 44],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2.2
    },
    styles: {
      fontSize: 7,
      cellPadding: 2.2,
      overflow: 'linebreak',
      textColor: [15, 23, 42]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 62, fontStyle: 'bold' },
      2: { cellWidth: 26 },
      3: { cellWidth: 58 },
      4: { cellWidth: 26, halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.column.index === 4) {
        const val = hookData.cell.raw;
        if (val === 'MANDATORY') {
          hookData.cell.styles.textColor = [185, 28, 28]; // Red 700
        } else if (val === 'RECOMMENDED') {
          hookData.cell.styles.textColor = [30, 58, 138]; // Blue 900
        } else {
          hookData.cell.styles.textColor = [180, 83, 9]; // Amber 700
        }
      }
      if (hookData.section === 'body' && hookData.column.index === 2) {
        const val = String(hookData.cell.raw || '');
        if (val === 'Central') {
          hookData.cell.styles.textColor = [29, 78, 216];
          hookData.cell.styles.fontStyle = 'bold';
        } else {
          hookData.cell.styles.textColor = [4, 120, 87];
          hookData.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. APPROVAL JOURNEY ROADMAP (Conceptual Sequence)
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(46);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 24, 44);
  doc.text('APPROVAL JOURNEY', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Conceptual single-window lifecycle sequence from business registration to final commercial operation.', marginX, currentY + 4.5);

  currentY += 8;

  const journeySteps = [
    { num: '01', title: 'Business Details', desc: 'Define sector, enterprise classification, capital investment and site location.' },
    { num: '02', title: 'Know Your Approvals', desc: 'Identify all mandatory Central and State clearances via SWAGAT engine.' },
    { num: '03', title: 'Central + State Clearances', desc: 'Parallel application filing via National & State Single Window Portals.' },
    { num: '04', title: 'Document Preparation', desc: 'DigiLocker verification, architectural blueprints & technical reports collation.' },
    { num: '05', title: 'Application Submission', desc: 'Single Common Application Form (CAF) with digital signature authorization.' },
    { num: '06', title: 'Department Review', desc: 'Joint inspections, technical scrutiny and inter-department verification.' },
    { num: '07', title: 'Queries & Decision', desc: 'Consolidated query resolution within 7 days, followed by statutory sanctions.' }
  ];

  const stepBoxWidth = (contentWidth - 6 * 2.5) / 7;
  const stepBoxHeight = 25;

  journeySteps.forEach((step, idx) => {
    const boxX = marginX + idx * (stepBoxWidth + 2.5);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, currentY, stepBoxWidth, stepBoxHeight, 1.5, 1.5, 'FD');

    // Number badge
    doc.setFillColor(7, 24, 44);
    doc.circle(boxX + stepBoxWidth / 2, currentY + 4.5, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(255, 255, 255);
    doc.text(step.num, boxX + stepBoxWidth / 2, currentY + 5.7, { align: 'center' });

    // Step Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(15, 23, 42);
    const titleLines = doc.splitTextToSize(step.title, stepBoxWidth - 2);
    doc.text(titleLines, boxX + stepBoxWidth / 2, currentY + 10.5, { align: 'center' });

    // Step Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(step.desc, stepBoxWidth - 2);
    doc.text(descLines, boxX + 1.5, currentY + 16);
  });

  currentY += stepBoxHeight + 3.5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Note: This is a conceptual roadmap only and must not falsely claim that all approvals always follow exactly this sequence.', marginX, currentY);

  currentY += 8;

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. APPROVAL DEPENDENCIES SECTION
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(38);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 24, 44);
  doc.text('APPROVAL DEPENDENCIES', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Sequential and parallel dependency structure governing statutory sanctions.', marginX, currentY + 4.5);

  currentY += 7.5;

  const depRows = [
    ['Phase 1: Pre-Establishment Prerequisites', 'Land Allotment / Possession Order -> Building Plan Approval -> Environmental Consent to Establish (CTE)'],
    ['Phase 2: Parallel Clearances', 'Fire Safety Provisional NOC  |  High Tension Industrial Power Sanction  |  Municipal Sanction'],
    ['Phase 3: Pre-Operation Sanctions', 'Pollution Consent to Operate (CTO) -> Factory License (DISH) -> Commercial Energization'],
    ['Phase 4: Commercial & Sector Registrations', 'FSSAI License (Food) / CDSCO (Pharma) / PESO (Chemicals) / BIS CRS / Importer-Exporter Code (IEC)']
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    head: [['Stage / Phase', 'Statutory Dependency Flow']],
    body: depRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 7.2,
      fontStyle: 'bold',
      cellPadding: 2
    },
    styles: {
      fontSize: 6.8,
      cellPadding: 2,
      textColor: [15, 23, 42]
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: [30, 58, 138] },
      1: { cellWidth: 127 }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 9;

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SECTION 1: CENTRAL APPROVALS (Complete Detailed Cards)
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(32);

  // Section Header Banner
  doc.setFillColor(30, 58, 138); // Blue 900
  doc.roundedRect(marginX, currentY, contentWidth, 9, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`CENTRAL APPROVALS (${centralApprovals.length})`, marginX + 4, currentY + 6.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(219, 234, 254);
  doc.text('Government of India Ministries & National Statutory Authorities', marginX + contentWidth - 4, currentY + 6.2, { align: 'right' });

  currentY += 13;

  if (centralApprovals.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('No specific Central approvals required for this project profile.', marginX, currentY);
    currentY += 8;
  } else {
    centralApprovals.forEach((app, i) => {
      const descLines = doc.splitTextToSize(app.longDescription || app.description || 'Statutory clearance issued under Central regulatory frameworks.', contentWidth - 10);
      const docsList = app.requiredDocuments && app.requiredDocuments.length > 0 
        ? app.requiredDocuments 
        : (app.documents || ['Entity PAN Card', 'Digital Signature Certificate', 'Authorized Signatory Proof']);
      const eligList = app.eligibility && app.eligibility.length > 0
        ? app.eligibility
        : [`Enterprises operating in ${sector} sector with capital investment of ${investment}`];
      
      const estimatedHeight = 55 + descLines.length * 3.5 + docsList.length * 3.2 + eligList.length * 3.2;

      ensureSpace(Math.min(estimatedHeight, 80));

      // Card Header strip (Blue for Central)
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginX, currentY, contentWidth, 8, 1.5, 1.5, 'F');

      // Left blue accent bar
      doc.setFillColor(37, 99, 235);
      doc.rect(marginX, currentY, 3.5, 8, 'F');

      // Header Number
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text(`APPROVAL ${String(i + 1).padStart(2, '0')}`, marginX + 6, currentY + 5.5);

      // Status Badge
      const statusText = app.mandatory ? 'MANDATORY' : (app.status === 'Recommended' ? 'RECOMMENDED' : 'CONDITIONAL');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      if (statusText === 'MANDATORY') {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(185, 28, 28);
      } else if (statusText === 'RECOMMENDED') {
        doc.setFillColor(219, 234, 254);
        doc.setTextColor(30, 58, 138);
      } else {
        doc.setFillColor(254, 243, 199);
        doc.setTextColor(180, 83, 9);
      }
      doc.roundedRect(marginX + contentWidth - 28, currentY + 1.8, 24, 4.4, 1, 1, 'F');
      doc.text(statusText, marginX + contentWidth - 16, currentY + 4.9, { align: 'center' });

      currentY += 12;

      // Approval Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(7, 24, 44);
      doc.text(`Approval Name: ${app.name}`, marginX + 3, currentY);

      currentY += 5.5;

      // Approval Level & Ministry & Department
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Approval Level: ', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text('Central', marginX + 24, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Department / Authority: ', marginX + 65, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.department || 'Central Government Authority', marginX + 97, currentY);

      currentY += 4.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Ministry: ', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.ministry || 'Government of India', marginX + 16, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Sector: ', marginX + 65, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.sector || sector, marginX + 76, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Category: ', marginX + 120, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.category || 'Statutory Permit', marginX + 135, currentY);

      currentY += 5;

      // Description
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(7, 24, 44);
      doc.text('Description:', marginX + 3, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(51, 65, 85);
      doc.text(descLines, marginX + 3, currentY);
      currentY += descLines.length * 3.2 + 2;

      // Applicability / Eligibility
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(7, 24, 44);
      doc.text('Applicability / Eligibility:', marginX + 3, currentY);
      currentY += 3.2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      eligList.forEach((elig) => {
        doc.text(`• ${elig}`, marginX + 5, currentY);
        currentY += 3.2;
      });

      // Required Documents
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(7, 24, 44);
      doc.text('Required Documents:', marginX + 3, currentY);
      currentY += 3.2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      docsList.forEach((docItem) => {
        doc.text(`• ${docItem}`, marginX + 5, currentY);
        currentY += 3.2;
      });

      // Processing Time / SLA & Fee & Renewal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text('Processing Time / SLA:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(` ${app.processingDays || 30} Days`, marginX + 32, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Fee:', marginX + 65, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(` ${app.statutoryFee || 'As applicable'}`, marginX + 72, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Renewal:', marginX + 120, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(` ${app.validityYears || 'Periodic'}`, marginX + 133, currentY);

      currentY += 4.5;

      // Application Method & URL & Dependencies
      const deps = getApprovalDependencies(app);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      doc.text('Dependencies:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(` ${deps}`, marginX + 22, currentY);

      currentY += 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(37, 99, 235);
      doc.text('Application Method:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(` Online (SWAGAT National Single Window Portal / Ministry System)`, marginX + 28, currentY);

      currentY += 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(37, 99, 235);
      doc.text('Application URL:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(` ${app.applicationUrl || 'https://swagat.gov.in/portal/central'}`, marginX + 24, currentY);

      currentY += 5.5;

      // Separator line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginX, currentY, marginX + contentWidth, currentY);
      currentY += 6;
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. SECTION 2: STATE APPROVALS (Complete Detailed Cards)
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(32);

  // Section Header Banner
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.roundedRect(marginX, currentY, contentWidth, 9, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`STATE APPROVALS — ${state.toUpperCase()} (${stateApprovals.length})`, marginX + 4, currentY + 6.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(209, 250, 229);
  doc.text(`Government of ${state} Single Window Clearance Authorities`, marginX + contentWidth - 4, currentY + 6.2, { align: 'right' });

  currentY += 13;

  if (stateApprovals.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`No specific State approvals required for ${state} under current parameters.`, marginX, currentY);
    currentY += 8;
  } else {
    stateApprovals.forEach((app, i) => {
      const tailoredDep = getTailoredDepartment(app, state);
      const descLines = doc.splitTextToSize(app.longDescription || app.description || `Statutory clearance issued under ${state} state regulatory acts and Single Window frameworks.`, contentWidth - 10);
      const docsList = app.requiredDocuments && app.requiredDocuments.length > 0 
        ? app.requiredDocuments 
        : (app.documents || ['Site Layout Plan', 'Land Title Deed', 'Building Approvals', 'Pollution Control Scheme']);
      const eligList = app.eligibility && app.eligibility.length > 0
        ? app.eligibility
        : [`Industrial and commercial units situated within the State of ${state}`];

      const estimatedHeight = 55 + descLines.length * 3.5 + docsList.length * 3.2 + eligList.length * 3.2;

      ensureSpace(Math.min(estimatedHeight, 80));

      // Header strip (Emerald for State)
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginX, currentY, contentWidth, 8, 1.5, 1.5, 'F');

      // Left emerald accent bar
      doc.setFillColor(5, 150, 105);
      doc.rect(marginX, currentY, 3.5, 8, 'F');

      // Header Number
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(6, 95, 70);
      doc.text(`APPROVAL ${String(i + 1).padStart(2, '0')}`, marginX + 6, currentY + 5.5);

      // Status Badge
      const statusText = app.mandatory ? 'MANDATORY' : (app.status === 'Recommended' ? 'RECOMMENDED' : 'CONDITIONAL');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      if (statusText === 'MANDATORY') {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(185, 28, 28);
      } else if (statusText === 'RECOMMENDED') {
        doc.setFillColor(219, 234, 254);
        doc.setTextColor(30, 58, 138);
      } else {
        doc.setFillColor(254, 243, 199);
        doc.setTextColor(180, 83, 9);
      }
      doc.roundedRect(marginX + contentWidth - 28, currentY + 1.8, 24, 4.4, 1, 1, 'F');
      doc.text(statusText, marginX + contentWidth - 16, currentY + 4.9, { align: 'center' });

      currentY += 12;

      // Approval Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(7, 24, 44);
      doc.text(`Approval Name: ${app.name}`, marginX + 3, currentY);

      currentY += 5.5;

      // Approval Level & State & Department
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Approval Level: ', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text('State', marginX + 24, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('State: ', marginX + 45, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(state, marginX + 55, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Department / Authority: ', marginX + 85, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(tailoredDep, marginX + 117, currentY);

      currentY += 4.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Ministry / Department: ', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.ministry || `${state} State Government`, marginX + 32, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Sector: ', marginX + 95, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.sector || sector, marginX + 106, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Category: ', marginX + 135, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(app.category || 'State Statutory Permit', marginX + 150, currentY);

      currentY += 5;

      // Description
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(7, 24, 44);
      doc.text('Description:', marginX + 3, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(51, 65, 85);
      doc.text(descLines, marginX + 3, currentY);
      currentY += descLines.length * 3.2 + 2;

      // Applicability / Eligibility
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(7, 24, 44);
      doc.text('Applicability / Eligibility:', marginX + 3, currentY);
      currentY += 3.2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      eligList.forEach((elig) => {
        doc.text(`• ${elig}`, marginX + 5, currentY);
        currentY += 3.2;
      });

      // Required Documents
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(7, 24, 44);
      doc.text('Required Documents:', marginX + 3, currentY);
      currentY += 3.2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      docsList.forEach((docItem) => {
        doc.text(`• ${docItem}`, marginX + 5, currentY);
        currentY += 3.2;
      });

      // Processing Time / SLA & Fee & Renewal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text('Processing Time / SLA:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(` ${app.processingDays || 30} Days`, marginX + 32, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Fee:', marginX + 65, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(` ${app.statutoryFee || 'State Gazetted Schedule'}`, marginX + 72, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Renewal:', marginX + 120, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(` ${app.validityYears || 'Renewable'}`, marginX + 133, currentY);

      currentY += 4.5;

      // Dependencies & Portal
      const deps = getApprovalDependencies(app);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      doc.text('Dependencies:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(` ${deps}`, marginX + 22, currentY);

      currentY += 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(5, 150, 105);
      doc.text('Application Method:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(` Online (${state} Single Window Clearance System / SWAGAT Portal)`, marginX + 28, currentY);

      currentY += 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(5, 150, 105);
      doc.text('Application URL:', marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(` ${app.applicationUrl || `https://${sanitizeFileName(state).toLowerCase()}.swagat.gov.in`}`, marginX + 24, currentY);

      currentY += 5.5;

      // Separator line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginX, currentY, marginX + contentWidth, currentY);
      currentY += 6;
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. CONSOLIDATED DOCUMENT CHECKLIST
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(45);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 24, 44);
  doc.text('DOCUMENT CHECKLIST', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Grouped required documents across all recommended approvals with cross-approval mapping.', marginX, currentY + 4.5);

  currentY += 8;

  // Build mapping: Document -> List of approvals requiring it
  const docMap: { [docName: string]: string[] } = {};

  approvals.forEach((app) => {
    const list = app.requiredDocuments && app.requiredDocuments.length > 0 
      ? app.requiredDocuments 
      : (app.documents || []);
    list.forEach((docItem) => {
      const trimmed = docItem.trim();
      if (!docMap[trimmed]) {
        docMap[trimmed] = [];
      }
      if (!docMap[trimmed].includes(app.name)) {
        docMap[trimmed].push(app.name);
      }
    });
  });

  // Convert docMap into table rows
  const docChecklistRows: (string | number)[][] = [];

  Object.keys(docMap).forEach((docName) => {
    const requiredFor = docMap[docName].map(name => `• ${name}`).join('\n');
    docChecklistRows.push([
      '[   ]',
      docName,
      requiredFor
    ]);
  });

  if (docChecklistRows.length === 0) {
    docChecklistRows.push(['[   ]', 'Company Incorporation Certificate (SPICe+) & PAN', '• Company Incorporation\n• MSME Udyam Registration']);
    docChecklistRows.push(['[   ]', 'Site Layout & Architectural Floor Plan', '• Consent to Establish (CTE)\n• Factory License\n• Fire Safety Clearance']);
    docChecklistRows.push(['[   ]', 'Land Possession / Lease Agreement & NA Sanction', '• Industrial Land Allotment\n• Power Sanction\n• Municipal Clearance']);
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    head: [['Check', 'Document Name', 'Required For:']],
    body: docChecklistRows,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 24, 44],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 2.2
    },
    styles: {
      fontSize: 6.8,
      cellPadding: 2.2,
      overflow: 'linebreak',
      textColor: [15, 23, 42]
    },
    columnStyles: {
      0: { cellWidth: 12, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 68, fontStyle: 'bold' },
      2: { cellWidth: 102, textColor: [71, 85, 105] }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. STATUTORY ADVISORY & INVESTOR ASSURANCE
  // ─────────────────────────────────────────────────────────────────────────────

  ensureSpace(28);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(7, 24, 44);
  doc.text('STATUTORY INVESTOR ASSURANCE & SERVICE LEVEL GUARANTEE (SLA)', marginX + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  const advisory1 = `1. Deemed Approval: Under ${state} Single Window Clearance Act, if a department does not respond within statutory SLA days, the clearance is eligible for Deemed Sanction.`;
  const advisory2 = `2. Unified Query Management: Multiple department queries must be raised in a consolidated single window manner within 7 working days of application scrutiny.`;
  const advisory3 = `3. DigiLocker Integration: Self-attested digital documents fetched from DigiLocker repository have legal validity under Section 9A of the IT Act 2000.`;

  doc.text(advisory1, marginX + 4, currentY + 10.5);
  doc.text(advisory2, marginX + 4, currentY + 15);
  doc.text(advisory3, marginX + 4, currentY + 19.5);

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. STAMP RUNNING HEADER & FOOTER ON ALL PAGES
  // ─────────────────────────────────────────────────────────────────────────────

  const totalPages = doc.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);

    // Running Header (Pages 2+)
    if (pageNum > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(7, 24, 44);
      doc.text('SWAGAT — Single Window Approval Gateway', marginX, 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Approval Roadmap Report • ${sector} • ${state}`, marginX + contentWidth, 10, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(marginX, 12, marginX + contentWidth, 12);
    }

    // Running Footer (All Pages)
    const footerY = pageHeight - 11;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, footerY - 2.5, marginX + contentWidth, footerY - 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(7, 24, 44);
    doc.text('SWAGAT — Single Window Approval Gateway', marginX, footerY + 1.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Confidential / User Generated Report', marginX + 68, footerY + 1.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(7, 24, 44);
    doc.text(`Page ${pageNum} of ${totalPages}`, marginX + contentWidth, footerY + 1.5, { align: 'right' });

    // Regulatory Disclaimer Line
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Approval requirements may vary based on project-specific conditions and applicable regulations. Verify current requirements with the concerned authority before submission.',
      marginX,
      footerY + 5.5
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. GENERATE DYNAMIC FILENAME AND TRIGGER DOWNLOAD
  // ─────────────────────────────────────────────────────────────────────────────

  const sanitizedState = sanitizeFileName(state);
  const sanitizedSector = sanitizeFileName(sector);
  const filename = `SWAGAT_${sanitizedState}_${sanitizedSector}_Approval_Roadmap.pdf`;

  doc.save(filename);
}
