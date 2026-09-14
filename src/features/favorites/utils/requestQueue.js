export function createRequestQueue(limit = 5) {
  let active = 0;
  const pending = [];
  function drain() {
    while (active < limit && pending.length) {
      const job = pending.shift();
      job.signal?.removeEventListener("abort", job.cancel);
      if (job.signal?.aborted) {
        job.reject(job.signal.reason ?? new DOMException("Aborted", "AbortError"));
        continue;
      }
      active += 1;
      Promise.resolve().then(job.run).then(job.resolve, job.reject).finally(() => {
        active -= 1;
        drain();
      });
    }
  }
  return (run, signal) => new Promise((resolve, reject) => {
    const job = { run, signal, resolve, reject };
    job.cancel = () => {
      const index = pending.indexOf(job);
      if (index !== -1) pending.splice(index, 1);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    };
    if (signal?.aborted) { job.cancel(); return; }
    signal?.addEventListener("abort", job.cancel, { once: true });
    pending.push(job);
    drain();
  });
}

export const queueFavoriteRequest = createRequestQueue(5);
