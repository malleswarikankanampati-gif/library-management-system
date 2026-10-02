import { useLayoutEffect } from "react";

export function hasMemberInPath() {
  return window.location.pathname.includes("member");
}

export function useLockBodyScroll(lock = true) {
  useLayoutEffect(() => {
    if (!lock) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
