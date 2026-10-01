// SOURCE: everything after the # in the URL, for example "#intro"
const target = decodeURIComponent(location.hash);

if (target) {
  // SINK: old jQuery treats any string containing <...> as HTML to create
  const section = $(target);
  $("#status").text("Found " + section.length + " element(s) for " + target);
}
