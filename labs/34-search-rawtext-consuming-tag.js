// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

// A naive filter: reject the input only if the FIRST tag in the string is on
// a denylist. It never actually parses the HTML, just pattern-matches the text.
function naiveFilter(input) {
  const firstTagBlocked = /^\s*<\s*(script|img|svg|iframe)\b/i.test(input);
  return firstTagBlocked ? "" : input;
}

if (bio) {
  const filtered = naiveFilter(bio);
  document.getElementById("filtered-view").textContent = filtered
    ? "Filter allowed it through."
    : "Filter blocked it.";

  // SINK: innerHTML. The filter above already ran; this just inserts whatever
  // survived it. See the notes for why that's not the same as actually being safe.
  document.getElementById("profile").innerHTML = filtered;
}
