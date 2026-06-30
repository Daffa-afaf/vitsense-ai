import {
  FAF_LABELS, TUE_LABELS, FREQUENCY_OPTIONS, MTRANS_OPTIONS
} from "../lib/constants";
import SliderField from "../components/SliderField";
import ToggleField from "../components/ToggleField";

export default function StepLifestyle({ form, update, onBack, onSubmit, loading, error }) {
  
  // Mapping opsi nilai FAF dari konstanta (0-3) ke format label & sub-label kustom sesuai desain Stitch
  const fafOptions = [
    { value: 0, label: "Jarang", sub: "< 1 kali", icon: "chair" },
    { value: 1, label: "Kadang-kadang", sub: "1 - 2 kali", icon: "directions_walk" },
    { value: 2, label: "Sering", sub: "2 - 4 kali", icon: "fitness_center" },
    { value: 3, label: "Sangat Sering", sub: "5+ kali", icon: "sports_gymnastics" }
  ];

  const alcoholOptions = [
    { value: "no", label: "Tidak Pernah" },
    { value: "Sometimes", label: "Kadang-kadang" },
    { value: "Frequently", label: "Sering" }
  ];

  return (
    <div style={{ padding: '24px 16px 100px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. HEADER & HUBUNGAN GAP NAMA APLIKASI */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--surface-variant)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>arrow_back</span>
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>VitSense AI</h1>
        </div>
        <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Langkah 3 dari 3</span>
      </header>

      {/* Judul Sub-Halaman */}
      <section style={{ margin: '8px 0' }}>
        <h2 style={{ fontSize: '25px', fontWeight: '700', margin: '4px 0', color: 'var(--on-surface)' }}>Gaya Hidup & Kebiasaan</h2>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: 0, lineHeight: '20px' }}>
          Perbarui profil gaya hidup Anda agar VitaAI dapat memberikan rekomendasi kesehatan yang lebih akurat dan terpersonalisasi.
        </p>
      </section>

      {/* 2. FREKUENSI AKTIVITAS FISIK (Ubah ke Grid 2x2 Atas 2 Bawah 2) */}
      <div className="stitch-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ backgroundColor: 'rgba(15, 82, 255, 0.1)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>directions_run</span>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Frekuensi Aktivitas Fisik</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0 }}>Seberapa sering Anda berolahraga dalam seminggu?</p>
          </div>
        </div>

        {/* Struktur Grid 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
          {fafOptions.map((opt) => {
            const isSelected = form.FAF === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ FAF: opt.value })}
                style={{
                  padding: '16px 8px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--surface-variant)',
                  backgroundColor: isSelected ? 'rgba(15, 82, 255, 0.06)' : 'var(--surface-container-lowest)',
                  color: isSelected ? 'var(--primary)' : 'var(--on-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px', opacity: isSelected ? 1 : 0.7 }}>{opt.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{opt.label}</span>
                <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{opt.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PENGGUNAAN TEKNOLOGI (TUE Slider) */}
      <div className="stitch-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>devices</span>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Penggunaan Teknologi</h3>
        </div>
        <SliderField
          label="Rata-rata jam menatap layar di luar jam kerja."
          value={form.TUE}
          min={0}
          max={12} 
          step={1}
          onChange={(v) => update({ TUE: v })}
        />
      </div>

      {/* 4. TRANSPORTASI UTAMA (Dropdown Kustom) */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>commute</span>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Transportasi Utama</h3>
        </div>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', margin: '0 0 4px 0' }}>Mode transportasi yang paling sering digunakan sehari-hari.</p>
        <select
          className="stitch-select"
          value={form.MTRANS}
          onChange={(e) => update({ MTRANS: e.target.value })}
        >
          {MTRANS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 5. KEBIASAAN HARIAN (Meneruskan Toggle Merokok & Pantau Kalori) */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>volunteer_activism</span>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Kebiasaan Harian</h3>
        </div>

        <ToggleField
          label="Merokok"
          hint="Termasuk rokok elektrik atau vape."
          value={form.SMOKE}
          onChange={(v) => update({ SMOKE: v })}
        />
        
        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-variant)', margin: 0 }} />

        <ToggleField
          label="Pantau Kalori"
          hint="Secara aktif menghitung asupan kalori harian."
          value={form.SCC}
          onChange={(v) => update({ SCC: v })}
        />
      </div>

      {/* Penampil Error dari Backend */}
      {error && (
        <div style={{ padding: '12px', backgroundColor: 'var(--error-container)', color: 'var(--error)', borderRadius: '12px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* ACTION BUTTON NAVIGASI UTAMA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          type="button"
          className="btn-next"
          onClick={onSubmit}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '16px', 
            fontWeight: '600', 
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px' 
          }}
        >
          {loading ? "Menganalisis..." : "Simpan Perubahan"}
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>

    </div>
  );
}