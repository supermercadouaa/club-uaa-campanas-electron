import React from 'react';
import { COLORS } from '../utils/constants';

export function Header() {
  return (
    <header style={{
      borderBottom: `2px solid ${COLORS.primary}`,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.surface2} 100%)`,
      backdropFilter: 'blur(10px)',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 800,
          color: COLORS.primary,
          boxShadow: '0 4px 12px rgba(54,1,95,.2)',
        }}>
          🎯
        </div>
        <span style={{
          fontSize: '16px',
          color: '#DDDDDD',
          fontWeight: 600,
          letterSpacing: '.02em',
        }}>
          Campañas Super UAA v2
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#AAAAAA',
        fontWeight: 500,
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: COLORS.muted2,
        }} />
        <span>Modo offline</span>
      </div>
    </header>
  );
}
