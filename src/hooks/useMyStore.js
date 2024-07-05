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

  return store;
}

export { useMyStore };
