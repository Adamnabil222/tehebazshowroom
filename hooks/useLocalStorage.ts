// Fix: Import Dispatch and SetStateAction to resolve missing React namespace for types.
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getValueFromLocalStorage<T,>(key: string, initialValue: T): T {
  const savedValue = localStorage.getItem(key);
  if (savedValue) {
    try {
      return JSON.parse(savedValue) as T;
    } catch (error) {
      console.error('Error parsing JSON from localStorage', error);
      return initialValue;
    }
  }
  return initialValue;
}

export function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getValueFromLocalStorage(key, initialValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item to localStorage', error);
    }
  }, [key, value]);

  return [value, setValue];
}
