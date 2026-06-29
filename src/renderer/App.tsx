import React from 'react';
import { Header } from './components/Header';
import { Campaign } from './components/Campaign';
import { COLORS } from './utils/constants';

function App() {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: COLORS.bg,
      color: COLORS.text,
      minHeight: '100vh',
      fontSize: '15px',
      lineHeight: 1.6,
    }}>
      <Header />
      <Campaign />
    </div>
  );
}

export default App;
