import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Header & Navigation
    'brand_tagline': 'INNOVATE | BUILD | SERVE',
    'nav_home': 'Home',
    'nav_about': 'About',
    'nav_approvals': 'Approvals',
    'nav_schemes': 'Schemes',
    'nav_kya': 'Know Your Approvals',
    'nav_resources': 'Resources',
    'nav_help': 'Help',
    'nav_dashboard': 'My Dashboard',
    'search_placeholder': 'Search approvals, schemes, departments, states...',
    'menu_login': 'Login',
    'menu_signup': 'Sign Up',
    'menu_investor': 'Investor / Business User',
    'menu_officer': 'Ministry / Government Officer',
    'menu_help': 'Help & Support',
    'menu_contact': 'Contact Us',
    'menu_logout': 'Logout',

    // Hero Section
    'hero_title': "India's Single Window for Business Approvals",
    'hero_subtitle': 'Discover, apply for and track the approvals your business needs — all from one intelligent platform.',
    'hero_cta_kya': 'Know Your Approvals',
    'hero_cta_approvals': 'Explore All Approvals',
    'hero_cta_schemes': 'View Government Schemes',
    'badge_central': 'Central Approvals',
    'badge_state': 'State Approvals',
    'badge_tracking': 'Application Tracking',
    'badge_schemes': 'Government Schemes',

    // KYA Questionnaire
    'kya_heading': 'Know Your Approvals (KYA)',
    'kya_subheading': 'Answer a few quick questions about your enterprise to generate a tailored compliance & approvals roadmap.',
    'kya_step1_title': 'What are you planning?',
    'kya_step2_title': 'Select Business Sector',
    'kya_step3_title': 'Select Location / State',
    'kya_step4_title': 'Business & Project Details',
    'kya_step5_title': 'Your Required Approvals',
    'kya_generate_btn': 'Generate Approval Checklist',
    'kya_view_details': 'View Details',
    'kya_add_dashboard': 'Add to My Dashboard',
    'kya_apply_now': 'Apply Now',

    // Benefits Section
    'benefits_heading': 'Everything You Need, In One Window',
    'benefits_subheading': 'Engineered to reduce regulatory friction, eliminate redundant paperwork, and accelerate project commissioning across India.',
    'b1_title': 'All Approvals in One Place',
    'b1_desc': 'Access 1,400+ Central and State clearances integrated into unified digital application forms with single-sign-on.',
    'b2_title': 'Real-Time Application Tracking',
    'b2_desc': 'Trace statutory movement, scrutinies, and inspection dates live across Central ministries and State departments.',
    'b3_title': 'Secure Document Repository',
    'b3_desc': 'Upload corporate KYC, land titles, and technical drawings once to your secure DigiLocker-backed locker.',
    'b4_title': 'Easy Renewals & Expiry Alerts',
    'b4_desc': 'Automated advance notifications for statutory license expirations, annual returns, and audit compliances.',
    'b5_title': 'Query & Grievance Management',
    'b5_desc': 'Resolve departmental queries online with transparent audit logs and time-bound grievance escalation.',
    'b6_title': 'Smart Approval Discovery',
    'b6_desc': 'Intelligent algorithms map your investment profile to pinpoint exact mandatory and conditional clearances.',

    // Common UI
    'central_approvals': 'Central Approvals',
    'state_approvals': 'State Approvals',
    'govt_schemes': 'Government Schemes',
    'view_all': 'View All',
    'processing_time': 'Processing Time',
    'statutory_fee': 'Statutory Fee',
    'validity': 'Validity',
    'required_docs': 'Required Documents',
    'eligibility': 'Eligibility',
    'apply': 'Apply',
    'view_details': 'View Details',
    'download_ack': 'Download Acknowledgement',
    'respond_query': 'Respond to Query',
    'track_status': 'Track Status',
    'skip_intro': 'Skip Intro'
  },
  hi: {
    // Header & Navigation
    'brand_tagline': 'नवाचार | निर्माण | सेवा',
    'nav_home': 'मुख्य पृष्ठ',
    'nav_about': 'हमारे बारे में',
    'nav_approvals': 'अनुमोदन व स्वीकृतियां',
    'nav_schemes': 'योजनाएं व प्रोत्साहन',
    'nav_kya': 'अपनी स्वीकृतियां जानें (KYA)',
    'nav_resources': 'संसाधन',
    'nav_help': 'सहायता',
    'nav_dashboard': 'मेरा डैशबोर्ड',
    'search_placeholder': 'स्वीकृतियां, योजनाएं, विभाग, राज्य खोजें...',
    'menu_login': 'लॉग इन करें',
    'menu_signup': 'साइन अप करें',
    'menu_investor': 'निवेशक / व्यवसाय उपयोगकर्ता',
    'menu_officer': 'मंत्रालय / सरकारी अधिकारी',
    'menu_help': 'सहायता एवं संपर्क',
    'menu_contact': 'संपर्क करें',
    'menu_logout': 'लॉग आउट',

    // Hero Section
    'hero_title': 'व्यवसाय स्वीकृतियों के लिए भारत का एकल खिड़की मंच',
    'hero_subtitle': 'अपने व्यवसाय के लिए आवश्यक सभी स्वीकृतियों को खोजें, आवेदन करें और ट्रैक करें — एक ही बुद्धिमान डिजिटल मंच से।',
    'hero_cta_kya': 'अपनी स्वीकृतियां जानें',
    'hero_cta_approvals': 'सभी स्वीकृतियां देखें',
    'hero_cta_schemes': 'सरकारी योजनाएं देखें',
    'badge_central': 'केंद्रीय स्वीकृतियां',
    'badge_state': 'राज्य स्वीकृतियां',
    'badge_tracking': 'आवेदन ट्रैकिंग',
    'badge_schemes': 'सरकारी योजनाएं',

    // KYA Questionnaire
    'kya_heading': 'अपनी स्वीकृतियां जानें (KYA)',
    'kya_subheading': 'अपने उद्योग के बारे में कुछ सरल प्रश्नों के उत्तर दें और वैधानिक अनुमोदनों की सूची प्राप्त करें।',
    'kya_step1_title': 'आपकी क्या योजना है?',
    'kya_step2_title': 'व्यवसाय क्षेत्र का चयन करें',
    'kya_step3_title': 'स्थान / राज्य का चयन करें',
    'kya_step4_title': 'व्यवसाय एवं परियोजना विवरण',
    'kya_step5_title': 'आपकी आवश्यक स्वीकृतियां',
    'kya_generate_btn': 'स्वीकृति चेकलिस्ट बनाएं',
    'kya_view_details': 'विवरण देखें',
    'kya_add_dashboard': 'डैशबोर्ड में जोड़ें',
    'kya_apply_now': 'आवेदन करें',

    // Benefits Section
    'benefits_heading': 'सब कुछ जो आपको चाहिए, एक ही खिड़की में',
    'benefits_subheading': 'नियामक बाधाओं को कम करने और पूरे भारत में परियोजना चालू करने में तेज़ी लाने के लिए निर्मित।',
    'b1_title': 'सभी स्वीकृतियां एक ही स्थान पर',
    'b1_desc': '1,400+ केंद्रीय एवं राज्य स्वीकृतियों तक एकल डिजिटल फॉर्म और सिंगल साइन-ऑन के माध्यम से पहुंचें।',
    'b2_title': 'रियल-टाइम आवेदन ट्रैकिंग',
    'b2_desc': 'केंद्रीय मंत्रालयों और राज्य विभागों में अपने आवेदनों और निरीक्षण तिथियों को लाइव ट्रैक करें।',
    'b3_title': 'सुरक्षित दस्तावेज़ लॉकर',
    'b3_desc': 'कॉर्पोरेट केवाईसी, भूमि स्वामित्व और तकनीकी मानचित्रों को डिजी लॉकर समर्थित रिपॉजिटरी में सुरक्षित रखें।',
    'b4_title': 'आसान नवीनीकरण व अलर्ट',
    'b4_desc': 'लाइसेंस समाप्ति, वार्षिक रिटर्न और अनुपालन के लिए स्वतः अग्रिम सूचनाएं प्राप्त करें।',
    'b5_title': 'प्रश्न व शिकायत निवारण',
    'b5_desc': 'पारदर्शी ऑडिट लॉग और समयबद्ध समाधान के साथ विभागीय प्रश्नों का ऑनलाइन उत्तर दें।',
    'b6_title': 'स्मार्ट स्वीकृति खोज',
    'b6_desc': 'स्मार्ट एल्गोरिदम आपके निवेश प्रोफाइल का विश्लेषण कर सटीक अनिवार्य अनुमतियों की पहचान करता है।',

    // Common UI
    'central_approvals': 'केंद्रीय स्वीकृतियां',
    'state_approvals': 'राज्य स्वीकृतियां',
    'govt_schemes': 'सरकारी योजनाएं',
    'view_all': 'सभी देखें',
    'processing_time': 'प्रसंस्करण समय',
    'statutory_fee': 'सरकारी शुल्क',
    'validity': 'वैधता',
    'required_docs': 'आवश्यक दस्तावेज़',
    'eligibility': 'पात्रता',
    'apply': 'आवेदन करें',
    'view_details': 'विवरण देखें',
    'download_ack': 'पावती डाउनलोड करें',
    'respond_query': 'प्रश्न का उत्तर दें',
    'track_status': 'स्थिति ट्रैक करें',
    'skip_intro': 'इंट्रो छोड़ें'
  },
  mr: {},
  ta: {},
  te: {},
  bn: {}
};

// Fallback for languages with missing keys
['mr', 'ta', 'te', 'bn'].forEach(lang => {
  translations[lang as LanguageCode] = { ...translations.en };
});

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
