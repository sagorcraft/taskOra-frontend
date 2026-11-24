export const DEMO_OTP = "123456";

export const KEYS = {
  users: "taskora_users",
  session: "taskora_session",
  pending: "taskora_pending",
  reset: "taskora_reset_email",
  theme: "taskora_theme"
};

export function read(store, key, fallback = null) {
  try {
    const raw = store.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(store, key) {
  try { store.removeItem(key); } catch { /* storage unavailable */ }
}

// Moves data saved under the old "taskflow_*" keys to the current "taskora_*" keys.
export function migrateLegacyStorage() {
  const legacy = {
    taskflow_demo_users: KEYS.users,
    taskflow_demo_session: KEYS.session,
    taskflow_theme: KEYS.theme
  };
  try {
    Object.entries(legacy).forEach(([oldKey, newKey]) => {
      const value = localStorage.getItem(oldKey);
      if (value !== null && localStorage.getItem(newKey) === null) localStorage.setItem(newKey, value);
      localStorage.removeItem(oldKey);
    });
    ["taskflow_pending_user", "taskflow_reset_email"].forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem("taskflow_demo_session_temporary");
  } catch { /* storage unavailable */ }
}
