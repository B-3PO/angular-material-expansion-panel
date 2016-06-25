angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelExpanded', expansionPanelExpandedDirective);


expansionPanelExpandedDirective.$inject = ['$animateCss'];
function expansionPanelExpandedDirective($animateCss) {
  var directive = {
    restrict: 'E',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;


  function link(scope, element, attrs, expansionPanelCtrl) {
    var setHeight = attrs.height || undefined;
    if (setHeight !== undefined) { setHeight = setHeight.replace('px', '') + 'px'; }

    expansionPanelCtrl.registerExpanded({
      show: show,
      hide: hide,
      setHeight: setHeight !== undefined,
      $element: element
    });




    function hide() {
      var height = setHeight ? setHeight : element[0].scrollHeight + 'px';
      element.addClass('md-hide');
      element.removeClass('md-show md-scroll-y');

      $animateCss(element, {
        from: {'max-height': height, opacity: 1},
        to: {'max-height': '48px', opacity: 0}
      })
      .start()
      .then(function () {
        element.removeClass('md-hide');
      });
    }


    function show() {
      element.addClass('md-show md-overflow');

      // use passed in height or the contents height
      var height = setHeight ? setHeight : element[0].scrollHeight + 'px';

      $animateCss(element, {
        from: {'max-height': '48px', opacity: 0},
        to: {'max-height': height, opacity: 1}
      })
      .start()
      .then(function () {

        // if height was passed in then set div to scroll
        if (setHeight !== undefined) {
          element.addClass('md-scroll-y');
        } else {
          element.css('max-height', 'none');
        }

        element.removeClass('md-overflow');
      });
    }
  }
}
