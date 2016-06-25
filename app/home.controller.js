angular
  .module('angularMaterialExpansionPanel')
  .controller('HomeController', HomeController);


function HomeController($scope) {
  $scope.collapse = function () {
    console.log($scope);
  };
}
