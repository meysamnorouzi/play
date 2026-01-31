import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * با هر تغییر مسیر، صفحه به بالا اسکرول می‌شود.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
