angular
  .module('angularMaterialExpansionPanel')
  .controller('HomeController', HomeController);


function HomeController($scope, $mdExpansionPanel) {
  $mdExpansionPanel('expansionPanelOne').then(function (instance) {
    instance.expand();
  });


  $scope.collapseOne = function () {
    $mdExpansionPanel('expansionPanelOne').then(function (instance) {
      instance.collapse();
    });
  };
}
