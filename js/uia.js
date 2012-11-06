
/** Event handler for mouse wheel events in slide mode.
 *  based on http://adomas.org/javascript-mouse-wheel/
 *
 *  @param e the event
 */
function slideMousewheel(e)
{
	var delta = 0;

	if (!e)
		e = window.event;

	if (e.wheelDelta)
	{ // IE Opera
		delta = e.wheelDelta/120;
	}
	else if (e.detail)
	{ // MOZ
		delta = -e.detail/3;
	}

	if (delta > 0)
		skipEffects(-1);
	else if (delta < 0)
		skipEffects(1);

	if (e.preventDefault)
		e.preventDefault();

	e.returnValue = false;
}

/** Event handler for mouse wheel events in index mode.
 *  based on http://adomas.org/javascript-mouse-wheel/
 *
 *  @param e the event
 */
function indexMousewheel(e)
{
	var delta = 0;

	if (!e)
		e = window.event;

	if (e.wheelDelta)
	{ // IE Opera
		delta = e.wheelDelta/120;
	}
	else if (e.detail)
	{ // MOZ
		delta = -e.detail/3;
	}

	if (delta > 0)
		indexSetPageSlide(activeSlide - INDEX_COLUMNS * INDEX_COLUMNS);
	else if (delta < 0)
		indexSetPageSlide(activeSlide + INDEX_COLUMNS * INDEX_COLUMNS);

	if (e.preventDefault)
		e.preventDefault();

	e.returnValue = false;
}

/** Function to set the path paint width.
*/
function set_path_paint_width()
{
	var svgPoint1 = document.documentElement.createSVGPoint();
	var svgPoint2 = document.documentElement.createSVGPoint();

	svgPoint1.x = 0.0;
	svgPoint1.y = 0.0;
	svgPoint2.x = 1.0;
	svgPoint2.y = 0.0;

	var matrix = slides[activeSlide]["element"].getTransformToElement(ROOT_NODE);

	if (slides[activeSlide]["viewGroup"])
		matrix = slides[activeSlide]["viewGroup"].getTransformToElement(ROOT_NODE);

	svgPoint1 = svgPoint1.matrixTransform(matrix);
	svgPoint2 = svgPoint2.matrixTransform(matrix);

	path_paint_width = path_width / Math.sqrt((svgPoint2.x - svgPoint1.x) * (svgPoint2.x - svgPoint1.x) + (svgPoint2.y - svgPoint1.y) * (svgPoint2.y - svgPoint1.y));
}

/** Function to reset path width in drawing mode.
*/
function drawingResetPathWidth()
{
	path_width = path_width_default;
	set_path_paint_width();
}

/** Function to set path width in drawing mode.
 *
 * @param width new path width
 */
function drawingSetPathWidth(width)
{
	path_width = width;
	set_path_paint_width();
}

/** Function to set path colour in drawing mode.
 *
 * @param colour new path colour
 */
function drawingSetPathColour(colour)
{
	path_colour = colour;
}


/** Event handler for key press.
 *
 *  @param e the event
 */
function keydown(e)
{
	if (!e)
		e = window.event;

	code = e.keyCode || e.charCode;

	if (!processingEffect && keyCodeDictionary[currentMode] && keyCodeDictionary[currentMode][code])
		return keyCodeDictionary[currentMode][code]();
	else
		document.onkeypress = keypress;
}
// Set event handler for key down.
document.onkeydown = keydown;

/** Event handler for key press.
 *
 *  @param e the event
 */
function keypress(e)
{
	document.onkeypress = null;

	if (!e)
		e = window.event;

	str = String.fromCharCode(e.keyCode || e.charCode);

	if (!processingEffect && charCodeDictionary[currentMode] && charCodeDictionary[currentMode][str])
		return charCodeDictionary[currentMode][str]();
}

/** Function to supply the default char code dictionary.
 *
 * @returns default char code dictionary
 */
