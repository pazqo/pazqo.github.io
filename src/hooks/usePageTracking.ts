import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const path = location.pathname + location.search; // e.g. "/ouroboros"
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + "/#" + path, // full URL incl. hash
      page_title: document.title,
    });
  }, [location]);
}

export default usePageTracking;
