// SOURCE: the query string of the URL
const name = new URLSearchParams(location.search).get("name");

if (name) {
  // Safe against HTML injection, textContent never parses tags...
  document.getElementById("greeting").textContent = "Hello, " + name;
}

// ...but SINK: Angular now compiles the lab box, and runs any {{ }} it finds in it
angular.bootstrap(document.querySelector(".lab"), []);
