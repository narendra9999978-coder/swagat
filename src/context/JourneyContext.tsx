import React, { createContext, useContext, useState } from 'react';
import { Scenario, ServiceItem, SchemeItem } from '../types';
import { DEMO_SCENARIOS } from '../data/scenarios';
import confetti from 'canvas-confetti';

interface UserAadhaarProfile {
  name: string;
  aadhaarMasked: string;
  digiLockerVerified: boolean;
  state: string;
}

interface JourneyContextType {
  currentScenario: Scenario;
  selectScenario: (id: string) => void;
  activeStepIndex: number;
  setActiveStepIndex: (idx: number) => void;
  checkedDocIds: string[];
  toggleDocCheck: (docId: string) => void;
  importDigiLockerDocs: () => void;
  completedStepIds: string[];
  toggleStepComplete: (stepId: string) => void;
  
  // Modals & Navigation
  isAskModalOpen: boolean;
  askModalInitialQuery: string;
  openAskModal: (query?: string) => void;
  closeAskModal: () => void;
  
  selectedServiceModal: ServiceItem | null;
  setSelectedServiceModal: (srv: ServiceItem | null) => void;
  
  selectedSchemeModal: SchemeItem | null;
  setSelectedSchemeModal: (sch: SchemeItem | null) => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;
  
  userProfile: UserAadhaarProfile | null;
  loginAadhaarDemo: (name: string) => void;
  logoutAadhaar: () => void;
  
  // Actions
  triggerConfetti: () => void;
  createCustomJourney: (queryText: string, stateName?: string) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(DEMO_SCENARIOS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2); // Step 3 currently active (0-indexed: 2)
  const [checkedDocIds, setCheckedDocIds] = useState<string[]>(['doc-pan', 'doc-aadhaar']);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(['step-1', 'step-2']);
  
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [askModalInitialQuery, setAskModalInitialQuery] = useState<string>('');
  
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [selectedSchemeModal, setSelectedSchemeModal] = useState<SchemeItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  
  const [userProfile, setUserProfile] = useState<UserAadhaarProfile | null>({
    name: 'Pooja Patil',
    aadhaarMasked: 'XXXX-XXXX-8924',
    digiLockerVerified: true,
    state: 'Maharashtra'
  });

  const selectScenario = (id: string) => {
    const found = DEMO_SCENARIOS.find(s => s.id === id);
    if (found) {
      setCurrentScenario(found);
      setActiveStepIndex(1);
      // Auto pre-fill first 2 doc checks
      setCheckedDocIds(found.requiredDocs.slice(0, 2).map(d => d.id));
      setCompletedStepIds(found.journeySteps.filter(st => st.status === 'completed').map(st => st.id));
    }
  };

  const toggleDocCheck = (docId: string) => {
    setCheckedDocIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const importDigiLockerDocs = () => {
    const allDigiDocIds = currentScenario.requiredDocs
      .filter(d => d.digiLockerFetchable)
      .map(d => d.id);
    
    setCheckedDocIds(prev => Array.from(new Set([...prev, ...allDigiDocIds])));
    triggerConfetti();
  };

  const toggleStepComplete = (stepId: string) => {
    setCompletedStepIds(prev => {
      const updated = prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId];
      if (updated.length === currentScenario.journeySteps.length) {
        triggerConfetti();
      }
      return updated;
    });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B2545', '#E05A10', '#057A55', '#D97706']
      });
    } catch {
      // safe fallback
    }
  };

  const openAskModal = (query?: string) => {
    setAskModalInitialQuery(query || '');
    setIsAskModalOpen(true);
  };

  const closeAskModal = () => {
    setIsAskModalOpen(false);
  };

  const loginAadhaarDemo = (name: string) => {
    setUserProfile({
      name: name || 'Citizen User',
      aadhaarMasked: 'XXXX-XXXX-4219',
      digiLockerVerified: true,
      state: 'National / All States'
    });
    setIsAuthModalOpen(false);
    triggerConfetti();
  };

  const logoutAadhaar = () => {
    setUserProfile(null);
  };

  const createCustomJourney = (queryText: string, stateName = 'India') => {
    // Check if matches one of the 4 scenarios
    const lower = queryText.toLowerCase();
    let matchedScenario: Scenario | undefined;

    if (lower.includes('scholar') || lower.includes('child') || lower.includes('college') || lower.includes('school')) {
      matchedScenario = DEMO_SCENARIOS.find(s => s.id === 'child-scholarship');
    } else if (lower.includes('certif') || lower.includes('domicile') || lower.includes('income') || lower.includes('caste')) {
      matchedScenario = DEMO_SCENARIOS.find(s => s.id === 'government-certificate');
    } else if (lower.includes('scheme') || lower.includes('farmer') || lower.includes('support') || lower.includes('eligible')) {
      matchedScenario = DEMO_SCENARIOS.find(s => s.id === 'scheme-discovery');
    } else {
      matchedScenario = DEMO_SCENARIOS.find(s => s.id === 'small-business');
    }

    if (matchedScenario) {
      setCurrentScenario({
        ...matchedScenario,
        query: queryText,
        state: stateName || matchedScenario.state
      });
      setCheckedDocIds(matchedScenario.requiredDocs.slice(0, 2).map(d => d.id));
      setCompletedStepIds(matchedScenario.journeySteps.filter(st => st.status === 'completed').map(st => st.id));
    }
  };

  return (
    <JourneyContext.Provider
      value={{
        currentScenario,
        selectScenario,
        activeStepIndex,
        setActiveStepIndex,
        checkedDocIds,
        toggleDocCheck,
        importDigiLockerDocs,
        completedStepIds,
        toggleStepComplete,
        isAskModalOpen,
        askModalInitialQuery,
        openAskModal,
        closeAskModal,
        selectedServiceModal,
        setSelectedServiceModal,
        selectedSchemeModal,
        setSelectedSchemeModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        userProfile,
        loginAadhaarDemo,
        logoutAadhaar,
        triggerConfetti,
        createCustomJourney
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
