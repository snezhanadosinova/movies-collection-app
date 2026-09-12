export function getScrollKey(location) {
  const key = location.state?.restoreScrollKey;
  return typeof key === "string" && key.length > 0 ? key : location.key;
}

export function getCatalogReturn(state, pathname) {
  const path = state?.fromCatalog;
  return typeof path === "string" &&
    (path === pathname || path.startsWith(`${pathname}?`) || path.startsWith(`${pathname}#`))
    ? path : pathname;
}
