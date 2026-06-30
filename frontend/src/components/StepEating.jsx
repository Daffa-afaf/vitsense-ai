import React from "react";
import SliderField from "../components/SliderField";
import ToggleField from "../components/ToggleField";

export default function StepEating({ form, update, onBack, onNext }) {
  // Pilihan Dropdown Snack & Alkohol dari Google Stitch
  const snackOptions = [
    { value: "jarang", label: "Jarang (1-2 kali/minggu)" },
    { value: "sedang", label: "Sedang (1 kali/hari)" },
    { value: "sering", label: "Sering (2+ kali/hari)" }
  ];

  const alcoholOptions = [
    { value: "tidak_pernah", label: "Tidak Pernah" },
    { value: "kadang", label: "Kadang-kadang" },
    { value: "sering", label: "Sering" }
  ];

  return (
  <div style={{ padding: '24px 16px 100px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    
    {/* BAGIAN HEADER BARU */}
    <section style={{ marginBottom: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {/* Kiri atas: Nama Aplikasi */}
        <span style={{ fontSize: '26px', fontWeight: '700', color: 'var(--primary)' }}>
          VitSense AI
        </span>
        
        {/* Kanan atas: Langkah */}
        <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Langkah 2 dari 3</span>
      </div>

      <h2 style={{ fontSize: '25px', fontWeight: '700', margin: '4px 0', color: 'var(--on-surface)'}}>Kebiasaan Makan</h2>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px', margin: 0, lineHeight: '20px'}}>
        Bantu kami memahami rutinitas asupan Anda untuk analisis yang lebih baik.
      </p>
    </section>

      {/* 1. Berapa kali makan utama dalam sehari (Slider/Grid kustom) */}
      <div className="stitch-card">
        <SliderField
          label="Berapa kali Anda makan utama dalam sehari?"
          value={form.NCP}
          min={1} 
          max={4} 
          step={1}
          onChange={(v) => update({ NCP: v })}
        />
      </div>

      {/* 2. Seberapa sering konsumsi sayur & buah */}
      <div className="stitch-card">
        <SliderField
          label="Konsumsi Sayuran"
          value={form.FCVC}
          min={1} 
          max={4} 
          step={1}
          onChange={(v) => update({ FCVC: v })}
        />
      </div>

      {/* 3. Konsumsi air minum per hari */}
      <div className="stitch-card">
        <SliderField
          label="Air minum (gelas per hari)"
          value={form.CH2O}
          min={1} max={7} step={1}
          onChange={(v) => update({ CH2O: v })}
        />
      </div>

      {/* 4. Dropdown Kustom: Frekuensi Ngemil */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--on-surface-variant)' }}>
          Frekuensi ngemil (Snack)
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            className="stitch-select"
            value={form.CAEC || "sedang"} 
            onChange={(e) => update({ CAEC: e.target.value })}
          >
            {snackOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* 5. Dropdown Kustom Tambahan: Konsumsi Alkohol */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--on-surface-variant)' }}>
          Konsumsi Alkohol
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            className="stitch-select"
            value={form.CALC || "tidak_pernah"} 
            onChange={(e) => update({ CALC: e.target.value })}
          >
            {alcoholOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* 6. Toggles Section (Disatukan dalam satu container card seperti desain) */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ToggleField
          label="Sering konsumsi kalori tinggi"
          hint="Makanan cepat saji, gorengan, manis-manis."
          value={form.FAVC}
          onChange={(v) => update({ FAVC: v })}
        />
        
        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-variant)', margin: 0 }} />

        <ToggleField
          label="Riwayat keluarga (Diabetes/Hipertensi)"
          hint="Apakah ada keluarga inti dengan kondisi ini?"
          value={form.family_history_with_overweight}
          onChange={(v) => update({ family_history_with_overweight: v })}
        />
      </div>

      {/* Navigasi Bawah */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <button 
          type="button" 
          onClick={onBack}
          className="btn-back"
          style={{ padding: '12px 24px' }}
        >
          Kembali
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="btn-next"
          style={{ padding: '12px 28px', fontWeight: '600' }}
        >
          Simpan & Lanjutkan
        </button>
      </div>

    </div>
  );
}