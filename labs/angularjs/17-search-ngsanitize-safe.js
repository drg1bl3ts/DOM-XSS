angular.module("lab", ["ngSanitize"]).controller("Main", function ($scope) {
  // SOURCE: the query string of the URL
  // SAFE: ng-bind-html runs this string through ngSanitize before inserting it
  $scope.bio = new URLSearchParams(location.search).get("bio") || "";
});
