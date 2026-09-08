export const DISPLAY_NAME_MAX_LENGTH = 80;

export function normalizeDisplayName(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateDisplayName(value) {
  const name = normalizeDisplayName(value);

  if (name.length < 2) {
    return "Display name must be at least 2 characters.";
  }

  if (name.length > DISPLAY_NAME_MAX_LENGTH) {
    return `Display name must be at most ${DISPLAY_NAME_MAX_LENGTH} characters.`;
  }

  return true;
}
