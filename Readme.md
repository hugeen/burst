# Burst

Low level JavaScript Library to build your own Framework.

## Global Summary

* [Core Capabilities](#core-capabilities)
* [DOM Library](#dom-library)
* [Canvas Drawing](#canvas-drawing)

# Compatibility
* IE 9+, Firefox 6+, Safari 5+, Chrome 6+, Opera 12+


## Use it with Browserify or NodeJS

```
$ npm install watchify -g
$ watchify main.js -o static/bundle.js -v --debug
```


## Core concepts and Phylosophy

* Convention over configuration.
* Performances are fine but not at the cost of other important concepts, such as readability.


## DOM Library

A tiny jQuery-like Library

```javascript
// Selector
$('div'); => [div, div, div]
$(document) => [document]

// Add Event Listener
function onClick (e) {
    e.preventDefault();
}
$('a').on('click', onClick);

// Remove Event Listener
$('a').removeListner('click', onClick);

// DOM Ready
$(function() {}):
```

