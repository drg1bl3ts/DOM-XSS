// SOURCE: event.data comes from whichever window sent the message
window.addEventListener("message", function (event) {
  // BUG: event.origin is never checked
  // SINK: innerHTML parses the string as HTML
  document.getElementById("board").innerHTML = event.data;
});

// Not part of the bug: a button that plays the other window's part
document.getElementById("send").onclick = function () {
  window.postMessage(document.getElementById("message").value, "*");
};
