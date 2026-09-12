/**
 * SWAGAT Single Window Portal — Comprehensive Sector Decision Trees
 * Provides tailored, distinct decision trees for all 10 business sectors / industries
 * across the 4 statutory steps:
 * 1. business_registration
 * 2. business_activity
 * 3. foreign_investment
 * 4. project_land
 */

import { WizardStep } from '../types/swagat';

export interface TreeOption {
  id: string;
  label: string;
  description?: string;
  isLeaf: boolean;
  nextQuestionId?: string;
  recommendations?: string[];
  requiredDocs?: string[];
}

export interface TreeQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: TreeOption[];
}

export interface SectorTreeData {
  sectorCode: string;
  sectorName: string;
  steps: {
    business_registration: TreeQuestion[];
    business_activity: TreeQuestion[];
    foreign_investment: TreeQuestion[];
    project_land: TreeQuestion[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTOR-SPECIFIC DECISION TREES FOR ALL 10 SECTORS
// ─────────────────────────────────────────────────────────────────────────────

export const SECTOR_TREES: Record<string, SectorTreeData> = {
  // ── 1. HOTEL & HOSPITALITY ─────────────────────────────────────────────────
  HOTEL: {
    sectorCode: 'HOTEL',
    sectorName: 'Hotel & Hospitality',
    steps: {
      business_registration: [
        {
          id: 'hotel-br-q1',
          question: 'What type of legal entity is being registered for this hospitality project?',
          subtitle: 'Select the legal operating structure under the Ministry of Corporate Affairs (MCA).',
          options: [
            {
              id: 'hotel-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Recommended for star hotels, resorts, & multi-key commercial properties.',
              isLeaf: true,
              recommendations: ['Certificate of Incorporation (MCA)', 'Company PAN & TAN', 'Director Identification (DIN)'],
              requiredDocs: ['Certificate of Incorporation (MOA/AOA)', 'Company PAN Card', 'Board Resolution for Authorized Signatory'],
            },
            {
              id: 'hotel-br-o2',
              label: 'Limited Liability Partnership (LLP)',
              description: 'Suited for boutique retreats, family resorts, and joint hospitality investors.',
              isLeaf: true,
              recommendations: ['LLP Agreement filing', 'DPIN registration', 'Designated Partners PAN'],
              requiredDocs: ['Registered LLP Agreement', 'LLP PAN Card', 'Designated Partner KYC'],
            },
            {
              id: 'hotel-br-o3',
              label: 'Proprietorship / Sole Trader',
              description: 'Best for local homestays, bed-and-breakfasts, and budget motels.',
              isLeaf: true,
              recommendations: ['MSME Udyam Registration', 'Current Account Opening', 'Local Trade License'],
              requiredDocs: ['MSME Udyam Certificate', 'Proprietor PAN & Aadhaar', 'Bank Verification Proof'],
            },
            {
              id: 'hotel-br-o4',
              label: 'Public Limited Company (Ltd)',
              description: 'For large destination resort developments with institutional/public equity.',
              isLeaf: true,
              recommendations: ['ROC Incorporation', 'Commencement of Business Certificate', 'SEBI compliance (if listed)'],
              requiredDocs: ['Certificate of Incorporation', 'Audited Balance Sheet / Prospectus', 'Company PAN & GSTIN'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'hotel-ba-q1',
          question: 'What is the scale and classification of the hospitality property?',
          subtitle: 'Determines the statutory clearances for tourism rating, kitchen, and entertainment.',
          options: [
            {
              id: 'hotel-ba-o1',
              label: '5-Star Deluxe / Luxury Heritage Resort (>100 Keys)',
              description: 'Full-service luxury hospitality with multi-cuisine dining, banqueting, and recreation.',
              isLeaf: false,
              nextQuestionId: 'hotel-ba-q2-luxury',
            },
            {
              id: 'hotel-ba-o2',
              label: '3-Star / 4-Star Business Hotel (40 to 100 Keys)',
              description: 'Mid-scale business travel hotel with conference facilities and dining.',
              isLeaf: false,
              nextQuestionId: 'hotel-ba-q2-mid',
            },
            {
              id: 'hotel-ba-o3',
              label: 'Eco-Resort / Beachfront Wellness Retreat (20 to 50 Keys)',
              description: 'Nature-centric stay, wellness spa, and coastal/forest proximity accommodations.',
              isLeaf: false,
              nextQuestionId: 'hotel-ba-q2-eco',
            },
            {
              id: 'hotel-ba-o4',
              label: 'Budget Hotel / Serviced Apartment / Guest House (<40 Keys)',
              description: 'Standard lodging and short-term stay with compact breakfast facilities.',
              isLeaf: true,
              recommendations: ['State FSSAI Food License', 'Municipal Health Trade License', 'Police Sarai Act Registration', 'Fire Safety Undertaking'],
              requiredDocs: ['Municipal Trade License Copy', 'Kitchen Layout & FSSAI Registration', 'Local Police Verification Report'],
            },
          ],
        },
        {
          id: 'hotel-ba-q2-luxury',
          question: 'Will the luxury property include licensed bar, swimming pool, & event banqueting?',
          subtitle: 'Specific permits apply for liquor service, sound permits, and water hygiene.',
          options: [
            {
              id: 'hotel-ba-o2a',
              label: 'Full Liquor Bar (FL-3) + Swimming Pool + Banquet Hall (>500 pax)',
              description: 'Requires comprehensive excise, water treatment, sound, and public assembly clearances.',
              isLeaf: true,
              recommendations: ['State Excise FL-3 Liquor License', 'Swimming Pool Safety & Water Hygiene NOC', 'Fire Department Assembly Clearance', 'Public Performance Music License (PPL/IPRS)', 'Central FSSAI License'],
              requiredDocs: ['Bar Blueprint & Storage Plan', 'Fire System Layout (Hydrants/Sprinklers)', 'Swimming Pool Structural & Filtration Design', 'Central FSSAI Application'],
            },
            {
              id: 'hotel-ba-o2b',
              label: 'Restaurant & Banquet only (No Alcoholic Beverages)',
              description: 'Non-alcoholic luxury dining, wedding banquets, and conference facilities.',
              isLeaf: true,
              recommendations: ['Central FSSAI License', 'Municipal Eating House Trade License', 'Fire Safety NOC', 'DG Set Noise & Pollution Consent'],
              requiredDocs: ['FSSAI Food Safety Management System (FSMS) Plan', 'Kitchen Ventilation & Chimney Height Approval', 'Fire NOC Certificate'],
            },
          ],
        },
        {
          id: 'hotel-ba-q2-mid',
          question: 'What food and beverage amenities will be operated on premise?',
          subtitle: 'Determines FSSAI classification and municipal eating house license requirements.',
          options: [
            {
              id: 'hotel-ba-o2m1',
              label: '24-Hour Multi-Cuisine Restaurant + Bar Service',
              description: 'Excise bar permit, 24/7 operating permission, and commercial kitchen grease trap.',
              isLeaf: true,
              recommendations: ['State Excise Bar License', 'State FSSAI License', 'Shops & Establishment 24x7 Exemption', 'Municipal Eating House Permit'],
              requiredDocs: ['Kitchen Layout Blueprint', 'Excise Premises Solvency Certificate', 'Police Eating House Registration'],
            },
            {
              id: 'hotel-ba-o2m2',
              label: 'Coffee Shop & Resident Dining Hall only',
              description: 'Standard restaurant facilities dedicated primarily to hotel guests.',
              isLeaf: true,
              recommendations: ['State FSSAI License', 'Municipal Lodging & Boarding License', 'Fire Safety NOC'],
              requiredDocs: ['FSSAI Application Form', 'Municipal Assessment Tax Receipt', 'Fire NOC'],
            },
          ],
        },
        {
          id: 'hotel-ba-q2-eco',
          question: 'Does the eco-retreat property operate spa, Ayurveda wellness, or coastal activities?',
          subtitle: 'Healthcare, water sports, and environmental conservation norms apply.',
          options: [
            {
              id: 'hotel-ba-o2e1',
              label: 'Ayurveda Spa & Wellness Center with Treatment Suites',
              description: 'Requires AYUSH board intimation and biomedical/herbal waste management approval.',
              isLeaf: true,
              recommendations: ['State AYUSH Certification', 'SPCB Bio-Medical Waste Consent', 'Swimming Pool & Spa Hygiene Clearance'],
              requiredDocs: ['AYUSH Doctor/Therapist Credentials', 'Sewage & Organic Waste Treatment Plan', 'Local Panchayat NOC'],
            },
            {
              id: 'hotel-ba-o2e2',
              label: 'Water-Sports & Beach Access Shack',
              description: 'Requires Maritime Board permit and Coastal Regulation Zone (CRZ) clearance.',
              isLeaf: true,
              recommendations: ['Maritime Board Water-Sports Safety NOC', 'CRZ-III Compliance Certificate', 'Life-Saving Equipment Audit'],
              requiredDocs: ['CRZ Clearance Map from Authorized Agency', 'Boat & Safety Gear Inspection Certificate'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'hotel-fi-q1',
          question: 'Does the project involve Foreign Direct Investment (FDI) or international hotel branding?',
          subtitle: 'Under Indian FDI policy, 100% FDI is allowed under Automatic Route for Tourism & Hospitality.',
          options: [
            {
              id: 'hotel-fi-o1',
              label: '100% Domestic Indian Capital & Ownership',
              description: 'Financed purely through Indian promoters, domestic banks, or NBFCs.',
              isLeaf: true,
              recommendations: ['Standard domestic banking KYC', 'MSME benefit eligibility (if applicable)'],
              requiredDocs: ['Promoter Bank Statements', 'CA Certified Net Worth / Financing Plan'],
            },
            {
              id: 'hotel-fi-o2',
              label: 'International Chain Franchise / Brand Affiliation (Marriott, Hilton, etc.)',
              description: 'Foreign brand franchise, management agreement, and technical fee remittance.',
              isLeaf: true,
              recommendations: ['RBI FEMA Automatic Route Intimation', 'Franchise Royalty Agreement Filing', 'Withholding Tax Assessment'],
              requiredDocs: ['Franchise / Technical Service Agreement Copy', 'Chartered Accountant FEMA Certificate'],
            },
            {
              id: 'hotel-fi-o3',
              label: 'Foreign Equity Investment (FDI Inflow)',
              description: 'Equity participation from foreign entities, NRIs, or sovereign wealth funds.',
              isLeaf: true,
              recommendations: ['100% FDI Automatic Route compliance', 'RBI FIRMS Portal Form FC-GPR filing within 30 days of equity allotment'],
              requiredDocs: ['Foreign Inward Remittance Certificate (FIRC)', 'Know Your Customer (KYC) of Foreign Investor', 'Valuation Certificate by SEBI Merchant Banker'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'hotel-pl-q1',
          question: 'What is the land zoning and site location for the hotel property?',
          subtitle: 'Land clearances vary significantly between urban municipal commercial plots and eco/coastal zones.',
          options: [
            {
              id: 'hotel-pl-o1',
              label: 'Commercial Urban Plot in Municipal Corporation Area',
              description: 'Plot already demarcated for commercial/hospitality use in master plan.',
              isLeaf: true,
              recommendations: ['Municipal Building Plan Sanction', 'Fire Dept Height NOC', 'Water Supply Board Connection Sanction'],
              requiredDocs: ['Sale Deed / 30-Year Registered Lease Agreement', 'Sanctioned Architectural Building Plan', 'Property Tax Assessment Receipt'],
            },
            {
              id: 'hotel-pl-o2',
              label: 'Tourism Zone / State Tourism Development Allotment',
              description: 'Land allotted by State Tourism Corporation (e.g., MTDC, KSTDC, RTDC).',
              isLeaf: true,
              recommendations: ['State Tourism Industrial Status Subsidies', 'Concessional Stamp Duty Certificate', 'State Single Window Fast-Track'],
              requiredDocs: ['Tourism Corporation Allotment Letter', 'Possession Certificate', 'Project Feasibility DPR'],
            },
            {
              id: 'hotel-pl-o3',
              label: 'Agricultural / Rural Land requiring Conversion (Non-Agricultural)',
              description: 'Requires District Collector conversion order for resort/commercial use.',
              isLeaf: true,
              recommendations: ['Section 44 / Land Revenue Code NA Conversion Order', 'Gram Panchayat NOC', 'Access Road Right of Way'],
              requiredDocs: ['Revenue Record of Rights (7/12 or RTC)', 'District Collector NA Order', 'Gram Panchayat Building Resolution'],
            },
            {
              id: 'hotel-pl-o4',
              label: 'Coastal Waterfront Plot (<500m from High Tide Line)',
              description: 'Subject to Coastal Regulation Zone (CRZ-III) notifications.',
              isLeaf: true,
              recommendations: ['State Coastal Zone Management Authority (SCZMA) Clearance', 'MoEFCC Eco-Sensitive Clearance'],
              requiredDocs: ['HTL/LTL Demarcation Map by NCZMA agency', 'Environment Impact Assessment (EIA) Brief', 'SCZMA Recommendation Letter'],
            },
          ],
        },
      ],
    },
  },

  // ── 2. PETROLEUM & FUEL RETAIL ─────────────────────────────────────────────
  PETRO: {
    sectorCode: 'PETRO',
    sectorName: 'Petroleum & Fuel Retail',
    steps: {
      business_registration: [
        {
          id: 'petro-br-q1',
          question: 'What is the business operating structure for the petroleum facility?',
          subtitle: 'Oil marketing company dealership or standalone commercial fuel retail entity.',
          options: [
            {
              id: 'petro-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Mandatory for commercial fuel logistics, bulk consumer storage, and fleet stations.',
              isLeaf: true,
              recommendations: ['MCA Incorporation', 'PESO Authorized Signatory Designation', 'GSTIN with Petroleum HSN'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN', 'Board Resolution for Petroleum Ops'],
            },
            {
              id: 'petro-br-o2',
              label: 'Sole Proprietorship with OMC Dealership LOI',
              description: 'Standard retail fuel outlet franchise allotted by IOCL, BPCL, HPCL, or Nayara.',
              isLeaf: true,
              recommendations: ['Letter of Intent (LOI) validation from OMC', 'Dealer Agreement', 'Udyam Registration'],
              requiredDocs: ['OMC Letter of Intent (LOI)', 'Dealer PAN & Identity Proof', 'Dealership Candidature Selection Letter'],
            },
            {
              id: 'petro-br-o3',
              label: 'Partnership Firm for Joint Highway Fuel Plaza',
              description: 'Multi-partner firm developing integrated fuel, EV, and food highway hub.',
              isLeaf: true,
              recommendations: ['Registered Partnership Deed', 'Firm PAN & GSTIN', 'OMC Multi-Partner Clearance'],
              requiredDocs: ['Registered Partnership Deed', 'Firm PAN Card', 'OMC Joint Acceptance Letter'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'petro-ba-q1',
          question: 'What fuel products and storage capacities will be installed?',
          subtitle: 'Governed by Petroleum Rules 2002 and Explosives Act under PESO.',
          options: [
            {
              id: 'petro-ba-o1',
              label: 'Retail Motor Spirit (MS) & High Speed Diesel (HSD) (>45 KL Storage)',
              description: 'Large retail outlet with multiple underground tanks for petrol and diesel.',
              isLeaf: false,
              nextQuestionId: 'petro-ba-q2-fuel',
            },
            {
              id: 'petro-ba-o2',
              label: 'Compressed Natural Gas (CNG) / Bio-CNG Retail Dispensing Station',
              description: 'Daughter booster or online CNG station with cascade storage.',
              isLeaf: true,
              recommendations: ['PESO Gas Cylinder Rules License', 'City Gas Distribution (CGD) Tie-Up', 'Static & Mobile Pressure Vessels (SMPV) License'],
              requiredDocs: ['CNG Cascade Hydro-Testing Certificate', 'PESO Prior Approval Layout', 'Flame-Proof Electrical Certificate'],
            },
            {
              id: 'petro-ba-o3',
              label: 'Liquefied Petroleum Gas (LPG) Commercial Bottling & Storage',
              description: 'Bulk LPG mounded bullets and cylinder filling carousel plant.',
              isLeaf: true,
              recommendations: ['PESO SMPV (Unfired) Rules License', 'Factory Inspector License', 'State Pollution Control Board Red Category Consent'],
              requiredDocs: ['PESO Approved Tank Blueprint', 'HAZOP & Risk Assessment Report', 'Fire Fighting Deluge Water System Plan'],
            },
          ],
        },
        {
          id: 'petro-ba-q2-fuel',
          question: 'Will the outlet feature an EV Fast-Charging Hub and Commercial Highway Plaza?',
          subtitle: 'Safety buffer zones and electrical transformer clearances apply.',
          options: [
            {
              id: 'petro-ba-o2a',
              label: 'Integrated Green Energy Plaza (Fuel + DC Fast EV Chargers + Food Court)',
              description: 'Multi-modal highway station with 150 kW DC EV charging and F&B complex.',
              isLeaf: true,
              recommendations: ['CEA Electrical Safety Inspector Clearance for HT Transformer', 'PESO Safety Distance Buffer Compliance', 'Highway Commercial Access NOC'],
              requiredDocs: ['Electrical Single Line Diagram (SLD)', 'PESO Distance Matrix Verification', 'Transformer Test Report'],
            },
            {
              id: 'petro-ba-o2b',
              label: 'Standard Petroleum Retail Outlet (Fuel Dispensing only)',
              description: 'Underground tanks, dispensing units, air tower, and sales building.',
              isLeaf: true,
              recommendations: ['PESO Form XIV License to Store & Dispense', 'District Magistrate DM/DC Rule 144 NOC', 'Weights & Measures Calibration Certificate'],
              requiredDocs: ['PESO Form XIV Application Copy', 'DM / Police / Revenue Rule 144 NOC', 'Underground Tank Pressure Test Certificate'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'petro-fi-q1',
          question: 'What is the investment and equity source for this petroleum infrastructure?',
          subtitle: 'FDI in fuel retail requires minimum statutory investment commitments.',
          options: [
            {
              id: 'petro-fi-o1',
              label: '100% Domestic Indian OMC Dealership',
              description: 'Standard retail dealership model with authorized Indian OMC franchise.',
              isLeaf: true,
              recommendations: ['Standard Indian banking compliance', 'Dealer security deposit verification'],
              requiredDocs: ['Bank Solvency Certificate for OMC Norms', 'Financial Net Worth Statement'],
            },
            {
              id: 'petro-fi-o2',
              label: 'Private Commercial Fuel Retail FDI (Shell, TotalEnergies, etc.)',
              description: '100% Automatic FDI allowed subject to ₹2,000 Cr investment or 5% green energy stations.',
              isLeaf: true,
              recommendations: ['Ministry of Petroleum & Natural Gas (MoPNG) Authorization', 'RBI FC-GPR Filing'],
              requiredDocs: ['MoPNG Fuel Retail Authorization Letter', 'FDI Inward Remittance FIRC Certificate'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'petro-pl-q1',
          question: 'What is the road frontage and land ownership type for the fuel outlet?',
          subtitle: 'NHAI / State PWD IRC norms dictate minimum frontage and distance from intersections.',
          options: [
            {
              id: 'petro-pl-o1',
              label: 'National Highway (NH) Frontage (Min 35m x 35m plot)',
              description: 'Located directly along a National Highway governed by Ministry of Road Transport (MoRTH).',
              isLeaf: true,
              recommendations: ['NHAI Highway Access Permission & Deceleration Lane License', 'IRC:12-2009 Norms Compliance', 'Tree Felling NOC from Forest Dept'],
              requiredDocs: ['NHAI Access Blueprint with Deceleration Lane', 'Land 30-Year Registered Lease/Sale Deed', 'Forest Dept Highway Clearance (if applicable)'],
            },
            {
              id: 'petro-pl-o2',
              label: 'State Highway (SH) / Major District Road (MDR) Frontage',
              description: 'Governed by State Public Works Department (PWD) road access guidelines.',
              isLeaf: true,
              recommendations: ['State PWD Road Access NOC', 'District Collector Rule 144 NOC', 'Gram Panchayat / Municipality NOC'],
              requiredDocs: ['PWD Sanctioned Access Layout', 'Revenue Record of Rights (7/12 or Jamabandi)', 'District Magistrate Notice Clearance'],
            },
            {
              id: 'petro-pl-o3',
              label: 'Municipal City / Urban Commercial Site',
              description: 'City plot meeting municipal fire safety buffer and traffic police NOC criteria.',
              isLeaf: true,
              recommendations: ['Municipal Corporation Development NOC', 'Traffic Police Department Clearance', 'Fire Brigade Site NOC'],
              requiredDocs: ['Municipal Sanctioned Layout', 'City Traffic Police Feasibility Report', 'Fire Dept Site Verification Report'],
            },
          ],
        },
      ],
    },
  },

  // ── 3. LEATHER & FOOTWEAR ──────────────────────────────────────────────────
  LEATHER: {
    sectorCode: 'LEATHER',
    sectorName: 'Leather & Footwear',
    steps: {
      business_registration: [
        {
          id: 'leather-br-q1',
          question: 'What is the corporate format for the leather & footwear enterprise?',
          subtitle: 'Export Oriented Unit (EOU) or domestic manufacturing entity.',
          options: [
            {
              id: 'leather-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Recommended for export-oriented units (EOU) with global buyers.',
              isLeaf: true,
              recommendations: ['Directorate General of Foreign Trade (DGFT) IEC Code', 'Council for Leather Exports (CLE) Membership', 'MCA Incorporation'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN Card', 'Import Export Code (IEC) Copy'],
            },
            {
              id: 'leather-br-o2',
              label: 'Partnership / LLP Manufacturing Entity',
              description: 'Standard for shoe upper, saddlery, and leather accessories fabrication.',
              isLeaf: true,
              recommendations: ['Registered Partnership Deed', 'MSME Registration', 'CLE Registration-cum-Membership (RCMC)'],
              requiredDocs: ['Partnership Deed / LLP Agreement', 'Firm PAN & GSTIN', 'RCMC Certificate'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'leather-ba-q1',
          question: 'What is the manufacturing and chemical process category?',
          subtitle: 'Tanneries are classified under CPCB Red Category; Footwear assembly is Green/Orange.',
          options: [
            {
              id: 'leather-ba-o1',
              label: 'Raw Hide to Wet-Blue & Finished Leather Tanning (Red Category)',
              description: 'Chemical beamhouse operations, chrome tanning, and heavy effluent generation.',
              isLeaf: true,
              recommendations: ['Common Effluent Treatment Plant (CETP) Dedicated Membership', 'Zero Liquid Discharge (ZLD) Multi-Effect Evaporator Mandate', 'State Pollution Control Board Consent to Establish (CTE Red)', 'Chromium Recovery Unit Installation'],
              requiredDocs: ['ZLD Plant Engineering Blueprint', 'CETP Membership Allotment Certificate', 'Hazardous Waste Authorization Form'],
            },
            {
              id: 'leather-ba-o2',
              label: 'Footwear Manufacturing & Stitching (Using Finished Leather)',
              description: 'Sole molding, upper cutting, lasting, and adhesive bonding (Orange/Green Category).',
              isLeaf: true,
              recommendations: ['SPCB Orange Category Consent', 'Directorate of Industrial Safety & Health (DISH) Factory License', 'Solvent Vapor Ventilation System'],
              requiredDocs: ['Factory Layout Plan', 'Machinery Horsepower Sanction', 'Solvent Safety Data Sheet (MSDS)'],
            },
            {
              id: 'leather-ba-o3',
              label: 'Leather Goods, Garments & Accessories Assembly',
              description: 'Bags, jackets, belts, and wallets assembly with non-hazardous stitching (Green Category).',
              isLeaf: true,
              recommendations: ['SPCB Green Category White-Listed Intimation', 'Factory Inspector Registration', 'Local Fire NOC'],
              requiredDocs: ['Factory Building Stability Certificate', 'Power Load Sanction Document'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'leather-fi-q1',
          question: 'Does the footwear project involve foreign joint ventures or 100% export funding?',
          subtitle: '100% Automatic FDI allowed in footwear manufacturing.',
          options: [
            {
              id: 'leather-fi-o1',
              label: '100% Domestic Indian Capital',
              description: 'Financed through Indian promoters and domestic commercial lenders.',
              isLeaf: true,
              recommendations: ['Domestic banking credit sanction', 'Indian Footwear & Leather Development Programme (IFLDP) subsidy eligibility'],
              requiredDocs: ['Project Detailed Project Report (DPR)', 'Bank Loan Sanction Letter'],
            },
            {
              id: 'leather-fi-o2',
              label: 'Foreign Equity FDI / International Brand Joint Venture',
              description: 'Foreign brand partner investing in contract manufacturing for global retail.',
              isLeaf: true,
              recommendations: ['Automatic Route FDI Form FC-GPR filing', 'DPIIT Industrial License Exemption'],
              requiredDocs: ['Joint Venture Agreement', 'Foreign Remittance FIRC Proof'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'leather-pl-q1',
          question: 'Where will the facility be located?',
          subtitle: 'Tanneries are restricted to notified leather industrial clusters with operational CETPs.',
          options: [
            {
              id: 'leather-pl-o1',
              label: 'Notified Leather Park / Mega Leather Footwear Complex (MLFAP)',
              description: 'Government industrial park (e.g., Ranipet, Kanpur, Ambur, Jalandhar) with CETP.',
              isLeaf: true,
              recommendations: ['State Industrial Corp Allotment', 'CETP Pipeline Connection Permission', 'Subsidized Power Tariff'],
              requiredDocs: ['Industrial Development Corp Lease Deed', 'CETP Conveyance Pipeline Approval'],
            },
            {
              id: 'leather-pl-o2',
              label: 'General Industrial Estate (Footwear / Goods Assembly only)',
              description: 'Industrial estate for non-polluting dry footwear assembly.',
              isLeaf: true,
              recommendations: ['Industrial Estate Association NOC', 'Factory Building Plan Approval'],
              requiredDocs: ['Allotment Possession Letter', 'Site Layout Blueprint'],
            },
          ],
        },
      ],
    },
  },

  // ── 4. FOOD PROCESSING & PACKAGING ─────────────────────────────────────────
  FOOD: {
    sectorCode: 'FOOD',
    sectorName: 'Food Processing & Packaging',
    steps: {
      business_registration: [
        {
          id: 'food-br-q1',
          question: 'What is the corporate registration format for the food business?',
          subtitle: 'Entity structure registered with MCA and mapped to FSSAI licensing.',
          options: [
            {
              id: 'food-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Mandatory for commercial food processing, cold chains, and FMCG brands.',
              isLeaf: true,
              recommendations: ['Certificate of Incorporation', 'Central FSSAI Registration Mapping', 'Company PAN & GSTIN'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN', 'Food Safety Management Plan Outline'],
            },
            {
              id: 'food-br-o2',
              label: 'Farmer Producer Company (FPC / FPO)',
              description: 'Collectives of farmers processing grains, pulses, dairy, and horticulture.',
              isLeaf: true,
              recommendations: ['NABARD / SFAC Recognition', 'Special Agriculture Subsidies', 'FSSAI Special FPO Tier'],
              requiredDocs: ['FPC Incorporation Certificate', 'Farmer Member Roster', 'NABARD Support Letter'],
            },
            {
              id: 'food-br-o3',
              label: 'Partnership / Sole Proprietor Agro-Processing Unit',
              description: 'Local oil mills, flour mills, spice grinding, and bakery units.',
              isLeaf: true,
              recommendations: ['MSME Udyam Registration', 'State FSSAI License', 'Gram Panchayat Trade License'],
              requiredDocs: ['Udyam Certificate', 'Proprietor / Partner KYC', 'Premises Lease/Ownership Deed'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'food-ba-q1',
          question: 'What food processing category and production capacity will be established?',
          subtitle: 'FSSAI jurisdiction transitions from State to Central at >2 Metric Tonnes per day.',
          options: [
            {
              id: 'food-ba-o1',
              label: 'Large Scale Commercial Processing (>2 MT / Day or Dairy >10,000 LPD)',
              description: 'Beverages, edible oil refineries, dairy plants, ready-to-eat packaged snacks.',
              isLeaf: true,
              recommendations: ['Central FSSAI License (FoSCoS Central)', 'SPCB Industrial Effluent ETP Consent', 'Boiler Inspector Sanction for Steam Processing', 'Weights & Measures Legal Metrology Packaged Commodities Registration'],
              requiredDocs: ['FSSAI Water Testing Potability Report (IS 10500)', 'Hazard Analysis Critical Control Point (HACCP) Plan', 'Food Technologist / Chemist Qualification Credentials', 'Machinery List with Capacities'],
            },
            {
              id: 'food-ba-o2',
              label: 'Meat, Poultry, or Seafood Processing & Cold Storage',
              description: 'Abattoirs, frozen poultry, and seafood processing for domestic and export markets.',
              isLeaf: true,
              recommendations: ['EIA Environmental Clearance (if slaughterhouse)', 'Central FSSAI License', 'Export Inspection Council (EIC) Approval (for export)', 'SPCB Bio-Effluent ETP & Rendering Plant Consent'],
              requiredDocs: ['Veterinary Health Inspection Certification', 'EIC / APEDA Registration (if export)', 'Effluent Treatment & Odor Control Engineering Report'],
            },
            {
              id: 'food-ba-o3',
              label: 'Micro / Small Food Processing Unit (<2 MT / Day)',
              description: 'Spices, pickles, local bakery, grain sorting, honey packaging, and dry condiments.',
              isLeaf: true,
              recommendations: ['State FSSAI License', 'Factory Inspector Small Unit Consent', 'Local Fire Undertaking'],
              requiredDocs: ['Drinking Water Lab Test Report', 'Equipment Layout Diagram', 'FSSAI Form B Application'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'food-fi-q1',
          question: 'Does the venture involve Foreign Direct Investment or import of processed foods?',
          subtitle: '100% FDI permitted under Automatic Route for food products manufactured in India.',
          options: [
            {
              id: 'food-fi-o1',
              label: '100% Domestic Indian Capital',
              description: 'Financed by Indian promoters with Ministry of Food Processing (MoFPI) subsidy eligibility.',
              isLeaf: true,
              recommendations: ['Pradhan Mantri Kisan SAMPADA Yojana (PMKSY) eligibility', 'Domestic bank project term loan'],
              requiredDocs: ['Detailed Project Report (DPR) for Food Processing', 'Bank Appraisal Sanction'],
            },
            {
              id: 'food-fi-o2',
              label: 'Foreign Equity FDI (100% Automatic Route)',
              description: '100% FDI allowed under Automatic Route for food manufacturing and cold chain.',
              isLeaf: true,
              recommendations: ['RBI Form FC-GPR filing', 'DPIIT Industrial Entrepreneur Memorandum (IEM)'],
              requiredDocs: ['FIRC Inward Remittance Certificate', 'Foreign Investor KYC Proof'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'food-pl-q1',
          question: 'Where will the food manufacturing and cold chain plant be constructed?',
          subtitle: 'Food safety norms mandate minimum distances from chemical factories, open drains, and tanneries.',
          options: [
            {
              id: 'food-pl-o1',
              label: 'Mega Food Park / Designated Food Processing Zone',
              description: 'MoFPI approved Mega Food Park with central testing labs and cold storage.',
              isLeaf: true,
              recommendations: ['Mega Food Park Common Facility Centre (CFC) access', 'Fast-track Single Window Allotment', 'State Capital Investment Subsidy'],
              requiredDocs: ['Food Park Plot Allotment Letter', 'Common Infrastructure Agreement'],
            },
            {
              id: 'food-pl-o2',
              label: 'State Industrial Development Corporation (SIDC) Industrial Estate',
              description: 'Plot in a general manufacturing estate situated away from polluting industries.',
              isLeaf: true,
              recommendations: ['Food grade hygiene boundary verification', 'SIDC Plot Lease Registration'],
              requiredDocs: ['Industrial Plot Lease Deed', 'Sanctioned Factory Layout Plan'],
            },
            {
              id: 'food-pl-o3',
              label: 'Agricultural Land with Food Processing NA Conversion',
              description: 'Direct farm-gate aggregation and processing facility on converted rural land.',
              isLeaf: true,
              recommendations: ['Agro-Processing Fast-Track NA Conversion Order', 'Groundwater Extraction (CGWA) NOC', 'Local Panchayat NOC'],
              requiredDocs: ['District Collector NA Sanction', 'CGWA Borewell NOC', 'Panchayat Resolution'],
            },
          ],
        },
      ],
    },
  },

  // ── 5. GENERAL MANUFACTURING ───────────────────────────────────────────────
  MFG: {
    sectorCode: 'MFG',
    sectorName: 'General Manufacturing',
    steps: {
      business_registration: [
        {
          id: 'mfg-br-q1',
          question: 'What is the corporate entity format for the manufacturing facility?',
          subtitle: 'Corporate classification under Companies Act 2013.',
          options: [
            {
              id: 'mfg-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Standard for auto components, precision machining, and engineering factories.',
              isLeaf: true,
              recommendations: ['Certificate of Incorporation', 'Company PAN & GSTIN', 'Factory License mapping'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN Card', 'Board Resolution for Factory Occupier'],
            },
            {
              id: 'mfg-br-o2',
              label: 'Limited Liability Partnership (LLP)',
              description: 'For fabrication workshops, tool-and-die shops, and sub-assembly units.',
              isLeaf: true,
              recommendations: ['Registered LLP Agreement', 'Partner DPINs', 'MSME Udyam Certificate'],
              requiredDocs: ['Registered LLP Deed', 'LLP PAN Card', 'Partner KYC'],
            },
            {
              id: 'mfg-br-o3',
              label: 'Public Limited Company (Ltd)',
              description: 'For large heavy engineering and capital equipment plants.',
              isLeaf: true,
              recommendations: ['MCA Incorporation', 'SEBI / Stock Exchange Disclosures (if listed)'],
              requiredDocs: ['Certificate of Incorporation', 'Audited Accounts / Financial Net Worth Proof'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'mfg-ba-q1',
          question: 'What is the CPCB pollution classification & connected power load?',
          subtitle: 'Red, Orange, and Green categories dictate pollution control board consents and inspections.',
          options: [
            {
              id: 'mfg-ba-o1',
              label: 'Red Category (Electroplating, Foundry, Heat Treatment, Heavy Chemical Processing)',
              description: 'High environmental impact; requires comprehensive ETP, air scrubbers, and online monitoring.',
              isLeaf: true,
              recommendations: ['State Pollution Control Board Consent to Establish (CTE Red)', 'Continuous Online Effluent Monitoring System (OCEMS)', 'Hazardous Waste Management Authorization (Form 1)', 'Factory License with DISH Full Scrutiny'],
              requiredDocs: ['Effluent Treatment Plant (ETP) Detailed Engineering Blueprint', 'Air Pollution Control Equipment (Cyclone/Bag Filter) Specs', 'Hazardous Waste Storage Site Plan'],
            },
            {
              id: 'mfg-ba-o2',
              label: 'Orange Category (Machining, Metal Fabrication, Plastic Injection Molding, Assembly)',
              description: 'Moderate pollution load with localized paint booth or oil separation requirements.',
              isLeaf: true,
              recommendations: ['SPCB Consent to Establish (CTE Orange)', 'Factory License for Occupier & Manager', 'DISH Machinery Guarding Compliance'],
              requiredDocs: ['Plant Layout with Machinery Positions', 'Power Sanction Letter from DISCOM', 'Oil-Water Separator Details'],
            },
            {
              id: 'mfg-ba-o3',
              label: 'Green / White Category (Electronics Assembly, Tool Assembly, Packaging & Sorting)',
              description: 'Zero/negligible pollution discharge with dry assembly processes.',
              isLeaf: true,
              recommendations: ['Fast-Track SPCB Green Consent / White Category Intimation', 'Factory License Intimation', 'Local Fire Undertaking'],
              requiredDocs: ['Electrical Load Sanction', 'Building Stability Certificate by Chartered Engineer'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'mfg-fi-q1',
          question: 'Does the project involve Foreign Direct Investment under Make in India?',
          subtitle: '100% FDI is permitted under Automatic Route in most manufacturing sectors.',
          options: [
            {
              id: 'mfg-fi-o1',
              label: '100% Domestic Indian Capital',
              description: 'Financed by Indian promoters, domestic banks, or government credit guarantee schemes.',
              isLeaf: true,
              recommendations: ['Emergency Credit Line / PLI Scheme eligibility check', 'Domestic bank term loan'],
              requiredDocs: ['Promoter Financial Statements', 'Bank Term Loan Sanction Letter'],
            },
            {
              id: 'mfg-fi-o2',
              label: 'Foreign Equity FDI (100% Automatic Route)',
              description: 'Direct investment by foreign parent company or multinational Tier-1 supplier.',
              isLeaf: true,
              recommendations: ['RBI Form FC-GPR filing within 30 days', 'DPIIT Industrial Entrepreneur Memorandum (IEM Part A)'],
              requiredDocs: ['FIRC Inward Remittance Proof', 'Foreign Investor KYC', 'DPIIT IEM Part-A Acknowledgement'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'mfg-pl-q1',
          question: 'What is the industrial land acquisition status?',
          subtitle: 'Industrial estates provided by SIDC (e.g., GIDC, MIDC, KIADB, RIICO, SIPCOT) offer fast-tracked zoning.',
          options: [
            {
              id: 'mfg-pl-o1',
              label: 'Allotted Plot in State Industrial Development Corporation (SIDC) Park',
              description: 'Pre-zoned industrial land with ready water, HT power, and road connectivity.',
              isLeaf: true,
              recommendations: ['SIDC Lease Deed Registration', 'Pre-cleared industrial zoning exemption from NA conversion', 'Subsidized Power Substation Tie-Up'],
              requiredDocs: ['SIDC Allotment Order', 'Possession Certificate', 'Sanctioned Site Layout Map'],
            },
            {
              id: 'mfg-pl-o2',
              label: 'Private Freehold Industrial Land (Requires NA Conversion)',
              description: 'Private land acquired outside notified parks; requires revenue conversion and village panchayat NOC.',
              isLeaf: true,
              recommendations: ['District Collector Non-Agricultural (Industrial NA) Order', 'Gram Panchayat / Town Planning NOC', 'Groundwater CGWA NOC'],
              requiredDocs: ['Revenue Record of Rights (7/12 or Jamabandi)', 'District Collector Industrial NA Order', 'Gram Panchayat Building Permission'],
            },
          ],
        },
      ],
    },
  },

  // ── 6. IT / SOFTWARE SERVICES ──────────────────────────────────────────────
  IT_ITES: {
    sectorCode: 'IT_ITES',
    sectorName: 'IT / Software Services',
    steps: {
      business_registration: [
        {
          id: 'it-br-q1',
          question: 'What is the corporate registration model for the technology company?',
          subtitle: 'Structure under MCA, STPI, or SEZ authorities.',
          options: [
            {
              id: 'it-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Industry standard for SaaS startups, IT services, and venture-funded tech companies.',
              isLeaf: true,
              recommendations: ['Startup India DPIIT Recognition', 'Software Technology Parks of India (STPI) Registration', 'Shops & Establishment 24x7 Exemption'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN Card', 'DPIIT Startup Certificate (if applicable)'],
            },
            {
              id: 'it-br-o2',
              label: 'Global Capability Center (GCC) / Wholly Owned Subsidiary (WOS)',
              description: 'Indian captive development center for global tech multinationals.',
              isLeaf: true,
              recommendations: ['RBI FEMA FDI compliance', 'Special Economic Zone (SEZ) Letter of Approval (LOA)', 'STPI Non-STPI registration for customs duty bonding'],
              requiredDocs: ['Certificate of Incorporation', 'Parent Company Authorization Letter', 'SEZ / STPI Approval Letter'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'it-ba-q1',
          question: 'What is the operational scope of the tech facility?',
          subtitle: 'Specific permits apply for data centers, call centers, and telecom infrastructure.',
          options: [
            {
              id: 'it-ba-o1',
              label: 'Software Development & SaaS Engineering Office',
              description: 'Standard office tech floor with workstations, cloud server access, and engineering teams.',
              isLeaf: true,
              recommendations: ['Shops & Establishments Registration with 24x7 Night Shift Exemption for Women', 'Local Municipal Trade License', 'Fire Safety NOC'],
              requiredDocs: ['Commercial Lease Deed', 'Office Layout with Emergency Exits', 'Shops & Establishment Application'],
            },
            {
              id: 'it-ba-o2',
              label: 'BPO / Call Centre / Customer Support (Voice & Non-Voice)',
              description: 'Involves international voice telecom routing and PSTN/VoIP connectivity.',
              isLeaf: true,
              recommendations: ['Department of Telecommunications (DoT) Other Service Provider (OSP) Registration', 'Telecom Interconnect Compliance', 'Shops & Establishments Night Shift NOC'],
              requiredDocs: ['DoT OSP Application Copy', 'Telecom Network Architecture Diagram', 'Shops & Establishment Registration'],
            },
            {
              id: 'it-ba-o3',
              label: 'Colocation Tier-III / Tier-IV Hyperscale Data Centre',
              description: 'Heavy critical power, diesel generator farm, thermal cooling, and dual telecom fibers.',
              isLeaf: true,
              recommendations: ['Central Electricity Authority (CEA) HT Substation Clearance (>10 MW)', 'SPCB DG Set Air Consent for Backup Generators', 'PESO Bulk Diesel Storage License (>20 KL for DG fuel)', 'Data Centre Building Structural Floor Loading NOC'],
              requiredDocs: ['CEA Electrical SLD Blueprint', 'PESO Diesel Tank Approval', 'SPCB DG Noise/Air Consent Application'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'it-fi-q1',
          question: 'Does the tech venture involve Foreign Direct Investment (FDI) or Venture Capital?',
          subtitle: '100% FDI is permitted under Automatic Route in IT, SaaS, and Data Centres.',
          options: [
            {
              id: 'it-fi-o1',
              label: '100% Domestic Indian Promoters / Domestic VC',
              description: 'Financed through Indian founders, angel investors, or SEBI-registered AIFs.',
              isLeaf: true,
              recommendations: ['Standard domestic banking KYC', 'Startup India Seed Fund eligibility'],
              requiredDocs: ['Cap Table & Shareholding Pattern', 'Bank Account Verification'],
            },
            {
              id: 'it-fi-o2',
              label: 'Foreign FDI / Global VC Funding / US Parent Holding (Delaware Flip / Direct)',
              description: 'Equity from Silicon Valley VCs, global funds, or foreign holding corporations.',
              isLeaf: true,
              recommendations: ['RBI Form FC-GPR filing within 30 days', 'FEMA Cross-Border Pricing Guidelines by Merchant Banker'],
              requiredDocs: ['FIRC Bank Inward Remittance Certificate', 'Foreign Investor KYC Proof', 'Valuation Certificate'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'it-pl-q1',
          question: 'What is the premises and commercial office setup?',
          subtitle: 'Tech parks and SEZs offer plug-and-play approvals and dual power feed.',
          options: [
            {
              id: 'it-pl-o1',
              label: 'Leased Commercial Tech Park / Coworking Campus (Pre-Approved)',
              description: 'Occupying space in a notified IT Tech Park (e.g., Manyata, Mindspace, CyberCity).',
              isLeaf: true,
              recommendations: ['Sub-lease registration', 'Tech Park Operator Fit-Out NOC', 'Local Shops Act Transfer'],
              requiredDocs: ['Commercial Lease Deed with Tech Park', 'Building Fire NOC of Master Park', 'Floor Layout Blueprint'],
            },
            {
              id: 'it-pl-o2',
              label: 'Special Economic Zone (SEZ) Dedicated IT Unit',
              description: 'Operating in an IT/ITeS SEZ for zero custom duty on imported IT hardware and zero GST.',
              isLeaf: true,
              recommendations: ['Development Commissioner SEZ Letter of Approval (LOA)', 'Bonded Warehouse Customs License', 'SEZ Online Portal Registration'],
              requiredDocs: ['SEZ Unit Application Form', 'SEZ Letter of Approval (LOA)', '5-Year Export Projection DPR'],
            },
            {
              id: 'it-pl-o3',
              label: 'Independent Green-Field Tech Campus / Data Center Construction',
              description: 'Purchasing land to construct an owned corporate IT campus or data center building.',
              isLeaf: true,
              recommendations: ['Municipal Building Plan Sanction with IT FAR Incentive', 'Dual Grid Power Evacuation Sanction from DISCOM', 'Fire Dept Height Clearance'],
              requiredDocs: ['Registered Land Deed', 'Sanctioned Architectural Plans', 'DISCOM HT Substation Feasibility'],
            },
          ],
        },
      ],
    },
  },

  // ── 7. PHARMACEUTICAL & LIFE SCIENCES ──────────────────────────────────────
  PHARMA: {
    sectorCode: 'PHARMA',
    sectorName: 'Pharmaceutical & Life Sciences',
    steps: {
      business_registration: [
        {
          id: 'pharma-br-q1',
          question: 'What is the corporate structure for the pharmaceutical manufacturing entity?',
          subtitle: 'Subject to Drug Controller General of India (DCGI / CDSCO) statutory director norms.',
          options: [
            {
              id: 'pharma-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Mandatory for FDA licensed drug manufacturing, sterile injectables, and bulk drugs.',
              isLeaf: true,
              recommendations: ['MCA Incorporation', 'Drug Manufacturing License Applicant Registration', 'Company PAN & GSTIN'],
              requiredDocs: ['Certificate of Incorporation (MOA/AOA)', 'Approved Qualified Technical Directors Roster', 'Company PAN Card'],
            },
            {
              id: 'pharma-br-o2',
              label: 'Public Limited Company (Ltd)',
              description: 'For large pharma corporations with international regulatory filings (USFDA, EMA).',
              isLeaf: true,
              recommendations: ['Central CDSCO Fast-Track', 'Form 25/28 License', 'Commencement of Business Certificate'],
              requiredDocs: ['Certificate of Incorporation', 'Audited Financial Net Worth Statement'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'pharma-ba-q1',
          question: 'What pharma manufacturing class and dosage forms will be produced?',
          subtitle: 'Determines whether CDSCO (Central) or State FDA issues Form 25 or Form 28 manufacturing licenses.',
          options: [
            {
              id: 'pharma-ba-o1',
              label: 'Active Pharmaceutical Ingredients (API) & Bulk Synthetic Chemistry (Red Category)',
              description: 'Chemical synthesis of raw medicinal molecules; heavy solvent handling and VOC emissions.',
              isLeaf: true,
              recommendations: ['MoEFCC Central Environmental Clearance (Category A/B1)', 'SPCB Red Category Consent with Zero Liquid Discharge (ZLD)', 'State FDA Manufacturing License Form 25', 'PESO Solvent Bulk Storage License'],
              requiredDocs: ['Environmental Clearance (EC) Letter', 'ZLD & Solvent Recovery System Blueprint', 'FDA Site Master File', 'Hazardous Waste Authorization'],
            },
            {
              id: 'pharma-ba-o2',
              label: 'Sterile Injectables, Vaccines & Biologicals (Class 100 / Grade A Cleanrooms)',
              description: 'Injectable ampoules, vials, lyophilized powders, and recombinant bio-therapeutics.',
              isLeaf: true,
              recommendations: ['Central CDSCO Manufacturing License (Form 28 / 28-D)', 'HVAC AHU Validation & Cleanroom Certification (ISO 14644)', 'WHO-GMP & Schedule M Certificate', 'Biomedical Waste SPCB Authorization'],
              requiredDocs: ['Cleanroom HVAC DQ/IQ/OQ/PQ Validation Protocol', 'Water for Injection (WFI) Loop Generation P&ID', 'FDA Approved Technical Staff Approvals'],
            },
            {
              id: 'pharma-ba-o3',
              label: 'Solid Oral Formulations (Tablets, Capsules, Syrups, Ointments)',
              description: 'Non-sterile oral dosages complying with Schedule M Revised Good Manufacturing Practices.',
              isLeaf: true,
              recommendations: ['State FDA Form 25 Manufacturing License', 'Revised Schedule M GMP Compliance Certification', 'SPCB Orange Category ETP Consent'],
              requiredDocs: ['Site Master File (SMF)', 'List of Approved Manufacturing Machinery', 'Approved Pharmacist & Analytical Chemist Registration Certificates'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'pharma-fi-q1',
          question: 'What is the foreign investment structure for this pharmaceutical plant?',
          subtitle: 'Greenfield pharma allows 100% Automatic FDI; Brownfield acquisitions above 74% require Government Approval.',
          options: [
            {
              id: 'pharma-fi-o1',
              label: '100% Greenfield Manufacturing (New Facility from Scratch)',
              description: '100% FDI allowed under Automatic Route without prior government approval.',
              isLeaf: true,
              recommendations: ['100% Automatic Route RBI Form FC-GPR filing', 'DPIIT Industrial License Exemption'],
              requiredDocs: ['Greenfield Undertaking Affidavit', 'FIRC Bank Remittance Certificate', 'Foreign Investor KYC'],
            },
            {
              id: 'pharma-fi-o2',
              label: 'Brownfield Investment / Acquisition of Existing Indian Pharma Asset',
              description: 'FDI up to 74% is Automatic; beyond 74% requires National Single Window clearance from Dept of Pharmaceuticals.',
              isLeaf: true,
              recommendations: ['Department of Pharmaceuticals (DoP) Prior Approval (if >74%)', 'Competition Commission of India (CCI) NOC (if applicable)'],
              requiredDocs: ['Share Purchase Agreement', 'Government Approval Letter (if >74%)', 'Valuation Report'],
            },
            {
              id: 'pharma-fi-o3',
              label: '100% Domestic Indian Capital',
              description: 'Financed through Indian promoters and domestic institutional banking.',
              isLeaf: true,
              recommendations: ['Production Linked Incentive (PLI) Scheme for Bulk Drugs eligibility check'],
              requiredDocs: ['Promoter Bank Appraisal Report', 'Term Loan Sanction Letter'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'pharma-pl-q1',
          question: 'Where will the pharmaceutical facility be sited?',
          subtitle: 'API plants are restricted to notified industrial pharma clusters with specialized infrastructure.',
          options: [
            {
              id: 'pharma-pl-o1',
              label: 'Dedicated Pharma SEZ / Mega Bulk Drug Park',
              description: 'Pre-zoned pharmaceutical cluster with common solvent recovery and CETP ZLD facilities.',
              isLeaf: true,
              recommendations: ['Industrial Development Corp Lease Registration', 'Pre-cleared Environmental Clearance cluster benefit', 'Steam & Gas utility tie-up'],
              requiredDocs: ['Pharma Park Allotment Letter', 'Common ETP / Utility Connectivity Agreement'],
            },
            {
              id: 'pharma-pl-o2',
              label: 'General Industrial Zone (Formulations only)',
              description: 'Suitable for dry oral formulation plants with internal mini-ETP.',
              isLeaf: true,
              recommendations: ['State IDC Plot Allotment', 'Industrial Layout Approval by DISH'],
              requiredDocs: ['Industrial Land Lease Deed', 'Sanctioned Factory Layout Plan'],
            },
          ],
        },
      ],
    },
  },

  // ── 8. RENEWABLE ENERGY ───────────────────────────────────────────────────
  RENEWABLE: {
    sectorCode: 'RENEWABLE',
    sectorName: 'Renewable Energy',
    steps: {
      business_registration: [
        {
          id: 're-br-q1',
          question: 'What is the corporate vehicle for the renewable power project?',
          subtitle: 'Special Purpose Vehicles (SPVs) are standard for power purchase agreement (PPA) project financing.',
          options: [
            {
              id: 're-br-o1',
              label: 'Special Purpose Vehicle (SPV) Private Limited Company',
              description: 'Project-specific entity incorporated solely to build and operate the specific solar/wind farm.',
              isLeaf: true,
              recommendations: ['Certificate of Incorporation', 'Articles of Association tailored to PPA lender step-in rights', 'SPV PAN & GSTIN'],
              requiredDocs: ['Certificate of Incorporation', 'SPV MOA/AOA', 'Board Resolution for Power Utility Bidding'],
            },
            {
              id: 're-br-o2',
              label: 'Existing Independent Power Producer (IPP) Corporate Entity',
              description: 'Expanding renewable portfolio under the main parent balance sheet.',
              isLeaf: true,
              recommendations: ['PPA Signing Authorization', 'State Nodal Agency Registration'],
              requiredDocs: ['Company Incorporation Certificate', 'Parent Company Track Record & Balance Sheet'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 're-ba-q1',
          question: 'What is the renewable generation technology and project capacity?',
          subtitle: 'Interconnection voltage and nodal agencies depend on MW scale.',
          options: [
            {
              id: 're-ba-o1',
              label: 'Utility-Scale Ground-Mounted Solar PV (>50 MW)',
              description: 'Large-scale solar plant evacuating power into Inter-State (ISTS) or State (InSTS) grid.',
              isLeaf: true,
              recommendations: ['Central Transmission Utility (CTU / PowerGrid) Connectivity Sanction at 132/220 kV', 'Solar Energy Corporation of India (SECI) / State Discom PPA', 'Central Electricity Authority (CEA) Technical Approval', 'Aviation Obstacle Clearance from Airport Authority (AAI)'],
              requiredDocs: ['Grid Connectivity Feasibility Letter from CTU/STU', 'Signed 25-Year Power Purchase Agreement (PPA)', 'Solar Insolation / Generation Yield Simulation Report (PVSyst)'],
            },
            {
              id: 're-ba-o2',
              label: 'Onshore Wind Power Farm (Multi-Turbine Setup)',
              description: 'Wind turbine generators evacuating through dedicated pooling substation.',
              isLeaf: true,
              recommendations: ['Ministry of New & Renewable Energy (MNRE) Approved Wind Turbine Model List (RLMM) verification', 'Civil Aviation AAI Height Clearance for Wind Masts', 'State Grid Pooling Substation Connectivity NOC'],
              requiredDocs: ['Wind Resource Assessment & Micro-Siting Study', 'AAI Height Clearance Certificate', 'Grid Connectivity Agreement'],
            },
            {
              id: 're-ba-o3',
              label: 'Compressed Bio-Gas (CBG) / Biomass Waste-to-Energy Plant',
              description: 'Anaerobic digestion of agricultural crop residue into bio-CNG under SATAT initiative.',
              isLeaf: true,
              recommendations: ['SATAT Commercial Offtake Tie-Up with OMCs', 'PESO Compressed Bio-Gas Storage License', 'SPCB Red/Orange Category Consent with Organic Compost Clearance'],
              requiredDocs: ['OMC Long-Term Commercial Offtake Agreement', 'PESO Plant Layout Approval', 'Biomass Feedstock Supply Assurance Agreement'],
            },
            {
              id: 're-ba-o4',
              label: 'Commercial & Industrial (C&I) Rooftop Solar (<5 MW)',
              description: 'Behind-the-meter or net-metered solar plant on industrial factory roofs.',
              isLeaf: true,
              recommendations: ['Discom Net-Metering / Open Access Sanction', 'Roof Structural Stability Certificate by Chartered Engineer', 'Electrical Inspectorate Safety NOC'],
              requiredDocs: ['Discom Sanction Letter', 'Structural Load Bearing Certificate', 'Electrical SLD Diagram'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 're-fi-q1',
          question: 'What is the financing model and foreign equity component for the power plant?',
          subtitle: '100% FDI allowed under Automatic Route in Renewable Energy generation & equipment.',
          options: [
            {
              id: 're-fi-o1',
              label: '100% FDI under Automatic Route (International Infrastructure Funds)',
              description: 'Backed by global green energy funds, pension funds, or sovereign investors.',
              isLeaf: true,
              recommendations: ['RBI Form FC-GPR filing within 30 days', 'External Commercial Borrowing (ECB) compliance for green bonds'],
              requiredDocs: ['FIRC Bank Certificate', 'Foreign Investor KYC Proof', 'Project Information Memorandum'],
            },
            {
              id: 're-fi-o2',
              label: 'Domestic Bank & Institutional Debt (IREDA / PFC / REC Consortium)',
              description: 'Financed by Indian financial institutions specialized in power infrastructure.',
              isLeaf: true,
              recommendations: ['IREDA / PFC / REC Term Loan Syndication', 'Lenders Independent Engineer (LIE) audit'],
              requiredDocs: ['Detailed Project Report (DPR)', 'Lender Consortium Sanction Letter'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 're-pl-q1',
          question: 'What is the land arrangement for the solar or wind project footprint?',
          subtitle: 'Utility scale solar requires approximately 4 acres per Megawatt (MW).',
          options: [
            {
              id: 're-pl-o1',
              label: 'Government Solar Park Allotment (Ultra Mega Renewable Energy Park)',
              description: 'Land and common pooling substation provided by State Solar Park Implementation Agency (SPIA).',
              isLeaf: true,
              recommendations: ['Solar Park Developer Agreement', 'Pre-cleared boundary with boundary wall and road network', 'Zero private acquisition disputes'],
              requiredDocs: ['SPIA Plot Allocation Letter', 'Solar Park Implementation Agreement'],
            },
            {
              id: 're-pl-o2',
              label: 'Private Barren / Agricultural Land Aggregation (30-Year Registered Lease)',
              description: 'Aggregating hundreds of acres directly from private landholders for ground-mounted installation.',
              isLeaf: true,
              recommendations: ['State Renewable Energy Policy Exemption from Land Ceiling limits', 'Fast-Track Non-Agricultural (Solar NA) Conversion', 'Right of Way (RoW) for Transmission Line Corridors'],
              requiredDocs: ['Registered 30-Year Lease Deeds', 'District Collector Land Ceiling Exemption Order', 'Transmission Line RoW Agreements'],
            },
          ],
        },
      ],
    },
  },

  // ── 9. TEXTILE & APPAREL ───────────────────────────────────────────────────
  TEXTILE: {
    sectorCode: 'TEXTILE',
    sectorName: 'Textile & Apparel',
    steps: {
      business_registration: [
        {
          id: 'textile-br-q1',
          question: 'What is the corporate format for the textile or garmenting venture?',
          subtitle: 'Registered with MCA and Textile Commissioner / Export Promotion Council.',
          options: [
            {
              id: 'textile-br-o1',
              label: 'Private Limited Company (Pvt Ltd)',
              description: 'Standard for composite mills, integrated spinning-weaving, and garment exporters.',
              isLeaf: true,
              recommendations: ['Apparel Export Promotion Council (AEPC) Membership', 'DGFT IEC Code', 'MCA Incorporation'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN Card', 'Import Export Code (IEC)'],
            },
            {
              id: 'textile-br-o2',
              label: 'Partnership / LLP Textile Weaving Unit',
              description: 'Common for powerloom clusters, knitting units, and yarn trading operations.',
              isLeaf: true,
              recommendations: ['Office of Textile Commissioner Loom Registration', 'MSME Udyam Certificate'],
              requiredDocs: ['Partnership Deed / LLP Agreement', 'Firm PAN & GSTIN', 'Textile Commissioner Intimation'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'textile-ba-q1',
          question: 'What is the processing segment and effluent generation profile?',
          subtitle: 'Wet dyeing and bleaching plants are CPCB Red Category; Garment stitching is Green.',
          options: [
            {
              id: 'textile-ba-o1',
              label: 'Wet Processing (Yarn / Fabric Dyeing, Bleaching, Printing, Washing) — Red Category',
              description: 'High water usage, heavy dye chemical bath, and salt discharge requiring multi-stage treatment.',
              isLeaf: true,
              recommendations: ['Mandatory Zero Liquid Discharge (ZLD) with Reverse Osmosis & Mechanical Vapor Recompression (MVR)', 'SPCB Red Category Consent to Establish', 'IBR Steam Boiler Inspector Sanction for Drying Cylinders'],
              requiredDocs: ['ZLD Engineering Detailed Blueprint', 'Water Recovery & Salt Crystallizer Specs', 'Boiler Layout & Steam Pipe Line Drawings'],
            },
            {
              id: 'textile-ba-o2',
              label: 'Dry Processing (Spinning, Weaving, Knitting, Yarn Doubling) — Orange Category',
              description: 'Fiber-to-yarn and yarn-to-cloth mechanical operations with dust and noise generation.',
              isLeaf: true,
              recommendations: ['SPCB Orange Category Consent', 'DISH Factory Inspector Humidification Plant Approval', 'Pneumatic Dust Extraction Compliance'],
              requiredDocs: ['Factory Machine Layout Diagram', 'Humidification & Ventilation Plan', 'Power Load Sanction'],
            },
            {
              id: 'textile-ba-o3',
              label: 'Ready-Made Garment (RMG) Stitching, Embroidery & Packing — Green Category',
              description: 'High workforce fabric cutting, sewing, ironing, and carton packing for international brands.',
              isLeaf: true,
              recommendations: ['SPCB Green Category Intimation', 'Factory Inspector License for Large Workforce (>100 workers)', 'Creche & Welfare Facilities under Factories Act 1948', 'Local Fire Department Emergency Exit NOC'],
              requiredDocs: ['Factory Floor Layout with Fire Escapes', 'Occupier & Manager Form 1 Application', 'Workers Welfare Compliance Plan'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'textile-fi-q1',
          question: 'Does the venture involve foreign equity investment or global retail brand sourcing?',
          subtitle: '100% FDI allowed under Automatic Route in Textile & Garments manufacturing.',
          options: [
            {
              id: 'textile-fi-o1',
              label: '100% Domestic Capital (PM-MITRA / ATUFS Subsidy Eligible)',
              description: 'Financed by Indian promoters with capital investment subsidies under Ministry of Textiles.',
              isLeaf: true,
              recommendations: ['Amended Technology Upgradation Fund Scheme (ATUFS) capital subsidy eligibility', 'State Textile Policy Incentives'],
              requiredDocs: ['Project Detailed Project Report (DPR)', 'Bank Loan Sanction Letter'],
            },
            {
              id: 'textile-fi-o2',
              label: 'Foreign FDI / Global Fashion Retailer Joint Venture',
              description: 'Foreign equity participation for dedicated international export lines.',
              isLeaf: true,
              recommendations: ['RBI Form FC-GPR filing', 'DPIIT Automatic Route Clearance'],
              requiredDocs: ['Joint Venture Shareholder Agreement', 'FIRC Bank Remittance Certificate'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'textile-pl-q1',
          question: 'Where will the textile production facility be located?',
          subtitle: 'Dyeing plants are restricted to parks equipped with integrated marine discharge or zero liquid discharge.',
          options: [
            {
              id: 'textile-pl-o1',
              label: 'PM MITRA Mega Textile Park / SITP Textile Park',
              description: 'Central Ministry of Textiles approved integrated mega park with common effluent plant and steam supply.',
              isLeaf: true,
              recommendations: ['Pre-approved environmental clearance benefit', 'Plug-and-play steam, power, and water utilities', 'Capital subsidy on factory building'],
              requiredDocs: ['Textile Park Plot Allotment Letter', 'Common Facility Centre Access Agreement'],
            },
            {
              id: 'textile-pl-o2',
              label: 'State Industrial Development Corporation (SIDC) General Estate',
              description: 'Suitable for dry spinning, weaving, and garment stitching factories.',
              isLeaf: true,
              recommendations: ['SIDC Lease Deed Registration', 'Standard Industrial Building Plan Sanction'],
              requiredDocs: ['SIDC Allotment Agreement', 'Sanctioned Site Layout Map'],
            },
          ],
        },
      ],
    },
  },

  // ── 10. MINING & MINERALS ──────────────────────────────────────────────────
  MINING: {
    sectorCode: 'MINING',
    sectorName: 'Mining & Minerals',
    steps: {
      business_registration: [
        {
          id: 'mining-br-q1',
          question: 'What is the corporate entity holding or bidding for the mining lease?',
          subtitle: 'Subject to Mines and Minerals (Development and Regulation) MMDR Act and DGMS requirements.',
          options: [
            {
              id: 'mining-br-o1',
              label: 'Private Limited Mining Corporation',
              description: 'Required for commercial mineral extraction, beneficiation, and captive mines.',
              isLeaf: true,
              recommendations: ['Statutory Qualified First-Class Mine Manager Appointment', 'Directorate General of Mines Safety (DGMS) Registration', 'Indian Bureau of Mines (IBM) Registration (Form M)'],
              requiredDocs: ['Certificate of Incorporation', 'Company PAN & GSTIN', 'Qualified Mining Engineer Credentials'],
            },
            {
              id: 'mining-br-o2',
              label: 'Public Limited / State Mineral PSU Joint Venture',
              description: 'For major mineral concessions (Iron Ore, Bauxite, Coal, Limestone) allocated via e-auction.',
              isLeaf: true,
              recommendations: ['MMDR Act E-Auction Bid Authorization', 'High-value performance guarantee compliance'],
              requiredDocs: ['Incorporation Certificate', 'Audited Financial Net Worth Certificate for Auction Bidding'],
            },
          ],
        },
      ],
      business_activity: [
        {
          id: 'mining-ba-q1',
          question: 'What is the mineral classification and extraction method?',
          subtitle: 'Governed by Indian Bureau of Mines (IBM) and Directorate General of Mines Safety (DGMS).',
          options: [
            {
              id: 'mining-ba-o1',
              label: 'Major Mineral Open-Cast Mining (>50 Hectares) — Iron Ore, Bauxite, Coal, Limestone',
              description: 'Heavy mechanized quarrying, overburden dumping, and crushing/screening plants.',
              isLeaf: true,
              recommendations: ['MoEFCC Central Environmental Clearance (Category A)', 'Approved Mining Plan & Mine Closure Plan from IBM', 'DGMS Mine Opening Permission & Heavy Earth Moving Machinery (HEMM) Sanction', 'PESO Explosive Magazine License for Deep Hole Blasting'],
              requiredDocs: ['MoEFCC Environmental Clearance (EC) Copy', 'IBM Approved Mining Plan Document', 'PESO Form LE-3 Explosives License', 'State Mining Dept Lease Deed'],
            },
            {
              id: 'mining-ba-o2',
              label: 'Minor Mineral Quarrying (<5 Hectares) — Granite, Sandstone, Marble, Road Metal',
              description: 'Smaller scale dimension stone or building gravel quarrying.',
              isLeaf: true,
              recommendations: ['State Environmental Impact Assessment Authority (SEIAA) EC Clearance', 'State Directorate of Geology & Mining Quarry Lease Sanction', 'District Level Controlled Blasting Permission'],
              requiredDocs: ['SEIAA Category B2 EC Clearance Letter', 'State Mining Lease Order', 'District Magistrate Blasting NOC'],
            },
            {
              id: 'mining-ba-o3',
              label: 'Mineral Beneficiation, Pelletization, or Processing Plant',
              description: 'Washing, magnetic separation, flotation, and pelletizing of raw ores.',
              isLeaf: true,
              recommendations: ['SPCB Red Category Consent to Establish (CTE)', 'Tailings Dam Engineering & Safety Stability NOC', 'High-tension Power Line Connection (>10 MVA)'],
              requiredDocs: ['Tailings Dam Design & Soil Mechanics Report', 'Water Recycling & Slurry Pipe Blueprint', 'SPCB Red Category Application'],
            },
          ],
        },
      ],
      foreign_investment: [
        {
          id: 'mining-fi-q1',
          question: 'What is the investment and funding structure for the mining development?',
          subtitle: '100% FDI is permitted under Automatic Route in mining and exploration of non-fuel minerals.',
          options: [
            {
              id: 'mining-fi-o1',
              label: '100% Domestic Indian Capital',
              description: 'Financed by Indian promoters, consortium banks, or sovereign infrastructure funds.',
              isLeaf: true,
              recommendations: ['Standard domestic banking project finance', 'National Mineral Exploration Trust (NMET) collaboration'],
              requiredDocs: ['Promoter Financial Solvency Certificate', 'Bank Guarantee for Mine Rehabilitation'],
            },
            {
              id: 'mining-fi-o2',
              label: 'Foreign Direct Investment (100% Automatic Route for Exploration & Mining)',
              description: 'Foreign mining conglomerates investing under Automatic Route for commercial extraction.',
              isLeaf: true,
              recommendations: ['RBI Form FC-GPR filing', 'Ministry of Mines Intimation'],
              requiredDocs: ['Foreign Investor FIRC Remittance Proof', 'Technical Collaboration Agreement'],
            },
          ],
        },
      ],
      project_land: [
        {
          id: 'mining-pl-q1',
          question: 'What is the forest and land status of the mining concession area?',
          subtitle: 'Forest land diversion requires mandatory Stage-I and Stage-II clearances under Forest Conservation Act.',
          options: [
            {
              id: 'mining-pl-o1',
              label: 'Non-Forest Revenue Wasteland / Government Mineral Block',
              description: 'Revenue land surveyed by Geological Survey of India (GSI) with no forest canopy.',
              isLeaf: true,
              recommendations: ['District Collector Land Demarcation & Surface Rights Order', 'Gram Sabha Consultation & NOC', 'Groundwater NOC from CGWA'],
              requiredDocs: ['Collector Surface Rights Grant Order', 'DGPS Geo-Referenced Mining Block Map', 'Gram Sabha Public Consultation Record'],
            },
            {
              id: 'mining-pl-o2',
              label: 'Forest Land requiring Diversion (Forest Conservation Act 1980)',
              description: 'Reserve forest or protected forest land requiring compensatory afforestation.',
              isLeaf: true,
              recommendations: ['Ministry of Environment & Forests (MoEFCC) Stage-I & Stage-II Forest Clearance', 'Compensatory Afforestation Fund Management (CAMPA) payment', 'Wildlife Sanctuary Buffer NOC (if within 10 km)'],
              requiredDocs: ['MoEFCC Stage-I In-Principle Forest Approval', 'CAMPA Fund Payment Challan Receipt', 'State Chief Wildlife Warden Recommendation'],
            },
          ],
        },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS FOR RETRIEVAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the root question for a specific sector and wizard step.
 */
export function getSectorRootQuestion(sectorCode: string, step: WizardStep): TreeQuestion {
  const code = (sectorCode || 'HOTEL').toUpperCase();
  const tree = SECTOR_TREES[code] || SECTOR_TREES.HOTEL;
  const questions = tree.steps[step];
  if (!questions || questions.length === 0) {
    return SECTOR_TREES.HOTEL.steps.business_registration[0];
  }
  return questions[0];
}

/**
 * Returns a specific question by ID for a sector and step.
 */
export function getSectorQuestionById(sectorCode: string, step: WizardStep, questionId: string): TreeQuestion | null {
  const code = (sectorCode || 'HOTEL').toUpperCase();
  const tree = SECTOR_TREES[code] || SECTOR_TREES.HOTEL;
  const questions = tree.steps[step];
  if (!questions) return null;
  return questions.find(q => q.id === questionId) || null;
}

/**
 * Returns the child question if the selected option points to one, or null if terminal leaf.
 */
export function getNextQuestionForOption(sectorCode: string, step: WizardStep, option: TreeOption): TreeQuestion | null {
  if (option.isLeaf || !option.nextQuestionId) return null;
  return getSectorQuestionById(sectorCode, step, option.nextQuestionId);
}

/**
 * Normalizes user/business type strings into canonical sector codes.
 */
export function normalizeSectorCode(raw: string): string {
  const s = (raw || '').toUpperCase().trim();
  if (s.includes('HOTEL') || s.includes('HOSPITALITY')) return 'HOTEL';
  if (s.includes('PETRO') || s.includes('FUEL')) return 'PETRO';
  if (s.includes('LEATHER') || s.includes('FOOTWEAR')) return 'LEATHER';
  if (s.includes('FOOD') || s.includes('AGRO')) return 'FOOD';
  if (s.includes('MFG') || s.includes('MANUFACTURING')) return 'MFG';
  if (s.includes('IT') || s.includes('SOFTWARE') || s.includes('TECH')) return 'IT_ITES';
  if (s.includes('PHARMA') || s.includes('DRUG')) return 'PHARMA';
  if (s.includes('RENEW') || s.includes('SOLAR') || s.includes('WIND') || s.includes('ENERGY')) return 'RENEWABLE';
  if (s.includes('TEXTILE') || s.includes('APPAREL') || s.includes('GARMENT')) return 'TEXTILE';
  if (s.includes('MINING') || s.includes('MINERAL')) return 'MINING';
  return 'HOTEL';
}

export interface SectorChecklistDocument {
  id: string;
  documentName: string;
  department: string;
  isMandatory: boolean;
  reusedFromVault: boolean;
  status: 'pending_review' | 'approved' | 'rejected';
}

/**
 * Dynamically builds a tailored document checklist for a sector and its answered parameters.
 */
export function getSectorChecklist(sectorCode: string, answers: Record<string, string>): SectorChecklistDocument[] {
  const code = normalizeSectorCode(sectorCode);
  const baseDocs: SectorChecklistDocument[] = [
    {
      id: `doc-${code}-pan`,
      documentName: 'Entity PAN Card & Certificate of Incorporation (CIN / MCA SPICe+)',
      department: 'Ministry of Corporate Affairs',
      isMandatory: true,
      reusedFromVault: true,
      status: 'approved',
    },
    {
      id: `doc-${code}-gst`,
      documentName: 'GST Registration Certificate (Form REG-06)',
      department: 'GST Council / CBIC',
      isMandatory: true,
      reusedFromVault: true,
      status: 'approved',
    },
    {
      id: `doc-${code}-land`,
      documentName: 'Land Possession Order / Registered Lease Agreement / Title Deed',
      department: 'Revenue & Land Records Directorate',
      isMandatory: true,
      reusedFromVault: false,
      status: 'pending_review',
    },
    {
      id: `doc-${code}-fire`,
      documentName: 'Fire Safety Plan & Evacuation Hydrant Scheme Blueprint',
      department: 'Directorate of Fire Prevention Services',
      isMandatory: true,
      reusedFromVault: false,
      status: 'pending_review',
    },
  ];

  // Specific Sector Requirements
  const sectorSpecific: Record<string, SectorChecklistDocument[]> = {
    HOTEL: [
      { id: 'h-1', documentName: 'HRACC Star Classification Comprehensive Dossier', department: 'Ministry of Tourism (HRACC)', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'h-2', documentName: 'FSSAI Food Business Manufacturing & Kitchen Layout Plan', department: 'Food Safety and Standards Authority of India', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'h-3', documentName: 'State Excise Bar License (FL-3 / Hotel Service) Dossier', department: 'State Excise Department', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'h-4', documentName: 'Consent to Establish (CTE - Orange/Red Category Hotel STP)', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'h-5', documentName: 'Swimming Pool Sanitation & Public Health NOC', department: 'Municipal Corporation Health Dept', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'h-6', documentName: 'Coastal Zone Management (CRZ) Clearance Recommendation', department: 'State Coastal Zone Management Authority', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
    ],
    PETRO: [
      { id: 'p-1', documentName: 'PESO Form XIV Underground Petroleum Storage Tank Layout', department: 'Petroleum & Explosives Safety Organization', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'p-2', documentName: 'OMC Dealership Letter of Intent (LOI) & Franchise Contract', department: 'Ministry of Petroleum & Natural Gas', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'p-3', documentName: 'NHAI / MoRTH IRC Highway Deceleration & Acceleration Access NOC', department: 'National Highways Authority of India', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'p-4', documentName: 'District Magistrate Rule 144 Public Safety NOC', department: 'District Collectorate / DM Office', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'p-5', documentName: 'Vapour Recovery System (VRS Stage I & II) Engineering Schema', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    LEATHER: [
      { id: 'l-1', documentName: 'Zero Liquid Discharge (ZLD) Multi-Stage RO & MEE Flow Blueprint', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'l-2', documentName: 'Common Effluent Treatment Plant (CETP) Primary Membership Letter', department: 'State Industrial Development Corporation', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'l-3', documentName: 'Hazardous Chromium Sludge Storage & TSDF Agreement (Form 1)', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'l-4', documentName: 'DISH Heavy Machinery Guarding & Worker Occupational Health Plan', department: 'Directorate of Industrial Safety & Health', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    FOOD: [
      { id: 'f-1', documentName: 'FSSAI Central / State Manufacturing License Application (Form B)', department: 'Food Safety and Standards Authority of India', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'f-2', documentName: 'Potable Water Chemical & Microbiological Test Report (IS 10500:2012)', department: 'NABL Accredited Analytical Laboratory', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'f-3', documentName: 'Cold Chain Blast Freezing & Ammonia/Freon Safety Layout Blueprint', department: 'Directorate of Industrial Safety & Health', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'f-4', documentName: 'Agmark Quality Certification / Legal Metrology Packaged Commodity NOC', department: 'Directorate of Marketing & Inspection', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    MFG: [
      { id: 'm-1', documentName: 'Comprehensive Environmental Impact Assessment (EIA) & ETP Blueprint', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'm-2', documentName: 'Factory Building & Mechanical Equipment Elevation Plan Approval', department: 'Directorate of Industrial Safety & Health', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'm-3', documentName: 'Indian Boiler Regulations (IBR) Steam Boiler Installation Permit', department: 'State Directorate of Steam Boilers', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'm-4', documentName: 'High Tension (HT) Dedicated Substation Load Feasibility Sanction', department: 'State Electricity Transmission Utility', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    IT_ITES: [
      { id: 'it-1', documentName: 'DoT Other Service Provider (OSP) Telecom Registration Certificate', department: 'Department of Telecommunications', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'it-2', documentName: '24x7 Night Shift & Female Worker Occupational Transport Exemption', department: 'Department of Labour Welfare', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'it-3', documentName: 'SEZ / STPI Green Channel Customs Bond & Duty-Free Equipment Permit', department: 'Software Technology Parks of India', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'it-4', documentName: 'Dual Power Grid Feeder & Diesel Generator Captive Power NOC', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    PHARMA: [
      { id: 'ph-1', documentName: 'Form 25 / Form 28 Drug Manufacturing License Application Dossier', department: 'Central Drugs Standard Control Organization (CDSCO)', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'ph-2', documentName: 'Schedule M Good Manufacturing Practice (GMP) & Cleanroom HVAC Layout', department: 'State Food & Drug Administration', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'ph-3', documentName: 'Consent to Establish (CTE) for Synthetic Organic Chemical Synthesis', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'ph-4', documentName: 'PESO Bulk Flammable Chemical / Solvent Storage License Dossier', department: 'Petroleum & Explosives Safety Organization', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    RENEWABLE: [
      { id: 're-1', documentName: 'STU / CTU Grid Interconnection Feasibility Approval (132/220 kV)', department: 'State Electricity Transmission Utility', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 're-2', documentName: '25-Year Power Purchase Agreement (PPA) / Open Access Agreement', department: 'Electricity Regulatory Commission', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 're-3', documentName: 'Chief Electrical Inspector to Government (CEIG) Statutory Approval', department: 'Directorate of Electrical Safety', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 're-4', documentName: 'Non-Agricultural (NA) Land Conversion Order for Solar/Wind Park', department: 'Revenue & Land Records Directorate', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    TEXTILE: [
      { id: 'tx-1', documentName: 'Consent to Establish (Red Category for Wet Dyeing & Finishing)', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'tx-2', documentName: 'Multi-Stage Reverse Osmosis & Effluent Evaporation Flow Diagram', department: 'State Pollution Control Board', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'tx-3', documentName: 'IBR Industrial Steam Boiler Safety & Emission Compliance NOC', department: 'State Directorate of Steam Boilers', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
      { id: 'tx-4', documentName: 'Factory Welfare & Creche / Women Shift Operational Undertaking', department: 'Department of Labour Welfare', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
    ],
    MINING: [
      { id: 'mn-1', documentName: 'Ministry of Mines Approved Mining Plan & Mine Closure Scheme', department: 'Indian Bureau of Mines (IBM)', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'mn-2', documentName: 'MoEFCC Category A/B Prior Environmental Clearance (EC) Order', department: 'Ministry of Environment, Forest and Climate Change', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'mn-3', documentName: 'Director General of Mines Safety (DGMS) Deep Hole Blasting Permission', department: 'Directorate General of Mines Safety', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'mn-4', documentName: 'PESO Explosives Magazine Storage & Transport License', department: 'Petroleum & Explosives Safety Organization', isMandatory: true, reusedFromVault: false, status: 'pending_review' },
      { id: 'mn-5', documentName: 'Forest Conservation Act (FCA 1980) Stage-I & Stage-II Forest Clearance', department: 'State Forest & Wildlife Department', isMandatory: false, reusedFromVault: false, status: 'pending_review' },
    ],
  };

  return [...baseDocs, ...(sectorSpecific[code] || sectorSpecific.HOTEL)];
}
