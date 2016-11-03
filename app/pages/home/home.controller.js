angular
  .module('angularMaterialExpansionPanel')
  .controller('HomeController', HomeController);


function HomeController($scope, $mdExpansionPanel) {
  $mdExpansionPanel().waitFor('expansionPanelOne').then(function (instance) {
    instance.expand();
  });

  $scope.arePanelsDisabled = false;

  $scope.collapseOne = function () {
    $mdExpansionPanel('expansionPanelOne').collapse();
  };

  $scope.toggleDisablePanels = function () {
    $scope.arePanelsDisabled = !$scope.arePanelsDisabled; // test
  };
}
