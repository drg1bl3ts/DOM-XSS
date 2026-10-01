// SOURCE: the query string of the URL
const returnUrl = new URLSearchParams(location.search).get("returnUrl");

if (returnUrl) {
  // SINK: a javascript: URL in href runs when the link is clicked
  document.getElementById("back").href = returnUrl;
}
