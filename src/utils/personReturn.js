// Only accept local person routes as a return destination.
export function getPersonReturnState(state) {
  const path = state?.fromPerson;
  return typeof path === "string" && /^\/people\/[1-9]\d*(?:[?#][^\s\\]*)?$/.test(path)
    ? { fromPerson: path }
    : undefined;
}