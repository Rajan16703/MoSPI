import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
// Requires expo-image-picker: install with `npx expo install expo-image-picker`.
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
// Real OCR wiring using Google Vision API (text detection) if key present; fallback to mock.

interface OCRResult { text: string; blocks?: { text: string; }[]; imageUri: string; createdAt: number; error?: string }
interface OCRContextValue {
  scans: OCRResult[];
  pickAndScan: () => Promise<void>;
  removeScan: (uri: string) => void;
}

const OCRContext = createContext<OCRContextValue | undefined>(undefined);

// NOTE: Placeholder OCR implementation – would call cloud or on-device ML kit.
export function OCRProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<OCRResult[]>([]);

  const visionKey = process.env.EXPO_PUBLIC_VISION_API_KEY; // user must set

  const callVision = async (base64: string): Promise<OCRResult> => {
    if (!visionKey) return { text: 'Set EXPO_PUBLIC_VISION_API_KEY to enable OCR.', imageUri: '', createdAt: Date.now(), error: 'missing_key' };
    try {
      const body = {
        requests: [{ image: { content: base64 }, features: [{ type: 'TEXT_DETECTION' }] }]
      };
      const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      const annotation = data?.responses?.[0]?.fullTextAnnotation;
      const text = annotation?.text || 'No text detected';
      const blocks = annotation?.pages?.[0]?.blocks?.map((b: any, i: number) => ({ text: b?.paragraphs?.map((p:any)=>p?.words?.map((w:any)=>w?.symbols?.map((s:any)=>s.text).join('')).join(' ')).join(' ') || 'block '+i })) || [];
      return { text, blocks, imageUri: '', createdAt: Date.now() };
    } catch (e:any) {
      return { text: 'OCR error: '+ e.message, imageUri: '', createdAt: Date.now(), error: 'vision_error' };
    }
  };

  const fakeOcr = async (uri: string): Promise<OCRResult> => ({ text: 'Sample OCR text (fallback).', blocks: [{ text: 'Sample block' }], imageUri: uri, createdAt: Date.now() });

  const pickAndScan = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    if (res.canceled) return;
    const asset = res.assets?.[0];
    if (!asset?.uri) return;
    let result: OCRResult;
    if (asset.base64 && visionKey) result = await callVision(asset.base64);
    else result = await fakeOcr(asset.uri);
    result.imageUri = asset.uri;
    setScans(prev => [result, ...prev]);
  }, [visionKey]);

  const removeScan = useCallback((uri: string) => setScans(prev => prev.filter(s => s.imageUri !== uri)), []);

  return <OCRContext.Provider value={{ scans, pickAndScan, removeScan }}>{children}</OCRContext.Provider>;
}

export function useOCR() {
  const ctx = useContext(OCRContext);
  if(!ctx) throw new Error('useOCR must be inside OCRProvider');
  return ctx;
}
