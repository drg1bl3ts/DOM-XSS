// SOURCE: the query string of the URL
const name = new URLSearchParams(location.search).get("name");

if (name) {
  // SINK: .html() parses the string as HTML (and runs any script tags)
  $("#greeting").html("Hello, " + name);
}
