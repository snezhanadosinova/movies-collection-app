import { useEffect, useRef } from "react";

function InfiniteScrollTrigger({ onIntersect }) {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: 1,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);

  return <div ref={ref} className="h-10" />;
}

export default InfiniteScrollTrigger;
