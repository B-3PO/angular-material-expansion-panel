angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelGroup', expansionPanelGroupDirective);

/**
 * @ngdoc directive
 * @name mdExpansionPanelGroup
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelGroup` is a container used to manage multiple expansion panels
 *
 * @param {string=} md-component-id - add an id if you want to acces the panel via the `$mdExpansionPanelGroup` service
 * @param {string=} auto-expand - panels expand when added to `<md-expansion-panel-group>`
 * @param {string=} multiple - allows for more than one panel to be expanded at a time
 **/
function expansionPanelGroupDirective() {
  var directive = {
    restrict: 'E',
    controller: ['$scope', '$attrs', '$element', '$mdComponentRegistry', controller]
  };
  return directive;


  function controller($scope, $attrs, $element, $mdComponentRegistry) {
    /* jshint validthis: true */
    var vm = this;

    var registered = {};
    var panels = {};
    var multipleExpand = $attrs.mdMultiple !== undefined || $attrs.multiple !== undefined;
    var autoExpand = $attrs.mdAutoExpand !== undefined || $attrs.autoExpand !== undefined;


    vm.destroy = $mdComponentRegistry.register({
      $element: $element,
      register: register,
      getRegistered: getRegistered,
      remove: remove,
      removeAll: removeAll
    }, $attrs.mdComponentId);

    vm.addPanel = addPanel;
    vm.expandPanel = expandPanel;
    vm.removePanel = removePanel;


    $scope.$on('$destroy', function () {
      if (typeof vm.destroy === 'function') { vm.destroy(); }
    });


    function addPanel(componentId, panelCtrl) {
      panels[componentId] = panelCtrl;
      if (autoExpand === true) {
        panelCtrl.expand();
        closeOthers(componentId);
      }
    }

    function expandPanel(componentId) {
      closeOthers(componentId);
    }

    function remove(componentId) {
      return panels[componentId].remove();
    }

    function removeAll() {
      Object.keys(panels).forEach(function (panelId) {
        panels[panelId].remove();
      });
    }

    function removePanel(componentId) {
      delete panels[componentId];
    }

    function closeOthers(id) {
      if (multipleExpand === false) {
        Object.keys(panels).forEach(function (panelId) {
          if (panelId !== id) { panels[panelId].collapse(); }
        });
      }
    }


    function register(name, options) {
      if (registered[name] !== undefined) {
        throw Error('$mdExpansionPanelGroup.register() The name "' + name + '" has already been registered');
      }
      registered[name] = options;
    }


    function getRegistered(name) {
      if (registered[name] === undefined) {
        throw Error('$mdExpansionPanelGroup.addPanel() Cannot find Panel with name of "' + name + '"');
      }
      return registered[name];
    }
  }
}
