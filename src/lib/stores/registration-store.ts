import { create } from 'zustand';

export interface ItemDetails {
  name: string;
  description: string;
  category: string;
  value: string;
  purchaseDate: string;
  serialNumber: string;
}

export interface ProofFiles {
  receipt?: File;
  identification?: File;
  additionalDocs: File[];
}

export interface RegistrationState {
  currentStep: number;
  itemDetails: ItemDetails;
  proofFiles: ProofFiles;
  isLoading: boolean;
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  updateItemDetails: (details: Partial<ItemDetails>) => void;
  updateProofFiles: (files: Partial<ProofFiles>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialItemDetails: ItemDetails = {
  name: '',
  description: '',
  category: '',
  value: '',
  purchaseDate: '',
  serialNumber: ''
};

const initialProofFiles: ProofFiles = {
  additionalDocs: []
};

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  currentStep: 1,
  itemDetails: initialItemDetails,
  proofFiles: initialProofFiles,
  isLoading: false,

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setStep: (step: number) => {
    if (step >= 1 && step <= 3) {
      set({ currentStep: step });
    }
  },

  updateItemDetails: (details: Partial<ItemDetails>) => {
    set((state) => ({
      itemDetails: { ...state.itemDetails, ...details }
    }));
  },

  updateProofFiles: (files: Partial<ProofFiles>) => {
    set((state) => ({
      proofFiles: { 
        ...state.proofFiles, 
        ...files,
        additionalDocs: files.additionalDocs || state.proofFiles.additionalDocs
      }
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  reset: () => {
    set({
      currentStep: 1,
      itemDetails: initialItemDetails,
      proofFiles: initialProofFiles,
      isLoading: false
    });
  }
}));
