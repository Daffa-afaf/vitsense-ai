import { GENDER_OPTIONS } from "../lib/constants";

export default function StepPhysical({ form, update, onNext }) {
  const valid =
    form.Gender &&
    form.Age >= 10 && form.Age <= 100 &&
    form.Height >= 1.0 && form.Height <= 2.5 &&
    form.Weight >= 20 && form.Weight <= 300;

  const heightWarning =
    form.Height > 2.5
      ? "Gunakan satuan meter, contoh: 1.75"
      : form.Height > 0 && form.Height < 1.0
      ? "Tinggi terlalu kecil — pastikan dalam meter"
      : null;

  return (
  <div className="step-page" style={{ padding: '16px' }}>
    
    {/* BAGIAN HEADER BARU (Ditambahkan flexbox) */}
    <div className="step-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '32px',
      paddingBottom: '12px',
      borderBottom: '1px solid #f0f0f0' // Opsional: garis tipis pembatas
    }}>
      {/* Kiri atas: Nama Aplikasi */}
      <span style={{ fontSize: '26px', fontWeight: '700', color: 'var(--primary)' }}>
        VitSense AI
      </span>
      
      {/* Kanan atas: Langkah */}
      <div className="step-eyebrow" style={{ fontSize: '14px', color: 'var(--on-surface-variant)', margin: 0 }}>
        Langkah 1 dari 3
      </div>
    </div>

    {/* Judul & Deskripsi ditaruh di bawah baris nama aplikasi */}
    <div style={{ marginBottom: '24px' }}>
      <h1 className="step-title" style={{ fontSize: '25px', fontWeight: '600', margin: '0 0 8px 0'}}>
        Profil Fisik
      </h1>
      <p className="step-desc" style={{ color: 'var(--on-surface-variant)', margin: 0, fontSize: '15px'}}>
        Bantu kami menyesuaikan rekomendasi dengan melengkapi profil fisik Anda. Informasi ini bersifat pribadi dan aman.
      </p>
    </div>

      {/* Gender - Menggunakan .gender-container dan .gender-card dari index.css */}
      <fieldset>
        <legend>Pilih Jenis Kelamin</legend>
        <div className="gender-container">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`gender-card ${form.Gender === opt.value ? "active" : ""}`}
              onClick={() => update({ Gender: opt.value })}
            >
              {/* Menggunakan Google Material Symbols yang di-import di index.css */}
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                {opt.value.toLowerCase() === "male" || opt.value === "Laki-laki" ? "man" : "woman"}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Age */}
      <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <legend style={{ fontSize: '18px' }}>Usia Anda</legend>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="number"
            placeholder="Misal: 25"
            value={form.Age}
            min={10}
            max={100}
            onChange={(e) => update({ Age: e.target.value })}
          />
          <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Tahun
          </span>
        </div>
      </fieldset>

      {/* Height & Weight Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Height */}
        <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
          <legend style={{ fontSize: '18px' }}>Tinggi Badan</legend>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="number"
              style={{ borderColor: heightWarning ? 'var(--error)' : 'transparent' }}
              placeholder="Misal: 1.75"
              value={form.Height}
              step="0.01"
              min={1.0}
              max={2.5}
              onChange={(e) => update({ Height: e.target.value })}
            />
            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
              Meter (m)
            </span>
          </div>
          {heightWarning && <p style={{ color: 'var(--error)', margin: 0, fontSize: '12px' }}>{heightWarning}</p>}
          <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '12px' }}>
            Gunakan meter (contoh: 1.75, bukan 175)
          </p>
        </fieldset>

        {/* Weight */}
        <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
          <legend style={{ fontSize: '18px' }}>Berat Badan</legend>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="number"
              placeholder="Misal: 65.5"
              value={form.Weight}
              step="0.1"
              min={20}
              max={300}
              onChange={(e) => update({ Weight: e.target.value })}
            />
            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
              kg
            </span>
          </div>
        </fieldset>
      </div>

      {/* Live BMI preview */}
      {form.Height >= 1.0 && form.Height <= 2.5 && form.Weight >= 20 && (
        <div style={{ margin: '20px 0', padding: '12px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '500' }}>Estimasi BMI</span>
          <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '18px' }}>
            {(form.Weight / (form.Height ** 2)).toFixed(1)}
          </span>
        </div>
      )}

      {/* Action Button Area */}
      {/* Action Button Area - Membuat Tombol Sejajar Sempurna */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '32px',
        paddingTop: '16px',
        borderTop: '1px solid var(--surface-variant)'
      }}>
        {/* Tombol Kembali ditaruh di sini agar sejajar */}
        <button
          type="button"
          className="btn-back"
          onClick={() => window.history.back()} // atau gunakan fungsi onBack dari props jika ada
          style={{ padding: '12px 24px' }}
        >
          Kembali
        </button>

        {/* Tombol Lanjutkan Biru */}
        <button
          className="btn-next"
          disabled={!valid}
          onClick={onNext}
          style={{ 
            opacity: valid ? 1 : 0.5, 
            cursor: valid ? 'pointer' : 'not-allowed', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px 24px'
          }}
        >
          Lanjutkan 
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>
    </div>
  );
}