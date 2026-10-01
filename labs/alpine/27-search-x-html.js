// Defined before Alpine starts (this script runs immediately; Alpine is deferred).
function bioData() {
  return {
    // SOURCE: the query string of the URL
    // SINK: x-html in the template above sets innerHTML to this value
    bio: new URLSearchParams(location.search).get("bio") ?? "",
  };
}
