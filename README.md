# angular-material-expansion-panel

A module that implements design elements based on [Material Design](https://material.google.com) [Expansion Panels](https://material.google.com/components/expansion-panels.html). With additional features that are similar to Google Inbox style Expansion Panels.

To see Material Design Expansion Panels Specification go [here](https://material.google.com/components/expansion-panels.html).


This module is **In Progress** currently and should not be used in production. You can expect a tested and documented version in the near future.


<div style="border: 1px solid #ccc">
  <img src="https://cloud.githubusercontent.com/assets/11681147/16354667/4d9afefe-3a61-11e6-91a6-8f5addc40d0c.gif" alt="Angular Material docs website" style="display:block;">
</div>
<br />


Quick Links:
* [Installation](#installaton)
* [Usage](#usage)
* [Building](#building)
* [Documentation](#documentation)




## <a name="building"></a> Building

You can easily build using gulp.

Run the **gulp** tasks:

```bash
# To run locally. This will kick of the watch process
# navigate to `localhost:8080`
gulp

# To build the js and css files to the `/build` directory
gulp build
```



## <a name="installation"></a> Installation

This package will be available on both npm and bower

Include the `material.components.expansionPanels` module as a dependency in your application.

```javascript
angular.module('myApp', ['ngMaterial', 'material.components.expansionPanels']);
```





## <a name="usage"></a> Usage

**Example Template**

```html
<md-expansion-panel>

  <md-expansion-panel-collapsed>
    <div class="md-title">Title</div>
    <div class="md-summary">Summary</div>
  </md-expansion-panel-collapsed>


  <md-expansion-panel-expanded>

    <md-expansion-panel-header>
      <div class="md-title">Expanded Title</div>
      <div class="md-summary">Expanded Summary</div>
    </md-expansion-panel-header>

    <md-expansion-panel-content>
      <h4>Content</h4>
      <p>Put content in here</p>
    </md-expansion-panel-content>

    <md-expansion-panel-footer>
      <div flex></div>
      <md-button class="md-warn" ng-click="$panel.collapse()">Collapse</md-button>
    </md-expansion-panel-footer>

  </md-expansion-panel-expanded>

</md-expansion-panel>
```




## <a name="documentation"></a> Documentation

Documentation Coming Soon :)

If you can't wait then just give it a try.

`md-expansion-panel-expanded` can have a height attribute added to it that will cause it to scroll if the content is longer that what you specified

By default both `md-expansion-panel-header` and `md-expansion-panel-footer` are sticky. If you want to disable that, then just add the `md-no-sticky` attribute on either element
