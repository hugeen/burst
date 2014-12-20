# Burst

Low to High level JavaScript Libraries.

* Minimalist.
* Scalable.
* Hackable.
* Readable.
* Developer-Friendly.
* Convention over configuration.

## Global Summary

* [DOM Library](#dom-library)
* [Canvas Drawing](#canvas-drawing)

# Compatibility

* IE 9+, Firefox 6+, Safari 5+, Chrome 6+, Opera 12+


## Use it with Browserify or NodeJS

```
$ npm install watchify -g
$ watchify main.js -o static/bundle.js -v --debug
```


## Documentation

### DOM Library

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

