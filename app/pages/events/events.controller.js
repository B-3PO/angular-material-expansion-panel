angular
  .module('angularMaterialExpansionPanel')
  .controller('EventsController', EventsController);


function EventsController($scope, $mdExpansionPanel) {
  $mdExpansionPanel().waitFor('expansionPanelOne').then(function (instance) {
    instance.expand();
  });

  $scope.$on("mdExpansionPanelExpanding", function($event, componentId) {
    alert("expansion panel " + componentId + " expanding");
  });
  $scope.$on("mdExpansionPanelExpanded", function($event, componentId) {
    alert("expansion panel " + componentId + " expanded");
  });
  $scope.$on("mdExpansionPanelCollapsing", function($event, componentId) {
    alert("expansion panel " + componentId + " collapsing");
  });
  $scope.$on("mdExpansionPanelCollapsed", function($event, componentId) {
    alert("expansion panel " + componentId + " collapsed");
  });


  $scope.collapseOne = function () {
    $mdExpansionPanel('expansionPanelOne').collapse();
  };

  $scope.isDisabled = true;
}
