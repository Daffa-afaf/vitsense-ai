import { useState } from "react";
import StepPhysical from "./components/StepPhysical";
import StepEating from "./components/StepEating";
import StepLifestyle from "./components/StepLifeStyle";
import ResultPage from "./pages/ResultPage";
import BottomNav from "./components/BottomNav";

const STEPS = ["physical", "eating", "lifestyle", "result"];

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    // ── Profil Fisik ───────────────────────────────
    Gender: "Male",
    Age: "",
    Height: "",
    Weight: "",
    // ── Kebiasaan Makan ────────────────────────────
    NCP: 3,
    FCVC: 2,
    CH2O: 2,
    CAEC: "Sometimes",
    FAVC: false,
    family_history_with_overweight: false,
    // ── Gaya Hidup ─────────────────────────────────
    FAF: 1,
    TUE: 1,
    CALC: "no",
    SMOKE: false,
    SCC: false,
    MTRANS: "Public_Transportation",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateForm = (fields) => setForm((f) => ({ ...f, ...fields }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Tentukan kategori angka (0, 1, 2) berdasarkan jam asli dari slider frontend
      // 0-4 jam = 0 (Sedikit)
      // 5-8 jam = 1 (Sedang)
      // 9-12+ jam = 2 (Banyak)
      const mappedTUE = form.TUE <= 4 ? 0 : form.TUE <= 8 ? 1 : 2;

      const payload = {
        Gender: form.Gender,
        Age: parseFloat(form.Age),
        Height: parseFloat(form.Height),
        Weight: parseFloat(form.Weight),
        family_history_with_overweight: form.family_history_with_overweight ? "yes" : "no",
        FAVC: form.FAVC ? "yes" : "no",
        FCVC: form.FCVC,
        NCP: form.NCP,
        CAEC: form.CAEC,
        SMOKE: form.SMOKE ? "yes" : "no",
        CH2O: form.CH2O,
        SCC: form.SCC ? "yes" : "no",
        FAF: form.FAF,
        TUE: mappedTUE, // 👈 UBAH DI SINI: Mengirimkan nilai kategori yang aman untuk StandardScaler
        CALC: form.CALC,
        MTRANS: form.MTRANS,
        n_food_per_meal: 3,
        n_workout: 6,
      };
      const res = await fetch("http://localhost:8000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Gagal menghubungi server");
      }
      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (i) => {
    if (i < step || i === 3) return;
    setStep(i);
  };

  return (
    <div className="app-shell">
      {step === 0 && (
        <StepPhysical
          form={form}
          update={updateForm}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <StepEating
          form={form}
          update={updateForm}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepLifestyle
          form={form}
          update={updateForm}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 3 && result && (
        <ResultPage
          result={result}
          onReset={() => { setStep(0); setResult(null); }}
        />
      )}
      <BottomNav current={step} onGo={goTo} />
    </div>
  );
}