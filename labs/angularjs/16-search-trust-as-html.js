angular.module("lab", []).controller("Main", function ($scope, $sce) {
  // SOURCE: the query string of the URL
  const bio = new URLSearchParams(location.search).get("bio") || "";

  // SINK: trustAsHtml turns off Angular's protection for this value
  $scope.bio = $sce.trustAsHtml(bio);
});
