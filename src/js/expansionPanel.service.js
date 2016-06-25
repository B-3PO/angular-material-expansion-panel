angular
  .module('material.components.expansionPanels')
  .factory('$mdExpansionPanel', expansionPanelService);


/**
 * @ngdoc service
 * @name $mdExpansionPanel
 * @module material.components.expansionPanels
 *
 * @description
 * Expand and collapse Expansion Panel using its `md-component-id`
 *
 * @example
 * $mdExpansionPanel('comonentId').then(function (instance) {
 *  instance.exapand();
 *  instance.collapse();
 * });
 */
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
