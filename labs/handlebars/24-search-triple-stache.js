// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

// SINK: {{{ }}} is Handlebars' "do not escape this" placeholder
const template = Handlebars.compile("<p>{{{ bio }}}</p>");
document.getElementById("output").innerHTML = template({ bio });
