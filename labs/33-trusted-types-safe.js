// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

if (bio) {
  const profile = document.getElementById("profile");
  const status = document.getElementById("status");
  try {
    // SINK, same as lab 01 — but this page's CSP requires a TrustedHTML here,
    // not a plain string, so this line never reaches the HTML parser at all.
    profile.innerHTML = bio;
    status.textContent = "innerHTML assignment succeeded (Trusted Types is not active)";
  } catch (e) {
    status.textContent = "Blocked before it ran: " + e.message;
  }
}
