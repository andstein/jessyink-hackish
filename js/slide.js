/** Function to set a slide either to the start or the end state.
 *  
 *  @param slide the slide to use
 *  @param state the state into which the slide should be set
 */
function setSlideToState(slide, state)
{
	slides[slide]["viewGroup"].setAttribute("transform", slides[slide].initialView);

	if (slides[slide]["effects"])
	{	
		if (state == STATE_END)
		{
			for (var counter = 0; counter < slides[slide]["effects"].length; counter++)
			{
				for (var subCounter = 0; subCounter < slides[slide]["effects"][counter].length; subCounter++)
				{
					var effect = slides[slide]["effects"][counter][subCounter];
					if (effect["effect"] == "fade")
						fade(effect["dir"], effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "appear")
						appear(effect["dir"], effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "pop")
						pop(effect["dir"], effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "view")
						view(effect["dir"], effect["element"], STATE_END, effect["options"]);	
				}
			}
		}
		else if (state == STATE_START)
		{
			for (var counter = slides[slide]["effects"].length - 1; counter >= 0; counter--)
			{
				for (var subCounter = 0; subCounter < slides[slide]["effects"][counter].length; subCounter++)
				{
					var effect = slides[slide]["effects"][counter][subCounter];
					if (effect["effect"] == "fade")
						fade(parseInt(effect["dir"]) * -1, effect["element"], STATE_START, effect["options"]);	
					else if (effect["effect"] == "appear")
						appear(parseInt(effect["dir"]) * -1, effect["element"], STATE_START, effect["options"]);	
					else if (effect["effect"] == "pop")
						pop(parseInt(effect["dir"]) * -1, effect["element"], STATE_START, effect["options"]);	
					else if (effect["effect"] == "view")
						view(parseInt(effect["dir"]) * -1, effect["element"], STATE_START, effect["options"]);	
				}
			}
		}
		else
		{
			setSlideToState(slide, STATE_START);

			for (var counter = 0; counter < slides[slide]["effects"].length && counter < state; counter++)
			{
				for (var subCounter = 0; subCounter < slides[slide]["effects"][counter].length; subCounter++)
				{
					var effect = slides[slide]["effects"][counter][subCounter];
					if (effect["effect"] == "fade")
						fade(effect["dir"], effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "appear")
						appear(effect["dir"], effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "pop")
						pop(effect["dir"], effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "view")
						view(effect["dir"], effect["element"], STATE_END, effect["options"]);	
				}
			}
		}
	}

	window.location.hash = (activeSlide + 1) + '_' + activeEffect;
}

/** Add slide.
 *
 *	@param after_slide after which slide the new slide should be inserted into the presentation
 */
function addSlide(after_slide)
{
	number_of_added_slides++;

	var g = document.createElementNS(NSS["svg"], "g");
	g.setAttribute("clip-path", "url(#jessyInkSlideClipPath)");
	g.setAttribute("id", "Whiteboard " + Date() + " presentation copy");
	g.setAttribute("style", "display: none;");

	var new_slide = new Object();
	new_slide["element"] = g;

	// Set build in transition.
	new_slide["transitionIn"] = new Object();
	var dict = defaultTransitionInDict;
	new_slide["transitionIn"]["name"] = dict["name"];
	new_slide["transitionIn"]["options"] = new Object();

	for (key in dict)
		if (key != "name")
			new_slide["transitionIn"]["options"][key] = dict[key];

	// Set build out transition.
	new_slide["transitionOut"] = new Object();
	dict = defaultTransitionOutDict;
	new_slide["transitionOut"]["name"] = dict["name"];
	new_slide["transitionOut"]["options"] = new Object();

	for (key in dict)
		if (key != "name")
			new_slide["transitionOut"]["options"][key] = dict[key];

	// Copy master slide content.
	if (masterSlide)
	{
		var clonedNode = suffixNodeIds(masterSlide.cloneNode(true), "_" + Date() + " presentation_copy");
		clonedNode.removeAttributeNS(NSS["inkscape"], "groupmode");
		clonedNode.removeAttributeNS(NSS["inkscape"], "label");
		clonedNode.style.display = "inherit";

		g.appendChild(clonedNode);
	}

	// Substitute auto texts.
	substituteAutoTexts(g, "Whiteboard " + number_of_added_slides, "W" + number_of_added_slides, slides.length);

	g.setAttribute("onmouseover", "if ((currentMode == INDEX_MODE) && ( activeSlide != " + (after_slide + 1) + ")) { indexSetActiveSlide(" + (after_slide + 1) + "); };");

	// Create a transform group.
	var transformGroup = document.createElementNS(NSS["svg"], "g");

	// Add content to transform group.
	while (g.firstChild)
		transformGroup.appendChild(g.firstChild);

	// Transfer the transform attribute from the node to the transform group.
	if (g.getAttribute("transform"))
	{
		transformGroup.setAttribute("transform", g.getAttribute("transform"));
		g.removeAttribute("transform");
	}

	// Create a view group.
	var viewGroup = document.createElementNS(NSS["svg"], "g");

	viewGroup.appendChild(transformGroup);
	new_slide["viewGroup"] = g.appendChild(viewGroup);

	// Insert background.
	if (BACKGROUND_COLOR != null)
	{
		var rectNode = document.createElementNS(NSS["svg"], "rect");

		rectNode.setAttribute("x", 0);
		rectNode.setAttribute("y", 0);
		rectNode.setAttribute("width", WIDTH);
		rectNode.setAttribute("height", HEIGHT);
		rectNode.setAttribute("id", "jessyInkBackground" + Date());
		rectNode.setAttribute("fill", BACKGROUND_COLOR);

		new_slide["viewGroup"].insertBefore(rectNode, new_slide["viewGroup"].firstChild);
	}

	// Set initial view even if there are no other views.
	var matrixOld = (new matrixSVG()).fromElements(1, 0, 0, 0, 1, 0, 0, 0, 1);

	new_slide["viewGroup"].setAttribute("transform", matrixOld.toAttribute());
	new_slide.initialView = matrixOld.toAttribute();

	// Insert slide
	var node = slides[after_slide]["element"];
	var next_node = node.nextSibling;
	var parent_node = node.parentNode;

	if (next_node)
	{
		parent_node.insertBefore(g, next_node);
	}
	else
	{
		parent_node.appendChild(g);
	}

	g = document.createElementNS(NSS["svg"], "g");
	g.setAttributeNS(NSS["inkscape"], "groupmode", "layer");
	g.setAttributeNS(NSS["inkscape"], "label", "Whiteboard " + number_of_added_slides);
	g.setAttribute("clip-path", "url(#jessyInkSlideClipPath)");
	g.setAttribute("id", "Whiteboard " + Date());
	g.setAttribute("style", "display: none;");

	new_slide["original_element"] = g;

	node = slides[after_slide]["original_element"];
	next_node = node.nextSibling;
	parent_node = node.parentNode;

	if (next_node)
	{
		parent_node.insertBefore(g, next_node);
	}
	else
	{
		parent_node.appendChild(g);
	}

	before_new_slide = slides.slice(0, after_slide + 1);
	after_new_slide = slides.slice(after_slide + 1);
	slides = before_new_slide.concat(new_slide, after_new_slide);

	//resetting the counter attributes on the slides that follow the new slide...
	for (var counter = after_slide+2; counter < slides.length; counter++)
	{
		slides[counter]["element"].setAttribute("onmouseover", "if ((currentMode == INDEX_MODE) && ( activeSlide != " + counter + ")) { indexSetActiveSlide(" + counter + "); };");
	}
}