function getDefaultCharCodeDictionary()
{
	var charCodeDict = new Object();

	charCodeDict[SLIDE_MODE] = new Object();
	charCodeDict[INDEX_MODE] = new Object();
	charCodeDict[DRAWING_MODE] = new Object();

	charCodeDict[SLIDE_MODE]["i"] = function () { return toggleSlideIndex(); };
	charCodeDict[SLIDE_MODE]["d"] = function () { return slideSwitchToDrawingMode(); };
	charCodeDict[SLIDE_MODE]["D"] = function () { return slideQueryDuration(); };
	charCodeDict[SLIDE_MODE]["n"] = function () { return slideAddSlide(activeSlide); };
	charCodeDict[SLIDE_MODE]["p"] = function () { return slideToggleProgressBarVisibility(); };
	charCodeDict[SLIDE_MODE]["t"] = function () { return slideResetTimer(); };
	charCodeDict[SLIDE_MODE]["e"] = function () { return slideUpdateExportLayer(); };

	charCodeDict[DRAWING_MODE]["d"] = function () { return drawingSwitchToSlideMode(); };
	charCodeDict[DRAWING_MODE]["0"] = function () { return drawingResetPathWidth(); };
	charCodeDict[DRAWING_MODE]["1"] = function () { return drawingSetPathWidth(1.0); };
	charCodeDict[DRAWING_MODE]["3"] = function () { return drawingSetPathWidth(3.0); };
	charCodeDict[DRAWING_MODE]["5"] = function () { return drawingSetPathWidth(5.0); };
	charCodeDict[DRAWING_MODE]["7"] = function () { return drawingSetPathWidth(7.0); };
	charCodeDict[DRAWING_MODE]["9"] = function () { return drawingSetPathWidth(9.0); };
	charCodeDict[DRAWING_MODE]["b"] = function () { return drawingSetPathColour("blue"); };
	charCodeDict[DRAWING_MODE]["c"] = function () { return drawingSetPathColour("cyan"); };
	charCodeDict[DRAWING_MODE]["g"] = function () { return drawingSetPathColour("green"); };
	charCodeDict[DRAWING_MODE]["k"] = function () { return drawingSetPathColour("black"); };
	charCodeDict[DRAWING_MODE]["m"] = function () { return drawingSetPathColour("magenta"); };
	charCodeDict[DRAWING_MODE]["o"] = function () { return drawingSetPathColour("orange"); };
	charCodeDict[DRAWING_MODE]["r"] = function () { return drawingSetPathColour("red"); };
	charCodeDict[DRAWING_MODE]["w"] = function () { return drawingSetPathColour("white"); };
	charCodeDict[DRAWING_MODE]["y"] = function () { return drawingSetPathColour("yellow"); };
	charCodeDict[DRAWING_MODE]["z"] = function () { return drawingUndo(); };

	charCodeDict[INDEX_MODE]["i"] = function () { return toggleSlideIndex(); };
	charCodeDict[INDEX_MODE]["-"] = function () { return indexDecreaseNumberOfColumns(); };
	charCodeDict[INDEX_MODE]["="] = function () { return indexIncreaseNumberOfColumns(); };
	charCodeDict[INDEX_MODE]["+"] = function () { return indexIncreaseNumberOfColumns(); };
	charCodeDict[INDEX_MODE]["0"] = function () { return indexResetNumberOfColumns(); };

	return charCodeDict;
}

/** Function to supply the default key code dictionary.
 *
 * @returns default key code dictionary
 */
