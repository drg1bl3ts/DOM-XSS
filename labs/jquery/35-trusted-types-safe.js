// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

if (bio) {
  try {
    // SINK, same as lab 11 — but this page's CSP requires a TrustedHTML here,
    // and jQuery 4.0's .html() respects that the same way plain innerHTML does.
    $("#profile").html(bio);
    $("#status").text(".html() succeeded (Trusted Types is not active)");
  } catch (e) {
    $("#status").text("Blocked before it ran: " + e.message);
  }
}
