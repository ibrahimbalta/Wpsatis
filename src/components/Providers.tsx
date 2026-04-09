'use client';

import React from 'react';
import { SectorProvider } from '@/context/SectorContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SectorProvider>
      {children}
    </SectorProvider>
  );
}