function getDefaultKeyCodeDictionary()
{
	var keyCodeDict = new Object();

	keyCodeDict[SLIDE_MODE] = new Object();
	keyCodeDict[INDEX_MODE] = new Object();
	keyCodeDict[DRAWING_MODE] = new Object();

	keyCodeDict[SLIDE_MODE][LEFT_KEY] = function() { return dispatchEffects(-1); };
	keyCodeDict[SLIDE_MODE][RIGHT_KEY] = function() { return dispatchEffects(1); };
	keyCodeDict[SLIDE_MODE][UP_KEY] = function() { return skipEffects(-1); };
	keyCodeDict[SLIDE_MODE][DOWN_KEY] = function() { return skipEffects(1); };
	keyCodeDict[SLIDE_MODE][PAGE_UP_KEY] = function() { return dispatchEffects(-1); };
	keyCodeDict[SLIDE_MODE][PAGE_DOWN_KEY] = function() { return dispatchEffects(1); };
	keyCodeDict[SLIDE_MODE][HOME_KEY] = function() { return slideSetActiveSlide(0); };
	keyCodeDict[SLIDE_MODE][END_KEY] = function() { return slideSetActiveSlide(slides.length - 1); };
	keyCodeDict[SLIDE_MODE][SPACE_KEY] = function() { return dispatchEffects(1); };

	keyCodeDict[INDEX_MODE][LEFT_KEY] = function() { return indexSetPageSlide(activeSlide - 1); };
	keyCodeDict[INDEX_MODE][RIGHT_KEY] = function() { return indexSetPageSlide(activeSlide + 1); };
	keyCodeDict[INDEX_MODE][UP_KEY] = function() { return indexSetPageSlide(activeSlide - INDEX_COLUMNS); };
	keyCodeDict[INDEX_MODE][DOWN_KEY] = function() { return indexSetPageSlide(activeSlide + INDEX_COLUMNS); };
	keyCodeDict[INDEX_MODE][PAGE_UP_KEY] = function() { return indexSetPageSlide(activeSlide - INDEX_COLUMNS * INDEX_COLUMNS); };
	keyCodeDict[INDEX_MODE][PAGE_DOWN_KEY] = function() { return indexSetPageSlide(activeSlide + INDEX_COLUMNS * INDEX_COLUMNS); };
	keyCodeDict[INDEX_MODE][HOME_KEY] = function() { return indexSetPageSlide(0); };
	keyCodeDict[INDEX_MODE][END_KEY] = function() { return indexSetPageSlide(slides.length - 1); };
	keyCodeDict[INDEX_MODE][ENTER_KEY] = function() { return toggleSlideIndex(); };

	keyCodeDict[DRAWING_MODE][ESCAPE_KEY] = function () { return drawingSwitchToSlideMode(); };

	return keyCodeDict;
}

/** Function to handle all mouse events.
 *
 *	@param	evnt	event
 *	@param	action	type of event (e.g. mouse up, mouse wheel)
 */
function mouseHandlerDispatch(evnt, action)
{
	if (!evnt)
		evnt = window.event;

	var retVal = true;

	if (!processingEffect && mouseHandlerDictionary[currentMode] && mouseHandlerDictionary[currentMode][action])
	{
		var subRetVal = mouseHandlerDictionary[currentMode][action](evnt);

		if (subRetVal != null && subRetVal != undefined)
			retVal = subRetVal;
	}

	if (evnt.preventDefault && !retVal)
		evnt.preventDefault();

	evnt.returnValue = retVal;

	return retVal;
}

// Set mouse event handler.
document.onmousedown = function(e) { return mouseHandlerDispatch(e, MOUSE_DOWN); };
document.onmouseup = function(e) { return mouseHandlerDispatch(e, MOUSE_UP); };
document.onmousemove = function(e) { return mouseHandlerDispatch(e, MOUSE_MOVE); };

// Moz
if (window.addEventListener)
{
	window.addEventListener('DOMMouseScroll', function(e) { return mouseHandlerDispatch(e, MOUSE_WHEEL); }, false);
}

// Opera Safari OK - may not work in IE
window.onmousewheel = function(e) { return mouseHandlerDispatch(e, MOUSE_WHEEL); };

/** Function to supply the default mouse handler dictionary.
 *
 * @returns default mouse handler dictionary
 */
function getDefaultMouseHandlerDictionary()
{
	var mouseHandlerDict = new Object();

	mouseHandlerDict[SLIDE_MODE] = new Object();
	mouseHandlerDict[INDEX_MODE] = new Object();
	mouseHandlerDict[DRAWING_MODE] = new Object();

	mouseHandlerDict[SLIDE_MODE][MOUSE_DOWN] = function(evnt) { return dispatchEffects(1); };
	mouseHandlerDict[SLIDE_MODE][MOUSE_WHEEL] = function(evnt) { return slideMousewheel(evnt); };

	mouseHandlerDict[INDEX_MODE][MOUSE_DOWN] = function(evnt) { return toggleSlideIndex(); };

	mouseHandlerDict[DRAWING_MODE][MOUSE_DOWN] = function(evnt) { return drawingMousedown(evnt); };
	mouseHandlerDict[DRAWING_MODE][MOUSE_UP] = function(evnt) { return drawingMouseup(evnt); };
	mouseHandlerDict[DRAWING_MODE][MOUSE_MOVE] = function(evnt) { return drawingMousemove(evnt); };

	return mouseHandlerDict;
}

