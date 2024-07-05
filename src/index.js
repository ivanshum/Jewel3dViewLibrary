import React from 'react';
import ReactDOM from 'react-dom/client';
import { Viewer3d } from './3dviewer.js';

const setState = (domElId, option, newValue) => {
  const key = `${domElId}${option}`;
  window.sessionStorage.setItem(key, newValue);
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
};

function init(initialset, domElId, classNames = '') {
  const domNode = document.getElementById(domElId);
  const root = ReactDOM.createRoot(domNode);
  root.render(
    <Viewer3d
      storePrefix={domElId}
      defaultValues={initialset}
      classNames={classNames}
    />,
  );
}

export { init, setState };
