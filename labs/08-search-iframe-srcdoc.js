// SOURCE: the query string of the URL
const title = new URLSearchParams(location.search).get("title");

if (title) {
  // SINK: srcdoc is parsed as a full HTML document, scripts included
  document.getElementById("preview").srcdoc = "<h1>" + title + "</h1>";
}
