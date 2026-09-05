export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export interface JourneyStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  department: string;
  portalName: string;
  portalUrl: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedDays: string;
  requiredDocsCount: number;
  actionButtonText: string;
  instructions: string[];
}

export interface Scenario {
  id: string;
  title: string;
  query: string;
  tagline: string;
  category: string;
  state: string;
  badge: string;
  persona: {
    name: string;
    role: string;
    avatar: string;
    location: string;
  };
  summary: string;
  relevantServices: {
    name: string;
    department: string;
    portal: string;
    type: 'Registration' | 'License' | 'Permission' | 'Tax' | 'Subsidy';
  }[];
  applicableSchemes: {
    name: string;
    benefit: string;
    subsidyOrGrant: string;
  }[];
  requiredDocs: {
    id: string;
    name: string;
    category: 'Identity' | 'Address' | 'Business' | 'Financial' | 'Technical';
    whyNeeded: string;
    issuingAuthority: string;
    digiLockerFetchable: boolean;
    mandatory: boolean;
  }[];
  journeySteps: JourneyStep[];
  nextBestAction: {
    title: string;
    description: string;
    estimatedTime: string;
    ctaText: string;
    actionType: 'prepare_docs' | 'apply_portal' | 'verify_identity' | 'track_status';
  };
  officialPortals: {
    name: string;
    acronym: string;
    role: string;
    url: string;
  }[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  iconName: string;
  count: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  department: string;
  level: 'Central' | 'State' | 'Local';
  state?: string;
  description: string;
  portalName: string;
  portalUrl: string;
  processingTime: string;
  fee: string;
  mandatoryDocs: string[];
  eligibility: string;
  tags: string[];
}

export interface SchemeItem {
  id: string;
  title: string;
  titleHi: string;
  targetGroup: 'Student' | 'Farmer' | 'Entrepreneur' | 'Job Seeker' | 'Women' | 'Senior Citizen';
  category: string;
  ministry: string;
  benefitAmount: string;
  description: string;
  eligibility: string[];
  requiredDocs: string[];
  applyPortal: string;
  applyUrl: string;
  isPopular?: boolean;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  role: string;
  tech: string;
  group: 'client' | 'api' | 'security' | 'integrations' | 'gov_backend';
  description: string;
}
