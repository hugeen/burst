# Burst

Low to High level JavaScript Libraries.

* Minimalist.
* Scalable.
* Hackable.
* Readable.
* Developer-Friendly.
* Convention over configuration.
* No Magic Tricks.

## Global Summary

* [Compatibility](#compatibility)
* [DOM Library](#dom-library)


# Compatibility

* IE 9+, Firefox 6+, Safari 5+, Chrome 6+, Opera 12+


# Documentation

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

