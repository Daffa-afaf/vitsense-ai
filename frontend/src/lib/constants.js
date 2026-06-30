// lib/constants.js
// Semua nilai ini HARUS match persis dengan nilai yang diterima backend FastAPI
// Sumber: app/schemas/request.py (Pydantic enums)

export const GENDER_OPTIONS = [
  { value: "Male",   label: "Laki-laki" },
  { value: "Female", label: "Perempuan" },
];

// CAEC & CALC: 4 nilai exact dari dataset
export const FREQUENCY_OPTIONS = [
  { value: "no",         label: "Tidak pernah" },
  { value: "Sometimes",  label: "Kadang-kadang" },
  { value: "Frequently", label: "Sering" },
  { value: "Always",     label: "Hampir selalu" },
];

// MTRANS: 5 nilai exact dari dataset
export const MTRANS_OPTIONS = [
  { value: "Walking",               label: "Jalan kaki" },
  { value: "Bike",                  label: "Sepeda" },
  { value: "Motorbike",             label: "Motor" },
  { value: "Public_Transportation", label: "Transportasi umum" },
  { value: "Automobile",            label: "Mobil" },
];

// FAF: 0–3 diskrit (bukan kontinu)
export const FAF_LABELS = [
  "Tidak pernah",
  "1–2× seminggu",
  "3–4× seminggu",
  "Hampir setiap hari",
];

// FCVC: 1–3 diskrit
export const FCVC_LABELS = [
  "", // index 0 tidak dipakai (nilai mulai dari 1)
  "Jarang",
  "Kadang-kadang",
  "Selalu",
];

// CH2O: 1–3 diskrit
export const CH2O_LABELS = [
  "",        // index 0 tidak dipakai
  "< 1 liter",
  "1–2 liter",
  "> 2 liter",
];

// TUE: 0–2 diskrit
export const TUE_LABELS = [
  "0–2 jam",
  "3–5 jam",
  "> 5 jam",
];

// NCP: 1–4
export const NCP_LABELS = [
  "", // index 0 tidak dipakai
  "1 kali",
  "2 kali",
  "3 kali",
  "4 kali atau lebih",
];

// ── Color coding 7 kelas — konsisten di seluruh UI ────────────────
export const CLASS_CONFIG = {
  Insufficient_Weight:  { label: "Berat Badan Kurang",   color: "#185FA5", bg: "#E6F1FB", severity: 1 },
  Normal_Weight:        { label: "Berat Badan Normal",   color: "#0F6E56", bg: "#E1F5EE", severity: 0 },
  Overweight_Level_I:   { label: "Kelebihan Berat I",    color: "#BA7517", bg: "#FAEEDA", severity: 2 },
  Overweight_Level_II:  { label: "Kelebihan Berat II",   color: "#854F0B", bg: "#FAC775", severity: 3 },
  Obesity_Type_I:       { label: "Obesitas Tipe I",      color: "#A32D2D", bg: "#FCEBEB", severity: 4 },
  Obesity_Type_II:      { label: "Obesitas Tipe II",     color: "#791F1F", bg: "#F7C1C1", severity: 5 },
  Obesity_Type_III:     { label: "Obesitas Tipe III",    color: "#501313", bg: "#F09595", severity: 6 },
};

// Kelas yang perlu medical disclaimer di workout section
export const NEEDS_DOCTOR_WARNING = ["Obesity_Type_II", "Obesity_Type_III"];

// Kelas yang boundary-nya tipis (perlu micro-copy)
export const BOUNDARY_SENSITIVE = ["Overweight_Level_I", "Overweight_Level_II"];

// Calorie modifier — sama persis dengan backend/app/core/config.py
export const CALORIE_MODIFIER_LABEL = {
  Insufficient_Weight:  "+15% (surplus untuk penambahan berat)",
  Normal_Weight:        "Maintenance",
  Overweight_Level_I:   "−10% defisit ringan",
  Overweight_Level_II:  "−15% defisit sedang",
  Obesity_Type_I:       "−20% defisit",
  Obesity_Type_II:      "−25% defisit",
  Obesity_Type_III:     "−30% defisit",
};

// Ikon meal per waktu (Tabler icon names)
export const MEAL_ICON = {
  breakfast: "ti-coffee",
  lunch:     "ti-soup",
  dinner:    "ti-moon",
  snack:     "ti-apple",
};

export const MEAL_LABEL = {
  breakfast: "Sarapan",
  lunch:     "Makan Siang",
  dinner:    "Makan Malam",
  snack:     "Camilan",
};