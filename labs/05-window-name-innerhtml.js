// SOURCE: window.name, which another page can set before sending the user here
if (window.name) {
  // SINK: innerHTML parses the string as HTML
  document.getElementById("banner").innerHTML = "Welcome, " + window.name;
}

// Not part of the bug: a button that plays the attacker's part
document.getElementById("attack").onclick = function () {
  window.name = document.getElementById("attacker-input").value;
  location.reload();
};
