import React from 'react';

function useMyStore(key, defaultValue) {
  const [store, setStore] = React.useState(() => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? value : defaultValue;
  });

  React.useEffect(() => {
    const subscribe = () => {
      window.addEventListener('storage', (event) => {
        if (event.key === key) {
          setStore(event.newValue);
        }
      });
      return () => window.removeEventListener('storage', subscribe);
    };

    const unsubscribe = subscribe();

    return unsubscribe;
  }, [key, defaultValue]);

  const setSidebarState = (newValue) => {
    window.sessionStorage.setItem(key, newValue);
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
  };

  return [store, setSidebarState];
}

export { useMyStore };
