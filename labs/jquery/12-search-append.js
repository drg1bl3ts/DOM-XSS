// SOURCE: the query string of the URL
const comment = new URLSearchParams(location.search).get("comment");

if (comment) {
  // SINK: a string given to .append() is parsed as HTML
  $("#comments").append("<li>" + comment + "</li>");
}
