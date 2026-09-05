import { Scenario } from '../types';

export const DEMO_SCENARIOS: Scenario[] = [
  {
    id: 'small-business',
    title: 'Starting a Small Food Business',
    query: 'I want to start a small restaurant in Maharashtra.',
    tagline: 'Food Processing & Hospitality Enterprise',
    category: 'Business & Entrepreneurship',
    state: 'Maharashtra',
    badge: 'Enterprise Journey',
    persona: {
      name: 'Pooja Patil',
      role: 'Aspiring Food Entrepreneur',
      avatar: '👩‍💼',
      location: 'Pune, Maharashtra'
    },
    summary: 'SWAGAT synthesizes state and central food compliance, business identity, local municipal permissions, and MSME credit support into a single linear progression.',
    relevantServices: [
      { name: 'Udyam MSME Registration', department: 'Ministry of MSME', portal: 'Udyam Registration Portal', type: 'Registration' },
      { name: 'FSSAI Food Safety Registration / License', department: 'Food Safety and Standards Authority of India', portal: 'FoSCoS Portal', type: 'License' },
      { name: 'Maharashtra Gumasta (Shop & Establishment Act)', department: 'Labour Dept, Govt of Maharashtra', portal: 'Aaple Sarkar / NSWS', type: 'Registration' },
      { name: 'Goods & Services Tax (GST) Registration', department: 'Central Board of Indirect Taxes & Customs', portal: 'GST Portal', type: 'Tax' },
      { name: 'Local Municipal Health Trade NOC', department: 'Pune Municipal Corporation (PMC)', portal: 'PMC Citizen Portal', type: 'Permission' },
      { name: 'Fire Department Safety Clearance', department: 'State Disaster & Fire Services', portal: 'MahaFire Services', type: 'Permission' }
    ],
    applicableSchemes: [
      { name: 'PMEGP (Prime Minister Employment Generation Programme)', benefit: 'Up to 35% capital subsidy on project cost for food processing units', subsidyOrGrant: '35% Subsidy' },
      { name: 'PM MUDRA Yojana (Kishore Tier)', benefit: 'Collateral-free commercial bank loan from ₹50,000 to ₹5,00,000', subsidyOrGrant: 'Collateral-free Loan' },
      { name: 'Maharashtra Chief Minister Employment Generation Programme (CMEGP)', benefit: 'Financial assistance up to ₹50 Lakh with 15-35% subsidy', subsidyOrGrant: 'State Subsidy' }
    ],
    requiredDocs: [
      {
        id: 'doc-pan',
        name: 'Proprietor / Entity PAN Card',
        category: 'Identity',
        whyNeeded: 'Required for Udyam MSME identity, GST tax linkage, and business current account opening.',
        issuingAuthority: 'Income Tax Department (NSDL / UTIITSL)',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-aadhaar',
        name: 'Aadhaar Card with Linked Mobile Number',
        category: 'Identity',
        whyNeeded: 'Used for instant OTP-based digital eKYC across Udyam, FoSCoS, and Aaple Sarkar portals.',
        issuingAuthority: 'UIDAI',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-premise',
        name: 'Premises Proof (Rent Agreement / Utility Bill)',
        category: 'Address',
        whyNeeded: 'Mandatory for local municipal trade license, FSSAI kitchen location audit, and Fire NOC.',
        issuingAuthority: 'Sub-Registrar Office / Electricity Board (MSEDCL)',
        digiLockerFetchable: false,
        mandatory: true
      },
      {
        id: 'doc-bank',
        name: 'Bank Account Cancelled Cheque / Statement',
        category: 'Financial',
        whyNeeded: 'Required for PMEGP direct benefit transfer subsidy and GST tax refund credentials.',
        issuingAuthority: 'Scheduled Commercial Bank',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-fssai-plan',
        name: 'Food Safety Management System (FSMS) Plan',
        category: 'Technical',
        whyNeeded: 'Required under Food Safety and Standards (Licensing & Registration) Regulations 2011.',
        issuingAuthority: 'FSSAI Standard Template / Self-Declaration',
        digiLockerFetchable: false,
        mandatory: false
      }
    ],
    journeySteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Register Business Identity (Udyam MSME)',
        description: 'Obtain official recognition as a Micro Enterprise with zero government fees.',
        department: 'Ministry of Micro, Small and Medium Enterprises',
        portalName: 'National Single Window System (NSWS) / Udyam',
        portalUrl: 'https://udyamregistration.gov.in',
        status: 'completed',
        estimatedDays: 'Instant (10 mins)',
        requiredDocsCount: 2,
        actionButtonText: 'View Certificate',
        instructions: [
          'Verify Aadhaar OTP of business owner',
          'Link PAN card for automated tax data verification',
          'Select NIC Code 56102 (Restaurants & mobile food services)'
        ]
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Obtain Maharashtra Shop & Establishment Act (Gumasta)',
        description: 'Mandatory statutory license to operate a commercial establishment in Maharashtra.',
        department: 'Labour Department, Govt. of Maharashtra',
        portalName: 'Aaple Sarkar Portal',
        portalUrl: 'https://aaplesarkar.mahaonline.gov.in',
        status: 'completed',
        estimatedDays: '1-3 Working Days',
        requiredDocsCount: 3,
        actionButtonText: 'Verify Registration',
        instructions: [
          'Upload premises lease agreement or property tax receipt',
          'Provide employer photo and photo of shop entrance with Marathi board',
          'Instant intimation certificate generated for under 10 workers'
        ]
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Apply for FSSAI Food Safety License / Registration',
        description: 'Crucial health compliance for all food preparation and distribution activities.',
        department: 'Food Safety and Standards Authority of India (FSSAI)',
        portalName: 'FoSCoS Portal',
        portalUrl: 'https://foscos.fssai.gov.in',
        status: 'current',
        estimatedDays: '7-14 Days',
        requiredDocsCount: 4,
        actionButtonText: 'Continue Application',
        instructions: [
          'Select annual turnover bracket (< ₹12L for Registration, > ₹12L for State License)',
          'Upload Food Safety Management declaration',
          'Submit food categories list (Cooked food, beverages, bakery)'
        ]
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Apply for PMEGP Capital Subsidy & MUDRA Loan',
        description: 'Avail up to 35% margin money government subsidy through KVIC portal.',
        department: 'Khadi and Village Industries Commission (KVIC)',
        portalName: 'MyScheme / KVIC Online Portal',
        portalUrl: 'https://www.kviconline.gov.in',
        status: 'upcoming',
        estimatedDays: '15-30 Days',
        requiredDocsCount: 5,
        actionButtonText: 'Prepare Scheme File',
        instructions: [
          'Upload Detailed Project Report (DPR) prepared via SWAGAT guidance',
          'Submit Caste/Special Category certificate if claiming 35% rural subsidy',
          'Select preferred commercial lending branch for disbursement'
        ]
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'Track Unified Municipal NOCs & GST Compliance',
        description: 'Complete tax onboarding and fire safety sign-off for full operations.',
        department: 'Central Board of Indirect Taxes & Municipal Corp',
        portalName: 'GST Portal & PMC Urban Services',
        portalUrl: 'https://www.gst.gov.in',
        status: 'upcoming',
        estimatedDays: '5-7 Days',
        requiredDocsCount: 3,
        actionButtonText: 'Check Readiness',
        instructions: [
          'Complete Aadhaar biometric authentication for GSTIN',
          'File municipal trade license inspection schedule',
          'Generate unified digital compliance dossier for display'
        ]
      }
    ],
    nextBestAction: {
      title: 'Prepare Premises Proof & Complete FoSCoS Submission',
      description: 'Your Udyam and Gumasta registrations are verified! Upload your notarized rent agreement to finalize Step 3 (FSSAI Registration) on the official FoSCoS portal.',
      estimatedTime: 'Estimated time: 15 minutes',
      ctaText: 'Open FoSCoS Guidance →',
      actionType: 'prepare_docs'
    },
    officialPortals: [
      { name: 'National Single Window System', acronym: 'NSWS', role: 'Unified Clearance Gateway', url: 'https://www.nsws.gov.in' },
      { name: 'Food Safety Compliance System', acronym: 'FoSCoS', role: 'FSSAI Licensing', url: 'https://foscos.fssai.gov.in' },
      { name: 'Aaple Sarkar Maharashtra', acronym: 'Aaple Sarkar', role: 'State Citizen Services', url: 'https://aaplesarkar.mahaonline.gov.in' },
      { name: 'DigiLocker India', acronym: 'DigiLocker', role: 'Verified Document Fetch', url: 'https://www.digilocker.gov.in' }
    ]
  },
  {
    id: 'child-scholarship',
    title: 'Higher Education Scholarship for Child',
    query: 'I need a scholarship for my child for college education.',
    tagline: 'Merit-cum-Means Higher Education Support',
    category: 'Education & Scholarships',
    state: 'National / All States',
    badge: 'Education Support',
    persona: {
      name: 'Rameshwar Sharma',
      role: 'Parent / Daily Wage Worker',
      avatar: '👨‍👧',
      location: 'Jaipur, Rajasthan'
    },
    summary: 'SWAGAT guides parents through National Scholarship Portal (NSP), state welfare departments, and corporate CSR quotas without confusing jargon.',
    relevantServices: [
      { name: 'National Scholarship Portal (NSP) One-Time Registration (OTR)', department: 'Ministry of Electronics & IT', portal: 'NSP Portal', type: 'Registration' },
      { name: 'Income Certificate from Tahsildar / Revenue Dept', department: 'Revenue Department', portal: 'e-Mitra / State Portal', type: 'Registration' },
      { name: 'Academic Record & Bonafide Certificate Verification', department: 'UGC / AICTE / Institute', portal: 'Institute Portal', type: 'Registration' },
      { name: 'Aadhaar-seeded Bank Account Validation', department: 'National Payments Corporation of India (NPCI)', portal: 'PFMS / Bank Portal', type: 'Registration' }
    ],
    applicableSchemes: [
      { name: 'PM-YASASVI Scholarship Scheme for OBC/EBC/DNT Students', benefit: 'Up to ₹75,000/year for Class 9-10 and ₹1,25,000/year for Class 11-12 & College', subsidyOrGrant: 'Full Tuition Support' },
      { name: 'Central Sector Scheme of Scholarships for College and University Students', benefit: '₹12,000 to ₹20,000 per annum for top 20th percentile students', subsidyOrGrant: 'Direct Bank Transfer' },
      { name: 'Post-Matric Scholarship for SC/ST Students', benefit: 'Full tuition fee reimbursement + monthly maintenance allowance', subsidyOrGrant: '100% Fee Waiver' }
    ],
    requiredDocs: [
      {
        id: 'doc-student-aadhaar',
        name: "Student's Aadhaar Card",
        category: 'Identity',
        whyNeeded: 'Required for National Scholarship Portal OTR (One Time Registration) face-auth / biometric login.',
        issuingAuthority: 'UIDAI',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-income-cert',
        name: 'Family Annual Income Certificate (< ₹2.5 Lakhs)',
        category: 'Financial',
        whyNeeded: 'Determines eligibility for Central and State government mean-based educational financial assistance.',
        issuingAuthority: 'Tahsildar / Sub-Divisional Magistrate (SDM)',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-marksheets',
        name: 'Class 10th / 12th Verified Marksheet',
        category: 'Technical',
        whyNeeded: 'Validates minimum percentage criteria (typically > 60%) for merit-based allocations.',
        issuingAuthority: 'State Board / CBSE / CISCE (DigiLocker verified)',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-bonafide',
        name: 'College Bonafide Student Certificate & Fee Receipt',
        category: 'Business',
        whyNeeded: 'Proves active regular enrollment in an AICTE / UGC approved recognized college/university.',
        issuingAuthority: 'Registrar / Principal of College',
        digiLockerFetchable: false,
        mandatory: true
      },
      {
        id: 'doc-caste',
        name: 'Caste / Community Certificate (if applicable)',
        category: 'Identity',
        whyNeeded: 'Required for affirmative quota scholarships (SC/ST/OBC/EBC).',
        issuingAuthority: 'District Revenue Authority',
        digiLockerFetchable: true,
        mandatory: false
      }
    ],
    journeySteps: [
      {
        id: 'edu-step-1',
        stepNumber: 1,
        title: 'Obtain Revenue Department Income Certificate',
        description: 'Get verified digital income certificate proving annual household income below threshold.',
        department: 'Department of Revenue',
        portalName: 'State e-Governance / e-District Portal',
        portalUrl: 'https://services.india.gov.in',
        status: 'completed',
        estimatedDays: '3-5 Working Days',
        requiredDocsCount: 2,
        actionButtonText: 'Certificate Ready',
        instructions: [
          'Submit salary slip / self-employed income affidavit',
          'Get digital signature from Tahsildar via DigiLocker'
        ]
      },
      {
        id: 'edu-step-2',
        stepNumber: 2,
        title: 'Generate NSP One-Time Registration (NSP-OTR)',
        description: 'Create unique lifelong student identifier on National Scholarship Portal.',
        department: 'Ministry of Electronics & IT (MeitY)',
        portalName: 'National Scholarship Portal (NSP)',
        portalUrl: 'https://scholarships.gov.in',
        status: 'current',
        estimatedDays: 'Same Day',
        requiredDocsCount: 2,
        actionButtonText: 'Generate OTR',
        instructions: [
          'Download NSP OTR Mobile App for Aadhaar Face Authentication',
          'Link mobile number active with student Aadhaar',
          'Store 14-digit OTR reference number securely'
        ]
      },
      {
        id: 'edu-step-3',
        stepNumber: 3,
        title: 'Match & Apply for Eligible Scholarships',
        description: 'Auto-fill application with verified marks and income data.',
        department: 'Ministry of Social Justice / Ministry of Education',
        portalName: 'NSP Schemes Selection',
        portalUrl: 'https://scholarships.gov.in',
        status: 'upcoming',
        estimatedDays: '1 Day',
        requiredDocsCount: 3,
        actionButtonText: 'Select Schemes',
        instructions: [
          'Select PM-YASASVI or Central Sector Scheme based on scores',
          'Upload college fee receipt and bonafide certificate'
        ]
      },
      {
        id: 'edu-step-4',
        stepNumber: 4,
        title: 'Institute Level Verification (INO Desk)',
        description: 'College Nodal Officer verifies student credentials on the NSP backend.',
        department: 'College Administration / Nodal Officer',
        portalName: 'Institute Verification Portal',
        portalUrl: 'https://scholarships.gov.in',
        status: 'upcoming',
        estimatedDays: '7-10 Days',
        requiredDocsCount: 0,
        actionButtonText: 'Track Status',
        instructions: [
          'Inform college scholarship cell with OTR reference',
          'Verify biometric attendance record'
        ]
      },
      {
        id: 'edu-step-5',
        stepNumber: 5,
        title: 'Direct Benefit Transfer (DBT) via PFMS',
        description: 'Scholarship grant directly credited to Aadhaar-seeded bank account.',
        department: 'Public Financial Management System (PFMS)',
        portalName: 'PFMS DBT Tracker',
        portalUrl: 'https://pfms.nic.in',
        status: 'upcoming',
        estimatedDays: '15-45 Days',
        requiredDocsCount: 1,
        actionButtonText: 'Check Bank Seeding',
        instructions: [
          'Ensure bank account is mapped on NPCI Aadhaar bridge',
          'Track payment batch release notification'
        ]
      }
    ],
    nextBestAction: {
      title: 'Generate NSP One-Time Registration (OTR)',
      description: 'Your income certificate is ready in DigiLocker. Next, perform the 2-minute Face-Auth on the NSP App to receive your 14-digit student OTR number.',
      estimatedTime: 'Estimated time: 5 minutes',
      ctaText: 'Start NSP OTR Guidance →',
      actionType: 'verify_identity'
    },
    officialPortals: [
      { name: 'National Scholarship Portal', acronym: 'NSP', role: 'Central Scholarship Engine', url: 'https://scholarships.gov.in' },
      { name: 'MyScheme India', acronym: 'MyScheme', role: 'Scheme Discovery', url: 'https://www.myscheme.gov.in' },
      { name: 'Public Financial Management System', acronym: 'PFMS', role: 'Direct Benefit Transfer', url: 'https://pfms.nic.in' },
      { name: 'DigiLocker', acronym: 'DigiLocker', role: 'Verified Marks & Certificates', url: 'https://www.digilocker.gov.in' }
    ]
  },
  {
    id: 'scheme-discovery',
    title: 'Discover Eligible Government Schemes',
    query: 'I want to know which government schemes I may be eligible for.',
    tagline: 'Citizen Profile & Entitlement Finder',
    category: 'Social Welfare & Schemes',
    state: 'All India',
    badge: 'Universal Scheme Finder',
    persona: {
      name: 'Sunita Devi',
      role: 'Rural Self-Help Group Member / Farmer',
      avatar: '👩‍🌾',
      location: 'Varanasi, Uttar Pradesh'
    },
    summary: 'SWAGAT evaluates citizen demographics, occupation, household income, and landholding to reveal unlocked welfare entitlements.',
    relevantServices: [
      { name: 'MyScheme Unified Eligibility Engine', department: 'Ministry of Electronics & IT', portal: 'MyScheme Portal', type: 'Registration' },
      { name: 'PM Kisan Samman Nidhi eKYC', department: 'Ministry of Agriculture & Farmers Welfare', portal: 'PM Kisan Portal', type: 'Registration' },
      { name: 'Ayushman Bharat PM-JAY Golden Card', department: 'National Health Authority', portal: 'Setu PMJAY', type: 'Registration' },
      { name: 'Pradhan Mantri Awas Yojana (PMAY-G)', department: 'Ministry of Rural Development', portal: 'AwaasSoft', type: 'Registration' }
    ],
    applicableSchemes: [
      { name: 'PM Kisan Samman Nidhi', benefit: '₹6,000 per year in 3 equal installments directly to bank account', subsidyOrGrant: '₹6,000/yr Direct Cash' },
      { name: 'Ayushman Bharat PM-JAY', benefit: '₹5,00,000 per family per year for secondary and tertiary hospitalization', subsidyOrGrant: '₹5 Lakh Health Cover' },
      { name: 'PM SVANidhi / Lakhpati Didi SHG Loan', benefit: 'Interest-subvention micro-loans up to ₹1,00,000 for SHG women', subsidyOrGrant: 'Collateral-free Microcredit' },
      { name: 'Pradhan Mantri Suraksha Bima Yojana', benefit: '₹2 Lakh accidental insurance cover for just ₹20 per year', subsidyOrGrant: 'Subsidized Insurance' }
    ],
    requiredDocs: [
      {
        id: 'doc-aadhaar-shg',
        name: 'Aadhaar Card (Primary Applicant)',
        category: 'Identity',
        whyNeeded: 'Universal identifier for Jan Dhan-Aadhaar-Mobile (JAM) welfare integration.',
        issuingAuthority: 'UIDAI',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-ration-card',
        name: 'Digital Ration Card (NFSA / BPL / Antyodaya)',
        category: 'Address',
        whyNeeded: 'Identifies household socio-economic category for free rations and Ayushman Bharat coverage.',
        issuingAuthority: 'Department of Food & Public Distribution',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-land-record',
        name: 'Land Record Extract (Khasra / Khatauni / 7/12)',
        category: 'Business',
        whyNeeded: 'Required for PM Kisan and crop insurance (PMFBY) verification.',
        issuingAuthority: 'State Revenue / Bhulekh Portal',
        digiLockerFetchable: true,
        mandatory: false
      }
    ],
    journeySteps: [
      {
        id: 'sch-step-1',
        stepNumber: 1,
        title: 'Complete 30-Second Citizen Profile',
        description: 'Tell SWAGAT your age, family income, landholding, and state.',
        department: 'SWAGAT Journey Engine',
        portalName: 'SWAGAT Core Engine',
        portalUrl: '#',
        status: 'completed',
        estimatedDays: 'Instant',
        requiredDocsCount: 0,
        actionButtonText: 'Profile Set',
        instructions: [
          'Selected: Female, Rural, Marginal Farmer (< 2 Hectares), SHG Member'
        ]
      },
      {
        id: 'sch-step-2',
        stepNumber: 2,
        title: 'Review 4 Highly Relevant Scheme Matches',
        description: 'Calculated potential benefits totaling ₹5,86,000 across health, farm, and insurance.',
        department: 'Various Central & State Ministries',
        portalName: 'MyScheme Engine',
        portalUrl: 'https://www.myscheme.gov.in',
        status: 'current',
        estimatedDays: 'Instant',
        requiredDocsCount: 3,
        actionButtonText: 'Explore Schemes',
        instructions: [
          'PM Kisan: Eligible (₹6,000/yr)',
          'Ayushman Bharat: Eligible (₹5 Lakh cover)',
          'Lakhpati Didi: Eligible (SHG enterprise credit)'
        ]
      },
      {
        id: 'sch-step-3',
        stepNumber: 3,
        title: 'Complete PM Kisan Aadhaar Face eKYC',
        description: 'Unblock pending installment releases through instant face verification.',
        department: 'Ministry of Agriculture',
        portalName: 'PM Kisan Portal / CSC Kiosk',
        portalUrl: 'https://pmkisan.gov.in',
        status: 'upcoming',
        estimatedDays: '1 Day',
        requiredDocsCount: 1,
        actionButtonText: 'Launch eKYC',
        instructions: [
          'Verify land records on UP Bhulekh',
          'Complete biometrics via UMANG App or nearby Common Service Center (CSC)'
        ]
      },
      {
        id: 'sch-step-4',
        stepNumber: 4,
        title: 'Download Ayushman Bharat PVC Card',
        description: 'Generate family health cards for cashless hospital treatments.',
        department: 'National Health Authority',
        portalName: 'Ayushman Beneficiary Portal',
        portalUrl: 'https://beneficiary.nha.gov.in',
        status: 'upcoming',
        estimatedDays: '2-3 Days',
        requiredDocsCount: 2,
        actionButtonText: 'Download Card',
        instructions: [
          'Verify Ration Card number on portal',
          'Download digital Ayushman Card directly to DigiLocker'
        ]
      }
    ],
    nextBestAction: {
      title: 'Complete PM Kisan eKYC & Generate Ayushman Card',
      description: 'Your profile matches 4 welfare schemes. Take 2 minutes to complete your PM Kisan mobile face-eKYC to ensure immediate DBT credit.',
      estimatedTime: 'Estimated time: 5 minutes',
      ctaText: 'Start Scheme Onboarding →',
      actionType: 'apply_portal'
    },
    officialPortals: [
      { name: 'MyScheme India', acronym: 'MyScheme', role: 'National Scheme Portal', url: 'https://www.myscheme.gov.in' },
      { name: 'PM Kisan Portal', acronym: 'PM Kisan', role: 'Direct Farmer Support', url: 'https://pmkisan.gov.in' },
      { name: 'Ayushman Beneficiary Portal', acronym: 'NHA PMJAY', role: 'Health Insurance', url: 'https://beneficiary.nha.gov.in' },
      { name: 'UMANG Unified App', acronym: 'UMANG', role: 'All-in-one Mobile Access', url: 'https://web.umang.gov.in' }
    ]
  },
  {
    id: 'government-certificate',
    title: 'Obtaining Official Government Certificates',
    query: 'I need a government certificate (Domicile / Income / Caste).',
    tagline: 'State Revenue & e-District Issuance Pathway',
    category: 'Certificates & Documents',
    state: 'State Portals (e-District / Aaple Sarkar / Seva Sindhu)',
    badge: 'Legal Proof Service',
    persona: {
      name: 'Aniket Deshmukh',
      role: 'Engineering College Applicant',
      avatar: '👨‍🎓',
      location: 'Nagpur, Maharashtra'
    },
    summary: 'SWAGAT simplifies state revenue bureaucracy, providing clear affidavits, fee schedules, and tracking SLA clocks.',
    relevantServices: [
      { name: 'Domicile & Age-Nationality Certificate', department: 'Revenue & Forest Department', portal: 'State e-District / Aaple Sarkar', type: 'Registration' },
      { name: 'Non-Creamy Layer (NCL) Certificate', department: 'Social Justice & Special Assistance', portal: 'Revenue Portal', type: 'Registration' },
      { name: 'Income Certificate (Tehsildar Signed)', department: 'Revenue Administration', portal: 'e-District Portal', type: 'Registration' }
    ],
    applicableSchemes: [
      { name: 'State Fee Concession for Higher Education', benefit: '50% to 100% tuition concession with valid Domicile + NCL certificate', subsidyOrGrant: 'Tuition Fee Waiver' },
      { name: 'State Government Job Reservation Entitlement', benefit: 'Eligibility for state domicile and vertical category quotas', subsidyOrGrant: 'Official Eligibility' }
    ],
    requiredDocs: [
      {
        id: 'doc-birth-cert',
        name: 'School Leaving Certificate / Birth Certificate',
        category: 'Identity',
        whyNeeded: 'Proof of date and place of birth within state boundaries.',
        issuingAuthority: 'Municipal Registrar / School Headmaster',
        digiLockerFetchable: true,
        mandatory: true
      },
      {
        id: 'doc-residence-proof',
        name: '15-Year Continuous Residence Proof',
        category: 'Address',
        whyNeeded: 'Statutory prerequisite for state domicile (Electricity bills, rent deed, voter ID, school records).',
        issuingAuthority: 'Competent Local Authorities',
        digiLockerFetchable: false,
        mandatory: true
      },
      {
        id: 'doc-affidavit',
        name: 'Self-Declaration Affidavit (Form 1)',
        category: 'Technical',
        whyNeeded: 'Mandatory legal affirmation under State Right to Public Services Act.',
        issuingAuthority: 'SWAGAT Auto-Generated Template / Notary',
        digiLockerFetchable: false,
        mandatory: true
      }
    ],
    journeySteps: [
      {
        id: 'cert-step-1',
        stepNumber: 1,
        title: 'Identify Exact Certificate Class & Issuing Officer',
        description: 'Determined required certificate: Domicile & Nationality under Sub-Divisional Officer (SDO).',
        department: 'Sub-Divisional Magistrate / Tehsildar',
        portalName: 'Aaple Sarkar / e-District',
        portalUrl: 'https://aaplesarkar.mahaonline.gov.in',
        status: 'completed',
        estimatedDays: 'Instant',
        requiredDocsCount: 3,
        actionButtonText: 'Requirement Locked',
        instructions: [
          'State: Maharashtra (Right to Public Services SLA: 15 days)',
          'Statutory fee: ₹33.60 via MahaOnline payment gateway'
        ]
      },
      {
        id: 'cert-step-2',
        stepNumber: 2,
        title: 'Generate Pre-filled Self Declaration Form',
        description: 'Auto-fills applicant name, address, and 15-year residence timeline.',
        department: 'SWAGAT Document Synthesizer',
        portalName: 'SWAGAT Document Engine',
        portalUrl: '#',
        status: 'current',
        estimatedDays: '2 Minutes',
        requiredDocsCount: 2,
        actionButtonText: 'Download Self-Declaration',
        instructions: [
          'Review pre-filled details',
          'Sign digitally using Aadhaar e-Sign or physical signature'
        ]
      },
      {
        id: 'cert-step-3',
        stepNumber: 3,
        title: 'Submit Application on Official State Portal',
        description: 'Upload documents and get guaranteed Application Tracking Number (Application ID).',
        department: 'Revenue Department',
        portalName: 'State e-District Portal',
        portalUrl: 'https://aaplesarkar.mahaonline.gov.in',
        status: 'upcoming',
        estimatedDays: '15 Minutes',
        requiredDocsCount: 3,
        actionButtonText: 'Go to Official Portal',
        instructions: [
          'Login via Citizen ID or CSC VLE desk',
          'Pay government fee of ₹33.60'
        ]
      },
      {
        id: 'cert-step-4',
        stepNumber: 4,
        title: 'Track Tehsildar Scrutiny & Download Digitally Signed Certificate',
        description: 'Certificate delivered with QR code verification and pushed to DigiLocker.',
        department: 'Revenue Administration',
        portalName: 'DigiLocker / e-District',
        portalUrl: 'https://www.digilocker.gov.in',
        status: 'upcoming',
        estimatedDays: '7-15 Working Days',
        requiredDocsCount: 0,
        actionButtonText: 'Track SLA Clock',
        instructions: [
          'SLA Clock monitors 15-day statutory window',
          'Escalate to First Appellate Officer if delayed'
        ]
      }
    ],
    nextBestAction: {
      title: 'Download Auto-Generated Affidavit & Apply on e-District',
      description: 'Your residence proof documents are verified. Download your pre-filled Self-Declaration Form to finalize submission on the State e-District portal.',
      estimatedTime: 'Estimated time: 10 minutes',
      ctaText: 'Get Pre-Filled Affidavit →',
      actionType: 'prepare_docs'
    },
    officialPortals: [
      { name: 'State e-District Portal', acronym: 'e-District', role: 'Official Certificate Issuance', url: 'https://services.india.gov.in' },
      { name: 'Aaple Sarkar Maharashtra', acronym: 'Aaple Sarkar', role: 'State RTS Portal', url: 'https://aaplesarkar.mahaonline.gov.in' },
      { name: 'DigiLocker', acronym: 'DigiLocker', role: 'Permanent Digital Storage', url: 'https://www.digilocker.gov.in' },
      { name: 'CPGRAMS Citizen Grievances', acronym: 'CPGRAMS', role: 'SLA Escalations', url: 'https://pgportal.gov.in' }
    ]
  }
];
