// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StatsPage from './pages/StatsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<StatsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
