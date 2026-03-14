'use client';

import React, { createContext, useContext } from 'react';

type Dict = Record<string, unknown>;

const DictionaryContext = createContext<Dict>({});

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dict;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dict = useContext(DictionaryContext);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function t(key: string): string {
    const keys = key.split('.');
    let result: any = dict;
    for (const k of keys) {
      result = result?.[k];
    }
    return (result as string) ?? key;
  }
  return { t, dict };
}
