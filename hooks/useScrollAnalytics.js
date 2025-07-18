import { useEffect } from "react";

export default function useScrollAnalytics(postId) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollDepth = Math.floor(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollDepth > 25) {
        // Example: send to analytics provider
        console.log(`[📊] Scroll depth ${scrollDepth}% for post ${postId}`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [postId]);
}
