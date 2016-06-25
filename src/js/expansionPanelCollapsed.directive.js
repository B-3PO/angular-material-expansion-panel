angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelCollapsed', expansionPanelCollapsedDirective);


expansionPanelCollapsedDirective.$inject = ['$animateCss'];
function expansionPanelCollapsedDirective($animateCss) {
  var directive = {
    restrict: 'E',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;


  function link(scope, element, attrs, expansionPanelCtrl) {
    expansionPanelCtrl.registerCollapsed({
      show: show,
      hide: hide
    });


    element.on('click', function () {
      expansionPanelCtrl.expand();
    });


    function hide() {
      // set width to maintian demensions when element is set to postion: absolute
      element.css('width', element[0].offsetWidth + 'px');

      // set min height so the expansion panel does not shrink when collapsed element is set to position: absolute
      expansionPanelCtrl.$element.css('min-height', element[0].offsetHeight + 'px');

      $animateCss(element, {
        addClass: 'md-absolute md-hide',
        from: {opacity: 1},
        to: {opacity: 0}
      })
      .start()
      .then(function () {
        element.removeClass('md-hide');
      });
    }


    function show() {
      // set width to maintian demensions when element is set to postion: absolute
      element.css('width', element[0].parentNode.offsetWidth + 'px');

      $animateCss(element, {
        addClass: 'md-show',
        from: {opacity: 0},
        to: {opacity: 1}
      })
      .start()
      .then(function () {
        element.removeClass('md-absolute md-show');

        // remove width when element is no longer position: absolute
        element.css('width', '');

        // remove min height when element is no longer position: absolute
        expansionPanelCtrl.$element.css('min-height', '');
      });
    }
  }
}
