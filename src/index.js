import React from 'react';
import ReactDOM from 'react-dom/client';
import { Helloj3vl } from './helloj3vl';

function init() {
  const domNode = document.getElementById('app');
  const root = ReactDOM.createRoot(domNode);
  root.render(<Helloj3vl />);
}

export { init };
