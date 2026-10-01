// SOURCE: the query string of the URL
const name = new URLSearchParams(location.search).get("name");

if (name) {
  // SINK: innerHTML parses the string as HTML
  document.getElementById("greeting").innerHTML = "Hello, " + name;
}
