// src/components/Layout.jsx
import React from 'react';

function Layout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-header__title">TinyLink Dashboard</h1>
      </header>

      <main className="app-main">
        <div className="app-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
