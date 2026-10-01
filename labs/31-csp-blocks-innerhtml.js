// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

// SINK: innerHTML, no sanitizing at all — exactly like lab 01.
// What's different here is the page's CSP (see the <meta> tag), which blocks
// the inline onerror handler this payload relies on. Nothing about this line
// changed; the mitigation lives entirely in the HTTP response / meta tag.
if (bio) {
  document.getElementById("profile").innerHTML = bio;
}
