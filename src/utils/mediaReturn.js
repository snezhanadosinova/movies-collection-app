// Return destinations are restricted to local movie and series details.
export function getMediaReturnPath(state) {
  const path = state?.fromMedia;
  return typeof path === "string" && /^\/(movies|tv)\/[1-9]\d*(?:[?#][^\s\\]*)?$/.test(path)
    ? path
    : undefined;
}