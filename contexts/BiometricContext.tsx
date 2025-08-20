import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface BiometricSession { verified: boolean; method: 'face' | 'fingerprint'; ts: number; }
interface BiometricContextValue {
  session?: BiometricSession;
  verify: (method?: 'face' | 'fingerprint') => Promise<boolean>;
  reset: () => void;
}

const BiometricContext = createContext<BiometricContextValue | undefined>(undefined);

export function BiometricProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BiometricSession | undefined>();

  const verify = useCallback(async (method: 'face' | 'fingerprint' = 'face') => {
    // Placeholder: integrate expo-local-authentication or WebAuthn for web
    await new Promise(r => setTimeout(r, 600));
    setSession({ verified: true, method, ts: Date.now() });
    return true;
  }, []);

  const reset = useCallback(()=> setSession(undefined), []);

  return <BiometricContext.Provider value={{ session, verify, reset }}>{children}</BiometricContext.Provider>;
}

export function useBiometric() {
  const ctx = useContext(BiometricContext);
  if(!ctx) throw new Error('useBiometric must be inside BiometricProvider');
  return ctx;
}
