// Copyright 2008, 2009 Hannes Hochreiner
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.

// Set onload event handler.
window.onload = jessyInkInit;

// Creating a namespace dictionary. The standard Inkscape namespaces are taken from inkex.py.
var NSS = new Object();
NSS['sodipodi']='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd';
NSS['cc']='http://web.resource.org/cc/';
NSS['svg']='http://www.w3.org/2000/svg';
NSS['dc']='http://purl.org/dc/elements/1.1/';
NSS['rdf']='http://www.w3.org/1999/02/22-rdf-syntax-ns#';
NSS['inkscape']='http://www.inkscape.org/namespaces/inkscape';
NSS['xlink']='http://www.w3.org/1999/xlink';
NSS['xml']='http://www.w3.org/XML/1998/namespace';
NSS['jessyink']='https://launchpad.net/jessyink';

// Keycodes.
var LEFT_KEY = 37; // cursor left keycode
var UP_KEY = 38; // cursor up keycode
var RIGHT_KEY = 39; // cursor right keycode
var DOWN_KEY = 40; // cursor down keycode
var PAGE_UP_KEY = 33; // page up keycode
var PAGE_DOWN_KEY = 34; // page down keycode
var HOME_KEY = 36; // home keycode
var END_KEY = 35; // end keycode
var ENTER_KEY = 13; // next slide
var SPACE_KEY = 32;
var ESCAPE_KEY = 27;

// Presentation modes.
var SLIDE_MODE = 1;
var INDEX_MODE = 2;
var DRAWING_MODE = 3;

// Mouse handler actions.
var MOUSE_UP = 1;
var MOUSE_DOWN = 2;
var MOUSE_MOVE = 3;
var MOUSE_WHEEL = 4;

// Parameters.
var ROOT_NODE = document.getElementsByTagNameNS(NSS["svg"], "svg")[0];
var HEIGHT = 0;
var WIDTH = 0;
var INDEX_COLUMNS_DEFAULT = 4;
var INDEX_COLUMNS = INDEX_COLUMNS_DEFAULT;
var INDEX_OFFSET = 0;
var STATE_START = -1;
var STATE_END = -2;
var BACKGROUND_COLOR = null;
var slides = new Array();

// Initialisation.
var currentMode = SLIDE_MODE;
var masterSlide = null;
var activeSlide = 0;
var activeEffect = 0;
var timeStep = 30; // 40 ms equal 25 frames per second.
var lastFrameTime = null;
var processingEffect = false;
var transCounter = 0;
var effectArray = 0;
var defaultTransitionInDict = new Object();
defaultTransitionInDict["name"] = "appear";
var defaultTransitionOutDict = new Object();
defaultTransitionOutDict["name"] = "appear";
var jessyInkInitialised = false;

// Initialise char and key code dictionaries.
var charCodeDictionary = getDefaultCharCodeDictionary();
var keyCodeDictionary = getDefaultKeyCodeDictionary();

// Initialise mouse handler dictionary.
var mouseHandlerDictionary = getDefaultMouseHandlerDictionary();

var progress_bar_visible = false;
var timer_elapsed = 0;
var timer_start = timer_elapsed;
var timer_duration = 15; // 15 minutes

var history_counter = 0;
var history_original_elements = new Array();
var history_presentation_elements = new Array();

var mouse_original_path = null;
var mouse_presentation_path = null;
var mouse_last_x = -1;
var mouse_last_y = -1;
var mouse_min_dist_sqr = 3 * 3;
var path_colour = "red";
var path_width_default = 3;
var path_width = path_width_default;
var path_paint_width = path_width;

var number_of_added_slides = 0;

