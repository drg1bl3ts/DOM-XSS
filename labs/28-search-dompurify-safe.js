// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

// SAFE: DOMPurify parses the string and strips anything dangerous before
// it reaches innerHTML. This is still the same sink as lab 01 — the
// difference is what the string looks like by the time it gets there.
document.getElementById("profile").innerHTML = DOMPurify.sanitize(bio);
