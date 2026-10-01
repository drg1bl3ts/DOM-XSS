// SOURCE: document.cookie, split apart to find the one we care about
const cookies = Object.fromEntries(
  document.cookie.split("; ").filter(Boolean).map((pair) => pair.split("="))
);
const lastViewedItem = cookies.lastViewedItem;

if (lastViewedItem) {
  // SINK: innerHTML parses the string as HTML
  document.getElementById("banner").innerHTML =
    "Welcome back, we see you last viewed: " + decodeURIComponent(lastViewedItem);
}

// Not part of the bug: a button that plays the attacker's part
document.getElementById("set-cookie").onclick = function () {
  const value = document.getElementById("attacker-input").value;
  document.cookie = "lastViewedItem=" + encodeURIComponent(value) + "; path=/";
  location.reload();
};
