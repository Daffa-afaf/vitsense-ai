export const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`;
const PROFILE_KEY = "health-advisor-profile-id";

export function getProfileId() {
  let profileId = window.localStorage.getItem(PROFILE_KEY);
  if (!profileId) {
    profileId = `profile-${crypto.randomUUID()}`;
    window.localStorage.setItem(PROFILE_KEY, profileId);
  }
  return profileId;
}

export async function fetchWeightHistory(profileId) {
  const response = await fetch(
    `${API_BASE}/history/weights?profile_id=${encodeURIComponent(profileId)}`
  );
  if (!response.ok) throw new Error("Riwayat berat belum dapat dimuat");
  return response.json();
}

export async function saveWeightLog(payload) {
  const response = await fetch(`${API_BASE}/history/weights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Catatan berat belum dapat disimpan");
  return response.json();
}
