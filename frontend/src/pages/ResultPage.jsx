import { useEffect, useState } from "react";
import {
  CLASS_CONFIG, NEEDS_DOCTOR_WARNING, BOUNDARY_SENSITIVE,
  CALORIE_MODIFIER_LABEL, MEAL_LABEL
} from "../lib/constants";
import { fetchWeightHistory, saveWeightLog } from "../lib/history";

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
        <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Skor Keyakinan</span>
      </div>
    </div>
  );
}

// 2. COMPONENT: SEBARAN PROBABILITAS (Bilah Bar Kustom)
function ClassProbBars({ probs }) {
  const sorted = Object.entries(probs).sort((a, b) => b[1] - a[1]);
  return (
    <details className="stitch-card result-disclosure" style={{ marginTop: '8px' }}>
      <summary>Distribusi probabilitas model</summary>
      <div className="probability-list">
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
    </details>
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

function WeightHistoryPanel({ profileId, currentWeight, currentHeight }) {
  const [history, setHistory] = useState(null);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const loadHistory = async () => {
    try {
      setHistory(await fetchWeightHistory(profileId));
      setHistoryError(null);
    } catch (error) {
      setHistoryError(error.message);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [profileId]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!weight) return;
    setSaving(true);
    try {
      await saveWeightLog({
        profile_id: profileId,
        weight_kg: Number(weight),
        height_m: currentHeight,
        note: note || null,
        source: "manual",
      });
      setWeight("");
      setNote("");
      await loadHistory();
    } catch (error) {
      setHistoryError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const entries = history?.entries || [];
  const weights = entries.map((entry) => entry.weight_kg);
  const maxWeight = Math.max(...weights, currentWeight || 0);
  const minWeight = Math.min(...weights, currentWeight || 0);
  const range = Math.max(maxWeight - minWeight, 1);

  return (
    <section className="stitch-card history-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Perjalanan</span>
          <h3>History berat badan</h3>
        </div>
        <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>show_chart</span>
      </div>

      <div className="history-stats">
        <div><strong>{history?.latest_weight_kg ?? currentWeight ?? "-"}</strong><span>kg terakhir</span></div>
        <div><strong>{history?.change_kg > 0 ? "+" : ""}{history?.change_kg ?? "-"}</strong><span>perubahan kg</span></div>
        <div><strong>{entries.length}</strong><span>catatan</span></div>
      </div>

      {entries.length > 0 && (
        <div className="weight-chart" aria-label="Grafik perubahan berat badan">
          {entries.slice(-8).map((entry) => (
            <div className="weight-point" key={entry.id} title={`${entry.weight_kg} kg`}>
              <div className="weight-bar" style={{ height: `${32 + ((entry.weight_kg - minWeight) / range) * 68}%` }} />
              <span>{entry.weight_kg}</span>
            </div>
          ))}
        </div>
      )}

      <form className="weight-log-form" onSubmit={handleSave}>
        <label>
          Timbang hari ini
          <input type="number" min="20" max="300" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="kg" required />
        </label>
        <label>
          Catatan <span>(opsional)</span>
          <input type="text" maxLength="240" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contoh: setelah latihan" />
        </label>
        <button className="btn-next history-save" type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan berat"}
        </button>
      </form>
      {historyError && <p className="history-error">{historyError}</p>}
    </section>
  );
}

// MAIN PAGE EXPORT
export default function ResultPage({ result, profileId, currentWeight, currentHeight, onReset }) {
  const { prediction, bmi_analysis, health_status, food_recommendations, workout_recommendations } = result;
  const cfg = CLASS_CONFIG[prediction.obesity_class] || {};
  const needsWarning = NEEDS_DOCTOR_WARNING.includes(prediction.obesity_class);
  const isBoundary   = BOUNDARY_SENSITIVE.includes(prediction.obesity_class);
  const meals = ["breakfast", "lunch", "dinner", "snack"];

  // Mapping Ikon Material Symbols untuk masing-masing porsi makan besar
  const mealIcons = { breakfast: "wb_twilight", lunch: "light_mode", dinner: "bedtime", snack: "cookie" };

  return (
    <div className="result-page">
      
      {/* ── HEADER UTAMA Halaman Hasil ── */}
      <section className="result-header">
        <h2 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--on-surface)' }}>Hasil Analisis Kesehatan</h2>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: 0, lineHeight: '20px' }}>
          Berdasarkan data biometrik terbaru Anda, kami telah menyusun laporan komprehensif ini untuk membantu Anda mencapai target kesehatan optimal.
        </p>
      </section>

      {/* ── 1. KARTU HERO & STATUS (CONFIDENCE) ── */}
      <div className="stitch-card result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
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
      <div className="stitch-card result-calories">
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

      <WeightHistoryPanel
        profileId={profileId}
        currentWeight={currentWeight}
        currentHeight={currentHeight}
      />

      {/* ── 3. KARTU MEAL PLAN OVERVIEW ── */}
      <div className="stitch-card result-meals">
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
        {meals.map((m, index) => {
          const items = food_recommendations.meals[m];
          if (!items?.length) return null;
          return (
            <details key={m} className="meal-disclosure" open={index === 0}>
              <summary>
                <span className="meal-summary-label">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{mealIcons[m]}</span>
                  {MEAL_LABEL[m]}
                </span>
                <span className="meal-summary-count">{items.length} pilihan</span>
              </summary>
              <div className="meal-items">
                {items.map((item, i) => <FoodCard key={i} item={item} />)}
              </div>
            </details>
          );
        })}
      </div>

      {/* ── 4. KARTU WORKOUT PROTOCOL ── */}
      <div className="stitch-card result-workouts">
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

        <details className="result-disclosure workout-disclosure">
          <summary>Lihat {workout_recommendations.exercises.length} rekomendasi latihan</summary>
          <div className="workout-items">
            {workout_recommendations.exercises.map((ex, i) => (
              <WorkoutCard key={i} ex={ex} />
            ))}
          </div>
        </details>
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