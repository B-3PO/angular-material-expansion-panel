angular
  .module('material.components.expansionPanels')
  .factory('$mdExpansionPanel', expansionPanelService);


expansionPanelService.$inject = ['$mdComponentRegistry'];
function expansionPanelService($mdComponentRegistry) {
  return function (handle) {
    return $mdComponentRegistry
        .when(handle)
        .then(function (instance) {
          return instance;
        });
  };
}
