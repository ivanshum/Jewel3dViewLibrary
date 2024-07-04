import React from 'react';
import ReactDOM from 'react-dom/client';
import { Viewer3d } from './3dviewer.js';

function init(initialset, domElId) {
  const domNode = document.getElementById(domElId);
  const root = ReactDOM.createRoot(domNode);
  root.render(<Viewer3d storePrefix={domElId} defaultValues={initialset} />);
}

export { init };
