import { useEffect } from 'react';
import { useImmer } from 'use-immer';

const isClientSide = typeof window !== 'undefined';
const hasLocalStorageAccess =
  isClientSide &&
  !!(() => {
    try {
      localStorage.getItem('test');
      return true;
    } catch {
      return false;
    }
  })();

const getItemFromStore = (key, defaultValue = false, serialize = false) => {
  if (hasLocalStorageAccess) {
    let value = localStorage.getItem(key);
    if (value === 'true' || value === 'false') {
      return JSON.parse(value);
    }
    if (value && value === 'null') {
      return defaultValue;
    }
    if (serialize) {
      try {
        value = JSON.parse(value);
      } catch {}
    }
    return value || defaultValue;
  }
  return defaultValue;
};

const setItemInStore = (key, value) => {
  if (hasLocalStorageAccess) {
    localStorage.setItem(key, value);
  }
};

const useStateWithLocalStorage = (
  localStorageKey,
  defaultValue = false,
  serialize = false
) => {
  const [value, setValue] = useImmer(
    getItemFromStore(localStorageKey, defaultValue, serialize)
  );

  useEffect(() => {
    setItemInStore(localStorageKey, serialize ? JSON.stringify(value) : value);
  }, [value]);

  return [value, setValue];
};

export { useStateWithLocalStorage, getItemFromStore, setItemInStore };
