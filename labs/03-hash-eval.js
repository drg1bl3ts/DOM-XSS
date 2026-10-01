// SOURCE: everything after the # in the URL
const expression = decodeURIComponent(location.hash.slice(1));

if (expression) {
  // SINK: eval runs the string as JavaScript
  document.getElementById("result").textContent = eval(expression);
}
