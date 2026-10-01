function showMessage(text) {
  document.getElementById("out").textContent = text;
}

// SOURCE: the query string of the URL
const msg = new URLSearchParams(location.search).get("msg");

if (msg) {
  // SINK: a string passed to setTimeout is run as code
  setTimeout("showMessage('" + msg + "')", 1000);
}
