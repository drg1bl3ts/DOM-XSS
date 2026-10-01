// SOURCE: document.referrer, the URL of the page that linked here.
// The browser percent-encodes this string, but parsing it as a URL and
// reading a query param out of it (URLSearchParams.get) decodes that param.
let q = null;
if (document.referrer) {
  try {
    q = new URL(document.referrer).searchParams.get("q");
  } catch {
    // document.referrer wasn't a valid URL (e.g. empty); leave q as null
  }
}

if (q) {
  // SINK: innerHTML parses the string as HTML
  document.getElementById("banner").innerHTML = "You came from a search for: " + q;
}
