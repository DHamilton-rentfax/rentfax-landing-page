// utils/stripHtml.js

export default function stripHtml(html) {
  if (!html) return "";

  // ✅ SSR-safe: fallback using regex if no DOM available
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // ✅ Browser-safe: use DOM for more accurate stripping
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
