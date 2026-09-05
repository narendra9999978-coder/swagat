export interface DocumentRule {
  id: string;
  name: string;
  nameHi: string;
  category: 'Identity' | 'Address' | 'Business' | 'Financial' | 'Academic';
  whyNeeded: string;
  whyNeededHi: string;
  issuingAuthority: string;
  acceptedFormats: string[];
  digiLockerDocType: string;
  isDigiLockerAvailable: boolean;
  commonMistakes: string[];
}

export const COMMON_DOCUMENTS: DocumentRule[] = [
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar Card (UIDAI)',
    nameHi: 'आधार कार्ड (UIDAI)',
    category: 'Identity',
    whyNeeded: 'Serves as the primary digital identity proof across IndiaStack. Required for instant OTP-based eKYC, e-Sign, and Direct Benefit Transfer (DBT) bank seeding.',
    whyNeededHi: 'इंडियास्टैक में प्राथमिक डिजिटल पहचान प्रमाण। त्वरित ओटीपी ई-केवाईसी, ई-हस्ताक्षर और प्रत्यक्ष लाभ हस्तांतरण (DBT) के लिए आवश्यक।',
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    acceptedFormats: ['DigiLocker XML / PDF', 'Masked e-Aadhaar PDF', 'Physical Card Scan'],
    digiLockerDocType: 'ADHAR',
    isDigiLockerAvailable: true,
    commonMistakes: ['Uploading blurred photo without QR code', 'Unlinked mobile number failing OTP authentication']
  },
  {
    id: 'doc-pan',
    name: 'Permanent Account Number (PAN)',
    nameHi: 'पैन कार्ड (आयकर विभाग)',
    category: 'Identity',
    whyNeeded: 'Mandatory for tax verification, business formation, opening current bank accounts, GSTIN generation, and MSME subsidy eligibility.',
    whyNeededHi: 'कर सत्यापन, व्यापार पंजीकरण, बैंक चालू खाता खोलने, जीएसटी और एमएसएमई सब्सिडी के लिए अनिवार्य।',
    issuingAuthority: 'Income Tax Department (via NSDL / UTIITSL)',
    acceptedFormats: ['e-PAN PDF', 'DigiLocker Issued Doc', 'Color Card Scan'],
    digiLockerDocType: 'PANCR',
    isDigiLockerAvailable: true,
    commonMistakes: ['Name spelling mismatch with Aadhaar card', 'PAN not linked to Aadhaar under IT rules']
  },
  {
    id: 'doc-income',
    name: 'Tehsildar Income Certificate',
    nameHi: 'तहसीलदार द्वारा जारी आय प्रमाण पत्र',
    category: 'Financial',
    whyNeeded: 'Establishes household annual income for scholarship criteria (< ₹2.5L), fee waivers, EWS quota benefits, and welfare pension eligibility.',
    whyNeededHi: 'छात्रवृत्ति (< ₹2.5 लाख), शुल्क छूट, ईडब्ल्यूएस कोटा और कल्याणकारी पेंशन पात्रता के लिए वार्षिक आय प्रमाणित करता है।',
    issuingAuthority: 'Revenue Department / Sub-Divisional Magistrate (SDM)',
    acceptedFormats: ['Digitally Signed e-District PDF with Barcode', 'Original Revenue Copy'],
    digiLockerDocType: 'INCER',
    isDigiLockerAvailable: true,
    commonMistakes: ['Submitting expired certificate (validity is typically 1 to 3 financial years)', 'Missing digital signature token of Tehsildar']
  },
  {
    id: 'doc-domicile',
    name: 'State Domicile Certificate',
    nameHi: 'राज्य अधिवास / मूल निवास प्रमाण पत्र',
    category: 'Address',
    whyNeeded: 'Mandatory statutory proof that you have resided in the state for 15+ continuous years, granting access to state quota admissions and state welfare programs.',
    whyNeededHi: '15+ वर्षों से राज्य में निवास का वैधानिक प्रमाण, राज्य कोटा प्रवेश और योजनाओं के लिए आवश्यक।',
    issuingAuthority: 'District Magistrate / Tehsildar (Revenue Dept)',
    acceptedFormats: ['DigiLocker Verified PDF', 'e-District Digitally Signed Certificate'],
    digiLockerDocType: 'DOMCR',
    isDigiLockerAvailable: true,
    commonMistakes: ['Submitting voter ID instead of formal revenue domicile certificate', 'Address discontinuity across school years']
  },
  {
    id: 'doc-premises',
    name: 'Business Premises Proof (Rent Deed / Electricity Bill)',
    nameHi: 'व्यावसायिक परिसर प्रमाण (किरायानामा / बिजली बिल)',
    category: 'Business',
    whyNeeded: 'Required for Shop Act (Gumasta) license, FSSAI hygiene location inspection, GST principal place of business verification, and Fire NOC.',
    whyNeededHi: 'दुकान अधिनियम (गुमास्ता), एफएसएसएआई खाद्य सुरक्षा, जीएसटी स्थान और फायर एनओसी के लिए आवश्यक।',
    issuingAuthority: 'Sub-Registrar Office (for Registered Lease) / State Power Utility',
    acceptedFormats: ['Registered Lease Agreement PDF', 'Latest 2 Months Electricity Bill', 'Property Tax Receipt'],
    digiLockerDocType: 'ELPBL',
    isDigiLockerAvailable: true,
    commonMistakes: ['Unnotarized plain paper rent agreement without owner consent letter', 'Outdated utility bill (> 3 months old)']
  },
  {
    id: 'doc-marksheet',
    name: 'Class 10th & 12th Board Marksheet',
    nameHi: '10वीं व 12वीं बोर्ड अंकतालिका',
    category: 'Academic',
    whyNeeded: 'Validates birth date verification and minimum percentage eligibility on National Scholarship Portal and technical job portals.',
    whyNeededHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल और नौकरी आवेदनों के लिए जन्म तिथि और न्यूनतम अंक प्रतिशत सत्यापित करता है।',
    issuingAuthority: 'CBSE / CISCE / State Education Boards',
    acceptedFormats: ['DigiLocker Verified Digital Marksheet', 'Attested Board Certificate'],
    digiLockerDocType: 'MARKS',
    isDigiLockerAvailable: true,
    commonMistakes: ['Uploading internet copy without official digital signature or school stamp', 'Blurred roll number or serial number']
  }
];
