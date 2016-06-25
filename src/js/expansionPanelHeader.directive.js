angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelHeader', expansionPanelHeaderDirective);


expansionPanelHeaderDirective.$inject = [];
function expansionPanelHeaderDirective() {
  var directive = {
    restrict: 'E',
    transclude: true,
    template: '<div class="md-expansion-panel-header-container" ng-transclude></div>',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;



  function link(scope, element, attrs, expansionPanelCtrl) {
    var isStuck = false;
    var noSticky = attrs.mdNoSticky !== undefined;
    var container = angular.element(element[0].querySelector('.md-expansion-panel-header-container'));

    expansionPanelCtrl.registerHeader({
      show: show,
      hide: hide,
      noSticky: noSticky,
      onScroll: onScroll,
      onResize: onResize
    });


    function show() {

    }
    function hide() {
      unstick();
    }


    function onScroll(top) {
      var bounds = element[0].getBoundingClientRect();

      if (bounds.top < top) {
        // set container width because element becomes postion fixed
        container.css('width', element[0].offsetWidth + 'px');
        container.css('top', top + 'px');

        // set element height so it does not shink when container is position fixed
        element.css('height', container[0].offsetHeight + 'px');

        element.removeClass('md-no-stick');
        element.addClass('md-stick');
        isStuck = true;
      } else if (isStuck === true) {
        unstick();
      }
    }

    function onResize(width) {
      if (isStuck === false) { return; }
      element.css('width', width + 'px');
    }


    function unstick() {
      isStuck = false;
      container.css('width', '');
      element.css('height', '');
      element.css('top', '');
      element.removeClass('md-stick');
      element.addClass('md-no-stick');
    }
  }
}