/** Function to switch from slide mode to drawing mode.
*/
function slideSwitchToDrawingMode()
{
	currentMode = DRAWING_MODE;

	var tempDict;

	if (ROOT_NODE.hasAttribute("style"))
		tempDict = propStrToDict(ROOT_NODE.getAttribute("style"));
	else
		tempDict = new Object();

	tempDict["cursor"] = "crosshair";
	ROOT_NODE.setAttribute("style", dictToPropStr(tempDict));
}

/** Function to switch from drawing mode to slide mode.
*/
function drawingSwitchToSlideMode()
{
	currentMode = SLIDE_MODE;

	var tempDict;

	if (ROOT_NODE.hasAttribute("style"))
		tempDict = propStrToDict(ROOT_NODE.getAttribute("style"));
	else
		tempDict = new Object();

	tempDict["cursor"] = "auto";
	ROOT_NODE.setAttribute("style", dictToPropStr(tempDict));
}


/** Function to undo last drawing operation.
*/
function drawingUndo()
{
	mouse_presentation_path = null;
	mouse_original_path = null;

	if (history_presentation_elements.length > 0)
	{
		var p = history_presentation_elements.pop();
		var parent = p.parentNode.removeChild(p);

		p = history_original_elements.pop();
		parent = p.parentNode.removeChild(p);
	}
}

/** Event handler for mouse down in drawing mode.
 *
 *  @param e the event
 */
function drawingMousedown(e)
{
	var value = 0;

	if (e.button)
		value = e.button;
	else if (e.which)
		value = e.which;

	if (value == 1)
	{
		history_counter++;

		var p = calcCoord(e);

		mouse_last_x = e.clientX;
		mouse_last_y = e.clientY;
		mouse_original_path = document.createElementNS(NSS["svg"], "path");
		mouse_original_path.setAttribute("stroke", path_colour);
		mouse_original_path.setAttribute("stroke-width", path_paint_width);
		mouse_original_path.setAttribute("fill", "none");
		mouse_original_path.setAttribute("id", "path " + Date());
		mouse_original_path.setAttribute("d", "M" + p.x + "," + p.y);
		slides[activeSlide]["original_element"].appendChild(mouse_original_path);
		history_original_elements.push(mouse_original_path);

		mouse_presentation_path = document.createElementNS(NSS["svg"], "path");
		mouse_presentation_path.setAttribute("stroke", path_colour);
		mouse_presentation_path.setAttribute("stroke-width", path_paint_width);
		mouse_presentation_path.setAttribute("fill", "none");
		mouse_presentation_path.setAttribute("id", "path " + Date() + " presentation copy");
		mouse_presentation_path.setAttribute("d", "M" + p.x + "," + p.y);

		if (slides[activeSlide]["viewGroup"])
			slides[activeSlide]["viewGroup"].appendChild(mouse_presentation_path);
		else
			slides[activeSlide]["element"].appendChild(mouse_presentation_path);

		history_presentation_elements.push(mouse_presentation_path);

		return false;
	}

	return true;
}

/** Event handler for mouse up in drawing mode.
 *
 *  @param e the event
 */
function drawingMouseup(e)
{
	if(!e)
		e = window.event;

	if (mouse_presentation_path != null)
	{
		var p = calcCoord(e);
		var d = mouse_presentation_path.getAttribute("d");
		d += " L" + p.x + "," + p.y;
		mouse_presentation_path.setAttribute("d", d);
		mouse_presentation_path = null;
		mouse_original_path.setAttribute("d", d);
		mouse_original_path = null;

		return false;
	}

	return true;
}

/** Event handler for mouse move in drawing mode.
 *
 *  @param e the event
 */
function drawingMousemove(e)
{
	if(!e)
		e = window.event;

	var dist = (mouse_last_x - e.clientX) * (mouse_last_x - e.clientX) + (mouse_last_y - e.clientY) * (mouse_last_y - e.clientY);

	if (mouse_presentation_path == null)
	{
		return true;
	}

	if (dist >= mouse_min_dist_sqr)
	{
		var p = calcCoord(e);
		var d = mouse_presentation_path.getAttribute("d");
		d += " L" + p.x + "," + p.y;
		mouse_presentation_path.setAttribute("d", d);
		mouse_original_path.setAttribute("d", d);
		mouse_last_x = e.clientX;
		mouse_last_y = e.clientY;
	}

	return false;
}

