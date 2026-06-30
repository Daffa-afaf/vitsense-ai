import React from 'react';

export default function ToggleField({ label, hint, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <div style={{ paddingRight: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: 'var(--on-surface)' }}>{label}</h4>
        {hint && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--on-surface-variant)' }}>{hint}</p>}
      </div>
      
      {/* Saklar Switch Bulat ala iOS/Stitch */}
      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', flexShrink: 0, cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0 }} 
        />
        <span style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: value ? 'var(--primary)' : '#e0e3e5',
          borderRadius: '24px',
          transition: '0.3s',
        }}>
          <span style={{
            position: 'absolute',
            content: '""',
            height: '18px', width: '18px',
            left: value ? '22px' : '3px',
            bottom: '3px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: '0.3s',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
          }} />
        </span>
      </label>
    </div>
  );
}