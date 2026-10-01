// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

// SINK: <%= %> is Lodash's "interpolate" delimiter, inserted with no encoding at all
const compiled = _.template("<p><%= bio %></p>");
document.getElementById("output").innerHTML = compiled({ bio });
