angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelFooter', expansionPanelFooterDirective);




/**
 * @ngdoc directive
 * @name mdExpansionPanelFooter
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelFooter` is nested inside of `mdExpansionPanelExpanded` and contains content you want at the bottom.
 * By default the Footer will stick to the bottom of the page if the panel expands past
 * this is optional
 *
 * @param {boolean=} md-no-sticky - add this aatribute to disable sticky
 **/
function expansionPanelFooterDirective() {
  var directive = {
    restrict: 'E',
    transclude: true,
    template: '<div class="md-expansion-panel-footer-container" ng-transclude></div>',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;



  function link(scope, element, attrs, expansionPanelCtrl) {
    var isStuck = false;
    var noSticky = attrs.mdNoSticky !== undefined;
    var container = angular.element(element[0].querySelector('.md-expansion-panel-footer-container'));

    expansionPanelCtrl.registerFooter({
      show: show,
      hide: hide,
      onScroll: onScroll,
      onResize: onResize,
      noSticky: noSticky
    });



    function show() {

    }
    function hide() {
      unstick();
    }

    function onScroll(top, bottom) {
      var height;
      var footerBounds = element[0].getBoundingClientRect();
      var panelTop = element[0].parentNode.getBoundingClientRect().top;
      var offset = panelTop - bottom;

      if (footerBounds.bottom > bottom) {
        height = container[0].offsetHeight;

        // offset will push the fotter down when it hit the top of the card
        offset = Math.max(offset + height, 0);

        // set container width because element becomes postion fixed
        container.css('width', expansionPanelCtrl.$element[0].offsetWidth + 'px');

        // set element height so it does not loose its height when container is position fixed
        element.css('height', height + 'px');
        container.css('top', (bottom - height + offset) + 'px');

        element.addClass('md-stick');
        isStuck = true;
      } else if (isStuck === true) {
        unstick();
      }
    }

    function onResize(width) {
      if (isStuck === false) { return; }
      container.css('width', width + 'px');
    }


    function unstick() {
      isStuck = false;
      container.css('width', '');
      container.css('top', '');
      element.css('height', '');
      element.removeClass('md-stick');
    }
  }
}
