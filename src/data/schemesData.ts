import { Scheme } from '../types/swagat';

export const schemesData: Scheme[] = [
  {
    id: 'sch-pli-auto',
    name: 'Production Linked Incentive (PLI) Scheme for Automobile & Auto Components',
    department: 'Ministry of Heavy Industries',
    ministry: 'Ministry of Heavy Industries',
    level: 'Central',
    sector: 'Automobile',
    businessType: ['Manufacturing', 'Investment', 'Technology'],
    eligibility: [
      'Global or domestic OEM automakers and component manufacturers',
      'Minimum cumulative new domestic investment of ₹2,000 Crores (Champion OEM) or ₹250 Crores (Component Champion)',
      'Minimum 50% domestic value addition (DVA) certified by testing agency'
    ],
    benefits: 'Incentives ranging from 8% to 18% on incremental sales turnover of Advanced Automotive Technology (AAT) products and electric vehicles over a 5-year tenure.',
    maxFinancialSupport: '₹25,938 Crores Total Outlay',
    applicationProcess: 'Online application through SWAGAT / MHI portal followed by Technical Committee evaluation and quarterly investment audits.',
    deadline: 'Rolling Submissions / Phase II Window',
    active: true,
    documents: [
      'Detailed Project Report (DPR) with Investment Trajectory',
      'CA Certified Net Worth and Global Turnover Statements',
      'AAT Product Testing Certificate from ARAI / ICAT',
      'Domestic Value Addition (DVA) Audit Methodology'
    ],
    iconName: 'Car',
    tags: ['PLI', 'Automobile', 'EV', 'Advanced Tech', 'Subsidies', 'Central']
  },
  {
    id: 'sch-pli-electronics',
    name: 'PLI Scheme for Large Scale Electronics & Semiconductor Manufacturing',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    ministry: 'Ministry of Electronics and Information Technology',
    level: 'Central',
    sector: 'Electronics',
    businessType: ['Manufacturing', 'Technology', 'Investment', 'Export'],
    eligibility: [
      'Companies engaged in mobile phone manufacturing and specified electronic components (PCBs, ATMP, Display Panels)',
      'Minimum threshold investment ranging from ₹100 Crores to ₹1,000 Crores over 4 years'
    ],
    benefits: 'Financial incentive of 4% to 6% on incremental sales of goods manufactured in India over base year.',
    maxFinancialSupport: '₹38,645 Crores Outlay',
    applicationProcess: 'Digital application via Single Window portal with MeitY Project Management Agency (IFCI) verification.',
    deadline: 'Active Open Portal',
    active: true,
    documents: [
      'Audited Financial Reports of last 3 FYs',
      'Quarterly Invoices and IMEI / Serial Number Tracking',
      'Factory Land Lease / Allotment Deeds',
      'R&D and SMT Line Equipment Import / Purchase Receipts'
    ],
    iconName: 'Cpu',
    tags: ['PLI', 'Semiconductor', 'Electronics', 'Make in India', 'Central']
  },
  {
    id: 'sch-pm-mitra',
    name: 'PM Mega Integrated Textile Region and Apparel (PM MITRA) Parks Scheme',
    department: 'Ministry of Textiles',
    ministry: 'Ministry of Textiles',
    level: 'Central',
    sector: 'Textile',
    businessType: ['Manufacturing', 'MSME', 'Investment', 'Export'],
    eligibility: [
      'Textile manufacturers setting up units in designated 1,000+ acre PM MITRA mega parks (e.g. Amravati Maharashtra, Navsari Gujarat, Virudhunagar Tamil Nadu)',
      'Integrated value chain: Spinning, Weaving, Processing, Printing, Garmenting'
    ],
    benefits: 'Development Capital Support (DCS) up to ₹500 Cr per park, plus Competitive Incentive Support (CIS) up to ₹300 Cr per park for anchor manufacturing units (up to 3% of turnover).',
    maxFinancialSupport: '₹4,445 Crores Budget',
    applicationProcess: 'Apply through State Special Purpose Vehicle (SPV) / SWAGAT Integrated Window.',
    deadline: 'Active until 2027-28',
    active: true,
    documents: [
      'Industrial Allotment Letter in PM MITRA Park',
      'Machinery Purchase Quotations & Energy Efficiency Specs',
      'Zero Liquid Discharge (ZLD) Effluent Compliance Plan',
      'Employment Generation Commitment (Min 50% Women Workers)'
    ],
    iconName: 'Shirt',
    tags: ['Textiles', 'PM MITRA', 'Mega Parks', 'Export Hubs', 'Central']
  },
  {
    id: 'sch-cgtmse-msme',
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
    department: 'Ministry of MSME & SIDBI',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    level: 'Central',
    sector: 'Cross-Sectoral',
    businessType: ['MSME', 'Startup', 'Manufacturing', 'Women-Led'],
    eligibility: [
      'New and existing Micro and Small Enterprises in manufacturing and service sectors',
      'Credit facility up to ₹500 Lakhs (₹5 Crores) sanctioned by Member Lending Institutions (Banks / NBFCs)'
    ],
    benefits: 'Guarantee coverage up to 85% for micro enterprises and women entrepreneurs, enabling 100% collateral-free loans from nationalized and private scheduled banks.',
    maxFinancialSupport: '₹5 Crores Collateral-Free Credit Guarantee',
    applicationProcess: 'Apply directly through partner lending banks or initiate credit readiness through SWAGAT.',
    deadline: 'Ongoing Scheme',
    active: true,
    documents: [
      'Udyam Registration Certificate',
      'Project Feasibility & Cash Flow Projections',
      'Income Tax Returns & GST Summary',
      'KYC of Promoters'
    ],
    iconName: 'ShieldAlert',
    tags: ['CGTMSE', 'MSME', 'Collateral-Free Loan', 'SIDBI', 'Credit', 'Central']
  },
  {
    id: 'sch-startup-seed-fund',
    name: 'Startup India Seed Fund Scheme (SISFS)',
    department: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    ministry: 'Ministry of Commerce and Industry',
    level: 'Central',
    sector: 'IT & BPM',
    businessType: ['Startup', 'Technology', 'Women-Led'],
    eligibility: [
      'DPIIT Recognized Startup incorporated not more than 2 years ago',
      'Must have a viable business idea with proof of concept, prototype, or market fit',
      'Must not have received more than ₹10 Lakhs in monetary support from other Central/State Govt schemes'
    ],
    benefits: 'Grant of up to ₹20 Lakhs for Proof of Concept (PoC) / prototype validation, plus Debt / Convertible Debentures up to ₹50 Lakhs for commercialization and market entry.',
    maxFinancialSupport: 'Up to ₹70 Lakhs per Startup',
    applicationProcess: 'Apply online through SWAGAT / Startup India portal to select 3 government-approved incubators.',
    deadline: 'Quarterly Incubator Review',
    active: true,
    documents: [
      'DPIIT Recognition Certificate',
      'Pitch Deck & Video Demonstration of Prototype',
      'Detailed Budget Breakdown for Milestone Execution',
      'Cap Table and Shareholding Pattern'
    ],
    iconName: 'Zap',
    tags: ['Startup India', 'SISFS', 'Seed Fund', 'Grants', 'DPIIT', 'Innovation']
  },
  {
    id: 'sch-pmfme-food',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    department: 'Ministry of Food Processing Industries (MoFPI)',
    ministry: 'Ministry of Food Processing Industries',
    level: 'Central',
    sector: 'Food Processing',
    businessType: ['MSME', 'Manufacturing', 'Women-Led'],
    eligibility: [
      'Individual micro food processing units, Farmer Producer Organizations (FPOs), Self Help Groups (SHGs) and Producer Cooperatives',
      'Aligned with One District One Product (ODOP) focus produce'
    ],
    benefits: 'Credit-linked capital subsidy of 35% of eligible project cost with a maximum ceiling of ₹10 Lakhs per micro enterprise, plus ₹40,000 seed capital per SHG member for working capital and minor tools.',
    maxFinancialSupport: '₹10,000 Crores Centrally Sponsored Outlay',
    applicationProcess: 'Online application supported by District Resource Persons (DRP) via Single Window.',
    deadline: 'Active Scheme',
    active: true,
    documents: [
      'Udyam Registration & FSSAI Basic Registration',
      'Bank Sanction Letter for Term Loan',
      'Detailed Project Report (DPR) endorsed by DRP',
      'Quotation of Food Processing Machinery'
    ],
    iconName: 'Utensils',
    tags: ['PMFME', 'Food Processing', 'ODOP', 'MoFPI', 'Subsidy', 'MSME']
  },
  {
    id: 'sch-green-hydrogen',
    name: 'National Green Hydrogen Mission - SIGHT Program',
    department: 'Ministry of New and Renewable Energy (MNRE)',
    ministry: 'Ministry of New and Renewable Energy',
    level: 'Central',
    sector: 'Renewable Energy',
    businessType: ['Renewable Energy', 'Investment', 'Manufacturing', 'Technology'],
    eligibility: [
      'Bidders establishing domestic Electrolyser Manufacturing facilities or Green Hydrogen Production plants in India',
      'Minimum local value addition and specific energy consumption metrics'
    ],
    benefits: 'Direct financial incentives of up to ₹4,440/kW for electrolysers and direct production incentive of up to ₹50/kg in Year 1, ₹40/kg in Year 2, and ₹30/kg in Year 3 for Green Hydrogen output.',
    maxFinancialSupport: '₹17,490 Crores SIGHT Component',
    applicationProcess: 'Competitive bidding through SECI / MNRE integrated window on SWAGAT.',
    deadline: 'Tranche III Bidding Window',
    active: true,
    documents: [
      'Technical Capability and Technology Tie-up Agreements',
      'Net Worth and Financial Solvency Certificates',
      'Renewable Energy Sourcing & Power Purchase Agreement (PPA) Framework',
      'Water Balance and Desalination / Treatment Plan'
    ],
    iconName: 'Leaf',
    tags: ['Green Hydrogen', 'MNRE', 'SIGHT', 'Clean Tech', 'Renewable Energy', 'Central']
  },
  {
    id: 'sch-maha-psi',
    name: 'Maharashtra Package Scheme of Incentives (PSI 2019-2024)',
    department: 'Industries Department, Government of Maharashtra',
    ministry: 'State Government of Maharashtra',
    level: 'State',
    stateName: 'Maharashtra',
    sector: 'Manufacturing',
    businessType: ['Manufacturing', 'MSME', 'Investment', 'Export'],
    eligibility: [
      'MSME and Large industrial enterprises setting up in Taluka categories B, C, D, D+ and No-Industry Districts of Maharashtra'
    ],
    benefits: 'Industrial Promotion Subsidy (IPS) up to 100% of eligible gross SGST paid, 5% interest subsidy on term loans, power tariff subsidy of ₹1 to ₹2 per unit for 3 years, and 100% Stamp Duty exemption.',
    maxFinancialSupport: 'Up to 100% of Fixed Capital Investment (FCI)',
    applicationProcess: 'Apply on SWAGAT / MAITRI with Eligibility Certificate (EC) issued within 30 days.',
    deadline: 'Under Extension Framework',
    active: true,
    documents: [
      'MIDC Allotment / Land Non-Agriculture Order',
      'Bank Loan Appraisal Note & Chartered Engineer Plant Valuation',
      'Factory License & SPCB Consent to Operate (CTO)',
      'First Sale Commercial Invoice'
    ],
    iconName: 'Coins',
    tags: ['Maharashtra', 'PSI', 'SGST Refund', 'Stamp Duty Exemption', 'State']
  }
];
