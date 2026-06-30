import React from 'react';

export default function SliderField({ label, value, min, max, onChange, step = 1 }) {
  const isMealsPerDay = label.toLowerCase().includes("makan utama");
  const isVegetableFruit = label.toLowerCase().includes("sayur");
  const isScreenTime = label.toLowerCase().includes("layar") || label.toLowerCase().includes("teknologi");

  // A. RENDER GRID UNTUK MAKAN UTAMA
  if (isMealsPerDay) {
    const mealOptions = [
    { id: 1, title: "1", sub: "Kali" },
    { id: 2, title: "2", sub: "Kali" },
    { id: 3, title: "3", sub: "Kali" },
    { id: 4, title: "4+", sub: "Kali" }
  ];

  return (
    <div>
      {/* Judul utama dengan layout icon (opsional) */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--on-surface)', margin: '0 0 4px 0' }}>
        {label}
      </h3>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: '0 0 16px 0' }}>
        Berapa kali Anda makan utama dalam hari?
      </p>
      
      {/* Grid diubah menjadi 2 kolom (repeat(2, 1fr)) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {mealOptions.map((opt) => {
          // Menentukan status aktif berdasarkan ID angka (1 sampai 4)
          const isSelected = value === opt.id || (!value && opt.id === 2); // Default pilih opsi kedua jika kosong
          
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '16px 0',
                borderRadius: '12px',
                border: isSelected ? '2px solid #0f52ff' : '1px solid #e1e4ff', 
                backgroundColor: isSelected ? '#f2f4f6' : '#f7f9fb', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Angka Rentang Porsi */}
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: isSelected ? '#1e524d' : '#212121',
                marginBottom: '4px'
              }}>
                {opt.title}
              </span>
              
              {/* Teks Sub-label "Porsi" */}
              <span style={{ 
                fontSize: '11px', 
                color: isSelected ? '#1e524d' : '#757575',
                fontWeight: '500'
              }}>
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// B. RENDER GRID UNTUK SAYUR & BUAH (Gaya Porsi Kotak 2x2)
if (isVegetableFruit) {
  // 1. Definisikan susunan data 
  const vegOptions = [
    { id: 1, title: "0 - 1", sub: "Porsi" },
    { id: 2, title: "2 - 3", sub: "Porsi" },
    { id: 3, title: "4 - 5", sub: "Porsi" },
    { id: 4, title: "6+", sub: "Porsi" }
  ];

  return (
    <div>
      {/* Judul utama dengan layout icon (opsional) */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--on-surface)', margin: '0 0 4px 0' }}>
        {label}
      </h3>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: '0 0 16px 0' }}>
        Berapa porsi sayuran atau buah yang biasanya Anda konsumsi setiap hari?
      </p>
      
      {/* Grid diubah menjadi 2 kolom (repeat(2, 1fr)) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {vegOptions.map((opt) => {
          // Menentukan status aktif berdasarkan ID angka (1 sampai 4)
          const isSelected = value === opt.id || (!value && opt.id === 2); // Default pilih opsi kedua jika kosong
          
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '16px 0',
                borderRadius: '12px',
                border: isSelected ? '2px solid #0f52ff' : '1px solid #e1e4ff', 
                backgroundColor: isSelected ? '#f2f4f6' : '#f7f9fb', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Angka Rentang Porsi */}
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: isSelected ? '#1e524d' : '#212121',
                marginBottom: '4px'
              }}>
                {opt.title}
              </span>
              
              {/* Teks Sub-label "Porsi" */}
              <span style={{ 
                fontSize: '11px', 
                color: isSelected ? '#1e524d' : '#757575',
                fontWeight: '500'
              }}>
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

 // C. RENDER SLIDER GAYA BARU (Untuk Penggunaan Teknologi)
  if (isScreenTime) {
    // Buat urutan baris angka indikator bawah secara manual agar rapi
    const customTicks = [0, 3, 6, 9, "12+"];

    return (
      <div>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '20px' }}>
          {label}
        </p>

        {/* Baris Keterangan Rentang (Sedikit, Nilai Aktif, Banyak) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#424242' }}>Sedikit</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f52ff' }}>
            {value === 12 ? "12+ Jam" : `${value || 0} Jam`}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#424242' }}>Banyak</span>
        </div>

        {/* Input Jalur Slider */}
        <div style={{ position: 'relative', padding: '8px 0' }}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              cursor: 'pointer',
              accentColor: '#0f52ff',
              backgroundColor: '#e1e4ff',
              borderRadius: '3px',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          />

          {/* Baris Angka Indikator Tahap (0, 3, 6, 9, 12+) */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#757575',
            marginTop: '12px',
            padding: '0 4px'
          }}>
            {customTicks.map((tick, index) => (
              <span key={index} style={{ width: '24px', textAlign: 'center' }}>
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback default render jika tidak masuk kriteria mana pun
  return null;
}
   