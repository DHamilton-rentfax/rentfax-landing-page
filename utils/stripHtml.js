// utils/stripHtml.js

/**
 * Removes HTML tags from a string and returns plain text.
 * Handles both browser and server-side environments safely.
 */
export default function stripHtml(html) {
  if (!html) return "";

  // ✅ SSR-safe fallback using regex
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, "") // strip tags
               .replace(/\s+/g, " ")     // condense spaces
               .trim();                  // trim edges
  }

  // ✅ Browser-safe stripping using DOMParser
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}
