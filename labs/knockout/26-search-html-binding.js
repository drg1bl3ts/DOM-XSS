function ViewModel() {
  // SOURCE: the query string of the URL
  // SINK: the "html" binding in the template above sets innerHTML to this value
  this.bio = new URLSearchParams(location.search).get("bio") ?? "";
}

ko.applyBindings(new ViewModel());
