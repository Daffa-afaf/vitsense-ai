import {
  CLASS_CONFIG, NEEDS_DOCTOR_WARNING, BOUNDARY_SENSITIVE,
  CALORIE_MODIFIER_LABEL, MEAL_LABEL
} from "../lib/constants";

// 1. COMPONENT: CONFIDENCE RING (Gaya Lingkaran Progress Ring Stitch)
function ConfidenceRing({ pct }) {
  const r = 15.9155;
  const circ = 2 * Math.PI * r; // ~100
  return (
    <div className="progress-ring-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '16px 0' }}>
      <svg width="140" height="140" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#eceef0" strokeWidth="3.5" />
        <circle
          cx="18" cy="18" r={r} fill="none"
          stroke="var(--primary)" strokeWidth="3.5"
          strokeDasharray={`${pct}, 100`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          style={{ transition: 'stroke-dasharray 0.3s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--on-surface)' }}>{pct}%</span>
        <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Akurasi</span>
      </div>
    </div>
  );
}

// 2. COMPONENT: SEBARAN PROBABILITAS (Bilah Bar Kustom)
function ClassProbBars({ probs }) {
  const sorted = Object.entries(probs).sort((a, b) => b[1] - a[1]);
  return (
    <div className="stitch-card" style={{ marginTop: '8px' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--on-surface-variant)', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>
        Distribusi Probabilitas Model
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sorted.map(([cls, pct]) => {
          const cfg = CLASS_CONFIG[cls] || {};
          return (
            <div key={cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '14px', width: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.label || cls}</span>
              <div style={{ flex: 1, backgroundColor: 'var(--surface-container-low)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, background: cfg.color || "var(--primary)", height: '100%', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', width: '50px', textAlign: 'right' }}>{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. COMPONENT: METRIC ROW (Baris BMR, TDEE, dll.)
function MetricRow({ icon, label, value, unit, highlight }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: highlight ? 'none' : '1px solid var(--surface-variant)',
      marginTop: highlight ? '4px' : '0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: highlight ? 'var(--primary)' : 'var(--on-surface-variant)' }}>{icon}</span>
        <span style={{ color: highlight ? 'var(--primary)' : 'var(--on-surface-variant)', fontWeight: highlight ? '600' : '400', fontSize: '15px' }}>{label}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontWeight: '700', fontSize: highlight ? '20px' : '16px', color: highlight ? 'var(--primary)' : 'var(--on-surface)' }}>
          {value.toLocaleString()}{" "}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)', fontWeight: highlight ? '500' : '400' }}>{unit}</span>
      </div>
    </div>
  );
}

// 4. COMPONENT: FOOD CARD (Menu Makanan)
function FoodCard({ item }) {
  return (
    <div style={{
      border: '1px solid var(--surface-variant)',
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'var(--surface-container-lowest)'
    }}>
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{item.food_name}</h4>
        <div style={{ display: 'flex', gap: '6px', fontSize: '11px', color: 'var(--on-surface-variant)' }}>
          <span style={{ backgroundColor: '#f2f4f6', padding: '2px 6px', borderRadius: '4px' }}>P {item.protein_g?.toFixed(0) ?? "—"}g</span>
          <span style={{ backgroundColor: '#f2f4f6', padding: '2px 6px', borderRadius: '4px' }}>K {item.carbs_g?.toFixed(0) ?? "—"}g</span>
          <span style={{ backgroundColor: '#f2f4f6', padding: '2px 6px', borderRadius: '4px' }}>L {item.fat_g?.toFixed(0) ?? "—"}g</span>
        </div>
      </div>
      <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '15px' }}>{Math.round(item.calories)} kcal</span>
    </div>
  );
}

// 5. COMPONENT: WORKOUT CARD (Menu Olahraga)
function WorkoutCard({ ex }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--surface-container-low)',
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>fitness_center</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{ex.Title}</h4>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--on-surface-variant)' }}>
            {ex.BodyPart || "Full Body"} {ex.Equipment ? `• ${ex.Equipment}` : ""}
          </p>
        </div>
      </div>
      <span style={{ fontSize: '11px', backgroundColor: '#dde1ff', color: '#0037b9', padding: '4px 8px', borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
        {ex.Level}
      </span>
    </div>
  );
}

// MAIN PAGE EXPORT
export default function ResultPage({ result, onReset }) {
  const { prediction, bmi_analysis, health_status, food_recommendations, workout_recommendations } = result;
  const cfg = CLASS_CONFIG[prediction.obesity_class] || {};
  const needsWarning = NEEDS_DOCTOR_WARNING.includes(prediction.obesity_class);
  const isBoundary   = BOUNDARY_SENSITIVE.includes(prediction.obesity_class);
  const meals = ["breakfast", "lunch", "dinner", "snack"];

  // Mapping Ikon Material Symbols untuk masing-masing porsi makan besar
  const mealIcons = { breakfast: "wb_twilight", lunch: "light_mode", dinner: "bedtime", snack: "cookie" };

  return (
    <div style={{ padding: '24px 16px 100px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ── HEADER UTAMA Halaman Hasil ── */}
      <section style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--on-surface)' }}>Hasil Analisis Kesehatan</h2>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: 0, lineHeight: '20px' }}>
          Berdasarkan data biometrik terbaru Anda, kami telah menyusun laporan komprehensif ini untuk membantu Anda mencapai target kesehatan optimal.
        </p>
      </section>

      {/* ── 1. KARTU HERO & STATUS (CONFIDENCE) ── */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <ConfidenceRing pct={Math.round(prediction.confidence_pct)} />

        <div className="status-badge warning">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '6px' }}>warning</span>
          Perhatian Diperlukan
        </div>

        <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', color: cfg.color || 'var(--on-surface)' }}>{cfg.label}</h3>
        
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: 0, lineHeight: '20px' }}>
          Indeks Massa Tubuh (BMI) Anda saat ini berada di angka <strong>{bmi_analysis.bmi}</strong> ({bmi_analysis.bmi_category}). Ini menunjukkan perlunya penyesuaian gaya hidup untuk mengontrol berat badan.
        </p>

        {isBoundary && (
          <div style={{ marginTop: '14px', padding: '10px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>info</span>
            <span>BMI Anda berada di batas antarkelas.</span>
          </div>
        )}
      </div>

      {/* ── 2. KARTU ANALISIS CALORIE METRICS ── */}
      <div className="stitch-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Target Kalori</h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>monitoring</span>
        </div>
        
        <MetricRow icon="scale" label="BMI" value={bmi_analysis.bmi} unit={bmi_analysis.bmi_category} />
        <MetricRow icon="mode_fan" label="BMR" value={Math.round(bmi_analysis.bmr)} unit="kcal/hari" />
        <MetricRow icon="bolt" label="TDEE" value={health_status.daily_calorie_target} unit="kcal/hari" />
        <MetricRow icon="track_changes" label="Target Harian" value={health_status.adjusted_daily_calories} unit="kcal/hari" highlight />

        <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: '12px 0 0 0', fontStyle: 'italic', lineHeight: '16px' }}>
          * {CALORIE_MODIFIER_LABEL[prediction.obesity_class]}
        </p>
      </div>

      {/* ── 3. KARTU MEAL PLAN OVERVIEW ── */}
      <div className="stitch-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Meal Plan Overview</h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>restaurant</span>
        </div>

        {/* 4 Kotak Porsi Persentase Atas */}
        <div className="meal-grid">
          {meals.map((m) => (
            <div key={m} className="meal-chip">
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)', textTransform: 'capitalize' }}>{MEAL_LABEL[m]}</div>
              <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '15px', marginTop: '2px' }}>
                {health_status.meal_targets[m]} <span style={{ fontSize: '10px', fontWeight: '400' }}>kcal</span>
              </div>
            </div>
          ))}
        </div>

        <span style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--on-surface-variant)', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
          Rekomendasi Menu Detail
        </span>

        {/* Loop Detail Menu Makanan */}
        {meals.map((m) => {
          const items = food_recommendations.meals[m];
          if (!items?.length) return null;
          return (
            <div key={m} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{mealIcons[m]}</span>
                <span>{MEAL_LABEL[m]}</span>
              </div>
              {items.map((item, i) => <FoodCard key={i} item={item} />)}
            </div>
          );
        })}
      </div>

      {/* ── 4. KARTU WORKOUT PROTOCOL ── */}
      <div className="stitch-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Workout Protocol</h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>sports_score</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', backgroundColor: '#f2f4f6', color: 'var(--on-surface-variant)', padding: '4px 8px', borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
            {workout_recommendations.level}
          </span>
          {workout_recommendations.preferred_type.map((t) => (
            <span key={t} style={{ fontSize: '11px', backgroundColor: '#dde1ff', color: '#0037b9', padding: '4px 8px', borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase' }}>{t}</span>
          ))}
        </div>

        {needsWarning && (
          <div style={{ padding: '10px', backgroundColor: '#ffebe5', color: '#ba1a1a', borderRadius: '8px', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>emergency_home</span>
            <span>Konsultasikan dengan dokter sebelum berolahraga.</span>
          </div>
        )}

        <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: '20px', margin: '0 0 16px 0' }}>
          {workout_recommendations.note}
        </p>

        {/* Loop Daftar Olahraga */}
        {workout_recommendations.exercises.map((ex, i) => (
          <WorkoutCard key={i} ex={ex} />
        ))}
      </div>

      {/* ── 5. SEBARAN PROBABILITAS SEMUA KELAS ── */}
      <ClassProbBars probs={prediction.class_probabilities} />

      {/* ── 6. DISCLAIMER BOX ── */}
      <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', lineHeight: '16px', textAlign: 'center', margin: '8px 0' }}>
        Aplikasi ini menyediakan perkiraan berdasarkan model kecerdasan buatan (AI). Ini bukan merupakan nasihat medis profesional, diagnosis, atau pengobatan resmi dari dokter.
      </p>

      {/* ── BUTTON HITUNG ULANG ── */}
      <button 
        type="button" 
        onClick={onReset}
        className="btn-next" 
        style={{ width: '100%', padding: '16px', fontWeight: '600' }}
      >
        Analisis Ulang Profil Kesehatanku
      </button>

    </div>
  );
}