jessyink-hackish
================

fork of the [launchpad jessyink project](https://code.launchpad.net/jessyink/). jessyink adds
some javascript to a .SVG file created in [inkscape](http://inkscape.org) to create layer
based presentations that can be displayed directly by any modern web browser.

in the original implementation, the adding of effects implies running an external python script
that reparses the entire presentation every time. this fork uses magic "{{...}}" strings
directly included in the presentation that encode the effects.

open `build/demo.svg` in your browser for a simple demonstratin