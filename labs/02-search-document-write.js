// SOURCE: the query string of the URL
const query = new URLSearchParams(location.search).get("q");

if (query) {
  // SINK: document.write parses the string as HTML, right where this script tag is
  document.write("<p>You searched for: " + query + "</p>");
}
