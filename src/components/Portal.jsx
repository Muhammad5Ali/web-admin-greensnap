// src/components/Portal.jsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
  const portalRoot = useRef(document.getElementById('portal-root'));
  
  // Create portal container if it doesn't exist
  if (!portalRoot.current) {
    portalRoot.current = document.createElement('div');
    portalRoot.current.id = 'portal-root';
    document.body.appendChild(portalRoot.current);
  }

  const el = useRef(document.createElement('div'));

  useEffect(() => {
    portalRoot.current.appendChild(el.current);
    return () => {
      portalRoot.current.removeChild(el.current);
    };
  }, []);

  return ReactDOM.createPortal(children, el.current);
};

export default Portal;