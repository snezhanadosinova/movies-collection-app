const STORAGE_KEY = "movies:avatar";

export function readCachedAvatar() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveCachedAvatar(initials) {
  try {
    if (initials) {
      localStorage.setItem(STORAGE_KEY, initials);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Приложението работи и при недостъпно localStorage.
  }
}