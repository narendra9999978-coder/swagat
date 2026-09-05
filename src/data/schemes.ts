import { SchemeItem } from '../types';

export const ALL_SCHEMES: SchemeItem[] = [
  {
    id: 'sch-pmegp',
    title: 'Prime Minister Employment Generation Programme (PMEGP)',
    titleHi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
    targetGroup: 'Entrepreneur',
    category: 'Enterprise & MSME',
    ministry: 'Ministry of MSME / KVIC',
    benefitAmount: 'Up to ₹17.5 Lakhs Subsidy (15% - 35% of project cost)',
    description: 'Credit-linked subsidy program aimed at generating self-employment opportunities through micro-enterprises in non-farm sectors.',
    eligibility: [
      'Any individual aged 18 years and above',
      'Minimum 8th standard pass for project cost above ₹10L in manufacturing or ₹5L in service',
      'Only for new units (no existing unit upgrades)'
    ],
    requiredDocs: [
      'Aadhaar Card & PAN Card',
      'Detailed Project Report (DPR)',
      'Educational Qualification Certificate',
      'Caste/Special Category Certificate (for 35% subsidy)'
    ],
    applyPortal: 'KVIC Online Portal / NSWS',
    applyUrl: 'https://www.kviconline.gov.in',
    isPopular: true
  },
  {
    id: 'sch-mudra',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    titleHi: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    targetGroup: 'Entrepreneur',
    category: 'Financial Assistance',
    ministry: 'Department of Financial Services, Ministry of Finance',
    benefitAmount: 'Collateral-free loans up to ₹20 Lakhs (Shishu, Kishore, Tarun)',
    description: 'Enables micro and small non-corporate enterprises to access institutional credit without pledging collateral assets.',
    eligibility: [
      'Non-farm enterprise in manufacturing, trading, or service sector',
      'Good credit score and bank account with KYC',
      'Viable business proposal'
    ],
    requiredDocs: [
      'Identity Proof (Aadhaar/Voter ID)',
      'Proof of Business Enterprise (Udyam)',
      'Past 6 Months Bank Statement',
      'Quotation for Machinery / Equipment'
    ],
    applyPortal: 'JanSamarth Portal / UdyamiMitra',
    applyUrl: 'https://www.jansamarth.in',
    isPopular: true
  },
  {
    id: 'sch-pm-yasasvi',
    title: 'PM-YASASVI Higher Education Scholarship',
    titleHi: 'पीएम-यशस्वी उच्च शिक्षा छात्रवृत्ति योजना',
    targetGroup: 'Student',
    category: 'Education & Welfare',
    ministry: 'Ministry of Social Justice & Empowerment',
    benefitAmount: 'Up to ₹1,25,000 / Year + Hostel Expenses',
    description: 'Financial assistance to meritorious OBC, EBC, and DNT students studying in Top Class schools and colleges across India.',
    eligibility: [
      'Student must belong to OBC / EBC / DNT category',
      'Annual family income must not exceed ₹2.5 Lakhs per annum',
      'Enrolled in empaneled Top Class institutions'
    ],
    requiredDocs: [
      'Student Aadhaar Card (with biometric/face OTR)',
      'Competent Authority Income Certificate',
      'Caste/Category Certificate',
      'Bonafide College Admission Receipt'
    ],
    applyPortal: 'National Scholarship Portal (NSP)',
    applyUrl: 'https://scholarships.gov.in',
    isPopular: true
  },
  {
    id: 'sch-pm-kisan',
    title: 'PM Kisan Samman Nidhi Yojana',
    titleHi: 'पीएम किसान सम्मान निधि योजना',
    targetGroup: 'Farmer',
    category: 'Direct Agriculture Support',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    benefitAmount: '₹6,000 / Year in 3 Direct Installments (DBT)',
    description: 'Income support to all landholding farmer families across India to supplement their agricultural inputs and domestic needs.',
    eligibility: [
      'All landholding farmer families with cultivable land',
      'Valid Aadhaar linked to bank account (NPCI mapped)',
      'Land records updated in State Bhulekh portal'
    ],
    requiredDocs: [
      'Aadhaar Card',
      'Land Ownership Proof (Khasra / Khatauni / 7-12)',
      'Bank Passbook Copy'
    ],
    applyPortal: 'PM Kisan Portal / UMANG App',
    applyUrl: 'https://pmkisan.gov.in',
    isPopular: true
  },
  {
    id: 'sch-pm-svanidhi',
    title: 'PM SVANidhi Microcredit for Street Vendors',
    titleHi: 'पीएम स्वनिधि स्ट्रीट वेंडर योजना',
    targetGroup: 'Job Seeker',
    category: 'Livelihood & Credit',
    ministry: 'Ministry of Housing and Urban Affairs',
    benefitAmount: 'Collateral-free working capital loan up to ₹50,000 + 7% Interest Subsidy',
    description: 'Affordable working capital loan to street vendors to resume their livelihoods with digital cashback incentives.',
    eligibility: [
      'Street vendors possessing Certificate of Vending / Identity Card',
      'Vendors identified in Urban Local Body (ULB) surveys'
    ],
    requiredDocs: [
      'Aadhaar Card',
      'Vending Certificate / Letter of Recommendation (LoR)',
      'Bank Account Details'
    ],
    applyPortal: 'PM SVANidhi Portal',
    applyUrl: 'https://pmsvanidhi.mohua.gov.in',
    isPopular: false
  },
  {
    id: 'sch-lakhpati-didi',
    title: 'Lakhpati Didi SHG Empowerment Scheme',
    titleHi: 'लखपति दीदी स्वयं सहायता समूह योजना',
    targetGroup: 'Women',
    category: 'Women Empowerment',
    ministry: 'Ministry of Rural Development (Deendayal Antyodaya - NRLM)',
    benefitAmount: 'Interest-free micro-loans up to ₹1,00,000 + Skill Training',
    description: 'Empowers rural women in Self Help Groups (SHGs) to earn a sustainable annual income of at least ₹1 Lakh through diverse micro-enterprises.',
    eligibility: [
      'Active member of a recognized Women Self Help Group (SHG)',
      'Participating in community investment fund activities'
    ],
    requiredDocs: [
      'Aadhaar Card',
      'SHG Membership Passbook',
      'Bank Account Number'
    ],
    applyPortal: 'NRLM Portal / State Rural Livelihood Mission',
    applyUrl: 'https://nrlm.gov.in',
    isPopular: true
  },
  {
    id: 'sch-pm-vaya-vandana',
    title: 'Senior Citizen Social Security & Pension (NSAP / APY)',
    titleHi: 'वरिष्ठ नागरिक सामाजिक सुरक्षा व पेंशन',
    targetGroup: 'Senior Citizen',
    category: 'Social Security',
    ministry: 'Ministry of Rural Development / Social Justice',
    benefitAmount: 'Assured Monthly Pension + Free Healthcare Cover',
    description: 'Comprehensive financial cushion, old-age pension, and Ayushman Bharat ₹5 Lakh coverage extended to all citizens above 70 years.',
    eligibility: [
      'Citizens aged 60 years or above (universal health cover for 70+)',
      'BPL criteria for National Old Age Pension scheme'
    ],
    requiredDocs: [
      'Aadhaar Card with Age Verification',
      'Bank Account / Post Office Savings Account',
      'Income Certificate (for means-tested pensions)'
    ],
    applyPortal: 'National Social Assistance Portal (NSAP)',
    applyUrl: 'https://nsap.nic.in',
    isPopular: false
  }
];
