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
* [Building](#building)
* [Usage](#usage)
* [Documentation](#documentation)



## <a name="installation"></a> Installation

#### Bower

Change to your project's root directory.

```bash
# To install latest
bower install angular-material-expansion-panel

# To install latest and update bower.json
bower install angular-material-expansion-panel --save
```


#### Npm

Change to your project's root directory.

```bash
# To install latest
npm install angular-material-expansion-panel

# To install latest and update package.json
npm install angular-material-expansion-panel --save
```


Include the `material.components.expansionPanels` module as a dependency in your application.

```javascript
angular.module('myApp', ['ngMaterial', 'material.components.expansionPanels']);
```




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

To add Expansion Panels to you angular-material project, include the `material.components.expansionPanels` module as a dependency in your application.

```javascript
angular.module('myApp', ['ngMaterial', 'material.components.expansionPanels']);
```

* [mdExpansionPanel](#mdExpansionPanel)
* [mdExpansionPanelCollapsed](#mdExpansionPanelCollapsed)
* [mdExpansionPanelExpanded](#mdExpansionPanelExpanded)
* [mdExpansionPanelHeader](#mdExpansionPanelHeader)
* [mdExpansionPanelFooter](#mdExpansionPanelFooter)
* [$mdExpansionPanel](#$mdExpansionPanel)


#### Directives

## mdExpansionPanel

`mdExpansionPanel` is the main container for panels

```
<md-expansion-panel
  [md-component-id=""]>
...
</md-expansion-panel>
```

#### Attributes

| Param | Type | Details |
| :--: | :--: | :--: |
| md-component-id | string= | <p>add an id if you want to acces the panel via the <code>$mdExpansionPanel</code> service</p>  |



## mdExpansionPanelCollapsed

`mdExpansionPanelCollapsed` is used to contain content when the panel is collapsed

```
<md-expansion-panel-collapsed>
...
</md-expansion-panel>
```




## mdExpansionPanelExpanded

`mdExpansionPanelExpanded` is used to contain content when the panel is expanded

```
<md-expansion-panel-expanded
  [height=""]>
...
</md-expansion-panel-expanded>
```xpansion-panel>
```

#### Attributes

| Param | Type | Details |
| :--: | :--: | :--: |
| height | number= | <p>add this attribute set the max height of the expanded content. The container will be set to scroll</p>  |




## mdExpansionPanelHeader

`mdExpansionPanelHeader` is nested inside of `mdExpansionPanelExpanded` and contains content you want in place of the collapsed content
this is optional

```
<md-expansion-panel-header
  [md-no-sticky=""]>
...
</md-expansion-panel-header>
```

#### Attributes

| Param | Type | Details |
| :--: | :--: | :--: |
| md-no-sticky | boolean= | <p>add this aatribute to disable sticky</p>  |



## mdExpansionPanelFooter

`mdExpansionPanelFooter` is nested inside of `mdExpansionPanelExpanded` and contains content you want at the bottom.
By default the Footer will stick to the bottom of the page if the panel expands past
this is optional

```
<md-expansion-panel-footer
  [md-no-sticky=""]>
...
</md-expansion-panel-footer>
```

#### Attributes

| Param | Type | Details |
| :--: | :--: | :--: |
| md-no-sticky | boolean= | <p>add this aatribute to disable sticky</p>  |



### Services

## $mdExpansionPanel

Expand and collapse Expansion Panel using its `md-component-id`

```javascript
$mdExpansionPanel('theComponentId').then(function (instance) {
  instance.expand();
  instance.contract();
});
```
