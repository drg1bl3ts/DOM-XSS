// SOURCE: the query string of the URL
const destination = new URLSearchParams(location.search).get("goto");

document.getElementById("continue").onclick = function () {
  if (destination) {
    // SINK: a javascript: URL assigned here runs as code
    location.href = destination;
  }
};