/** Function to add new slide in slide mode.
 *
 * @param afterSlide after which slide to insert the new one
 */
function slideAddSlide(afterSlide)
{
	addSlide(afterSlide);
	slideSetActiveSlide(afterSlide + 1);
	updateTimer();
}
/** Function to change between slides.
 *
 *  @param dir direction (1 = forwards, -1 = backwards)
 */
function changeSlide(dir)
{
	processingEffect = true;
	effectArray = new Array();

	effectArray[0] = new Object();
	if (dir == 1)
	{
		effectArray[0]["effect"] = slides[activeSlide]["transitionOut"]["name"];
		effectArray[0]["options"] = slides[activeSlide]["transitionOut"]["options"];
		effectArray[0]["dir"] = -1;
	}
	else if (dir == -1)
	{
		effectArray[0]["effect"] = slides[activeSlide]["transitionIn"]["name"];
		effectArray[0]["options"] = slides[activeSlide]["transitionIn"]["options"];
		effectArray[0]["dir"] = 1;
	}
	effectArray[0]["element"] = slides[activeSlide]["element"];

	activeSlide += dir;
	setProgressBarValue(activeSlide);

	effectArray[1] = new Object();

	if (dir == 1)
	{
		effectArray[1]["effect"] = slides[activeSlide]["transitionIn"]["name"];
		effectArray[1]["options"] = slides[activeSlide]["transitionIn"]["options"];
		effectArray[1]["dir"] = 1;
	}
	else if (dir == -1)
	{
		effectArray[1]["effect"] = slides[activeSlide]["transitionOut"]["name"];
		effectArray[1]["options"] = slides[activeSlide]["transitionOut"]["options"];
		effectArray[1]["dir"] = -1;
	}

	effectArray[1]["element"] = slides[activeSlide]["element"];

	if (slides[activeSlide]["effects"] && (dir == -1))
		activeEffect = slides[activeSlide]["effects"].length;
	else
		activeEffect = 0;

	if (dir == -1)
		setSlideToState(activeSlide, STATE_END);
	else
		setSlideToState(activeSlide, STATE_START);

	transCounter = 0;
	startTime = (new Date()).getTime();
	lastFrameTime = null;
	effect(dir);
}


/** Function to set the active slide in the slide view.
 *
 *  @param nbr index of the active slide
 */
function slideSetActiveSlide(nbr)
{
	if (nbr >= slides.length)
		nbr = slides.length - 1;
	else if (nbr < 0)
		nbr = 0;

	slides[activeSlide]["element"].setAttribute("opacity",0);
	slides[activeSlide]["element"].style.display = "none";

	activeSlide = parseInt(nbr);

	setSlideToState(activeSlide, STATE_START);
	slides[activeSlide]["element"].style.display = "inherit";
	slides[activeSlide]["element"].setAttribute("opacity",1);

	activeEffect = 0;
	setProgressBarValue(nbr);
}

/** Function to set the active slide in the index view.
 *
 *  @param nbr index of the active slide
 */
function indexSetActiveSlide(nbr)
{
	if (nbr >= slides.length)
		nbr = slides.length - 1;
	else if (nbr < 0)
		nbr = 0;

	slides[activeSlide]["element"].setAttribute("opacity",0.5);

	activeSlide = parseInt(nbr);
	window.location.hash = (activeSlide + 1) + '_0';

	slides[activeSlide]["element"].setAttribute("opacity",1);
}
