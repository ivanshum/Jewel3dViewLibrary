import React from 'react';
import ReactDOM from 'react-dom/client';
import { Viewer3d } from './3dviewer.js';

function init({ ...config }) {
  const domNode = document.getElementById('app');
  const root = ReactDOM.createRoot(domNode);
  root.render(<Viewer3d config={config} />);
}

export { init };
