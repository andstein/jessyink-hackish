/** Initialisation function.
 *  The whole presentation is set-up in this function.
 */
function jessyInkInit()
{
	// Make sure we only execute this code once. Double execution can occur if the onload event handler is set
	// in the main svg tag as well (as was recommended in earlier versions). Executing this function twice does
	// not lead to any problems, but it takes more time.
	if (jessyInkInitialised)
		return;

	// Making the presentation scaleable.
	var VIEWBOX = ROOT_NODE.getAttribute("viewBox");

	if (VIEWBOX)
	{
		WIDTH = ROOT_NODE.viewBox.animVal.width;
		HEIGHT = ROOT_NODE.viewBox.animVal.height;
	}
	else
	{
		HEIGHT = parseFloat(ROOT_NODE.getAttribute("height"));
		WIDTH = parseFloat(ROOT_NODE.getAttribute("width"));
		ROOT_NODE.setAttribute("viewBox", "0 0 " + WIDTH + " " + HEIGHT);
	}

	ROOT_NODE.setAttribute("width", "100%");
	ROOT_NODE.setAttribute("height", "100%");

	// Setting the background color.
	var namedViews = document.getElementsByTagNameNS(NSS["sodipodi"], "namedview");

	for (var counter = 0; counter < namedViews.length; counter++)
	{
		if (namedViews[counter].hasAttribute("id") && namedViews[counter].hasAttribute("pagecolor"))
		{
			if (namedViews[counter].getAttribute("id") == "base")
			{
				BACKGROUND_COLOR = namedViews[counter].getAttribute("pagecolor");
				var newAttribute = "background-color:" + BACKGROUND_COLOR + ";";

				if (ROOT_NODE.hasAttribute("style"))
					newAttribute += ROOT_NODE.getAttribute("style");

				ROOT_NODE.setAttribute("style", newAttribute);
			}
		}
	}

	// Defining clip-path.
	var defsNodes = document.getElementsByTagNameNS(NSS["svg"], "defs");

	if (defsNodes.length > 0)
	{
		var existingClipPath = document.getElementById("jessyInkSlideClipPath");

		if (!existingClipPath)
		{
			var rectNode = document.createElementNS(NSS["svg"], "rect");
			var clipPath = document.createElementNS(NSS["svg"], "clipPath");

			rectNode.setAttribute("x", 0);
			rectNode.setAttribute("y", 0);
			rectNode.setAttribute("width", WIDTH);
			rectNode.setAttribute("height", HEIGHT);

			clipPath.setAttribute("id", "jessyInkSlideClipPath");
			clipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

			clipPath.appendChild(rectNode);
			defsNodes[0].appendChild(clipPath);
		}
	}

	// Making a list of the slide and finding the master slide.
	var nodes = document.getElementsByTagNameNS(NSS["svg"], "g");
	var tempSlides = new Array();
	var existingJessyInkPresentationLayer = null;

	for (var counter = 0; counter < nodes.length; counter++)
	{
		if (nodes[counter].getAttributeNS(NSS["inkscape"], "groupmode") && (nodes[counter].getAttributeNS(NSS["inkscape"], "groupmode") == "layer"))
		{
			if (nodes[counter].getAttributeNS(NSS["inkscape"], "label") && nodes[counter].getAttributeNS(NSS["jessyink"], "masterSlide") == "masterSlide")
				masterSlide = nodes[counter];
			else if (nodes[counter].getAttributeNS(NSS["inkscape"], "label") && nodes[counter].getAttributeNS(NSS["jessyink"], "presentationLayer") == "presentationLayer")
				existingJessyInkPresentationLayer = nodes[counter];
			else if (nodes[counter].getAttributeNS(NSS["inkscape"], "label").substring(0,1) == '_')
				nodes[counter].setAttribute('style','display:none');
			else if (nodes[counter].getAttributeNS(NSS["inkscape"], "label").substring(0,1) == '!')
				masterSlide = nodes[counter];
			else
				tempSlides.push(nodes[counter].getAttribute("id"));
		}
		else if (nodes[counter].getAttributeNS(NSS['jessyink'], 'element'))
			handleElement(nodes[counter]);
	}

	// Hide master slide set default transitions.
	if (masterSlide)
	{
		masterSlide.style.display = "none";

		if (masterSlide.hasAttributeNS(NSS["jessyink"], "transitionIn"))
			defaultTransitionInDict = propStrToDict(masterSlide.getAttributeNS(NSS["jessyink"], "transitionIn"));

		if (masterSlide.hasAttributeNS(NSS["jessyink"], "transitionOut"))
			defaultTransitionOutDict = propStrToDict(masterSlide.getAttributeNS(NSS["jessyink"], "transitionOut"));
	}

	if (existingJessyInkPresentationLayer != null)
	{
		existingJessyInkPresentationLayer.parentNode.removeChild(existingJessyInkPresentationLayer);
	}

	// Set start slide.
	var hashObj = new LocationHash(window.location.hash);

	activeSlide = hashObj.slideNumber;
	activeEffect = hashObj.effectNumber;

	if (activeSlide < 0)
		activeSlide = 0;
	else if (activeSlide >= tempSlides.length)
		activeSlide = tempSlides.length - 1;

	var originalNode = document.getElementById(tempSlides[counter]);

	var JessyInkPresentationLayer = document.createElementNS(NSS["svg"], "g");
	JessyInkPresentationLayer.setAttributeNS(NSS["inkscape"], "groupmode", "layer");
	JessyInkPresentationLayer.setAttributeNS(NSS["inkscape"], "label", "JessyInk Presentation Layer");
	JessyInkPresentationLayer.setAttributeNS(NSS["jessyink"], "presentationLayer", "presentationLayer");
	JessyInkPresentationLayer.setAttribute("id", "jessyink_presentation_layer");
	JessyInkPresentationLayer.style.display = "inherit";
	ROOT_NODE.appendChild(JessyInkPresentationLayer);

	// Gathering all the information about the transitions and effects of the slides, set the background
	// from the master slide and substitute the auto-texts.
	for (var counter = 0; counter < tempSlides.length; counter++)
	{
		var originalNode = document.getElementById(tempSlides[counter]);
		originalNode.style.display = "none";
		var node = suffixNodeIds(originalNode.cloneNode(true), "_" + counter);
		JessyInkPresentationLayer.appendChild(node);
		slides[counter] = new Object();
		slides[counter]["original_element"] = originalNode;
		slides[counter]["element"] = node;

		// Set build in transition.
		slides[counter]["transitionIn"] = new Object();

		var dict;

		if (node.hasAttributeNS(NSS["jessyink"], "transitionIn"))
			dict = propStrToDict(node.getAttributeNS(NSS["jessyink"], "transitionIn"));
		else
			dict = defaultTransitionInDict;

		slides[counter]["transitionIn"]["name"] = dict["name"];
		slides[counter]["transitionIn"]["options"] = new Object();

		for (key in dict)
			if (key != "name")
				slides[counter]["transitionIn"]["options"][key] = dict[key];

		// Set build out transition.
		slides[counter]["transitionOut"] = new Object();

		if (node.hasAttributeNS(NSS["jessyink"], "transitionOut"))
			dict = propStrToDict(node.getAttributeNS(NSS["jessyink"], "transitionOut"));
		else
			dict = defaultTransitionOutDict;

		slides[counter]["transitionOut"]["name"] = dict["name"];
		slides[counter]["transitionOut"]["options"] = new Object();

		for (key in dict)
			if (key != "name")
				slides[counter]["transitionOut"]["options"][key] = dict[key];

		// Copy master slide content.
		if (masterSlide)
		{
			var clonedNode = suffixNodeIds(masterSlide.cloneNode(true), "_" + counter);
			clonedNode.removeAttributeNS(NSS["inkscape"], "groupmode");
			clonedNode.removeAttributeNS(NSS["inkscape"], "label");
			clonedNode.style.display = "inherit";

			node.insertBefore(clonedNode, node.firstChild);
		}

		// Setting clip path.
		node.setAttribute("clip-path", "url(#jessyInkSlideClipPath)");

		// Substitute auto texts.
		substituteAutoTexts(node, node.getAttributeNS(NSS["inkscape"], "label"), counter + 1, tempSlides.length);

		node.removeAttributeNS(NSS["inkscape"], "groupmode");
		node.removeAttributeNS(NSS["inkscape"], "label");

		// Set effects.
		var tempEffects = new Array();
		var groups = new Object();

		for (var IOCounter = 0; IOCounter <= 1; IOCounter++)
		{
			var propName = "";
			var dir = 0;

			if (IOCounter == 0)
			{
				propName = "effectIn";
				dir = 1;
			}
			else if (IOCounter == 1)
			{
				propName = "effectOut";
				dir = -1;
			}

			var effects = getElementsByPropertyNS(node, NSS["jessyink"], propName);

			for (var effectCounter = 0; effectCounter < effects.length; effectCounter++)
			{
				var element = document.getElementById(effects[effectCounter]);
				var dict = propStrToDict(element.getAttributeNS(NSS["jessyink"], propName));

				// Put every element that has an effect associated with it, into its own group.
				// Unless of course, we already put it into its own group.
				if (!(groups[element.id]))
				{
					var newGroup = document.createElementNS(NSS["svg"], "g");

					element.parentNode.insertBefore(newGroup, element);
					newGroup.appendChild(element.parentNode.removeChild(element));
					groups[element.id] = newGroup;
				}

				var effectDict = new Object();

				effectDict["effect"] = dict["name"];
				effectDict["dir"] = dir;
				effectDict["element"] = groups[element.id];

				for (var option in dict)
				{
					if ((option != "name") && (option != "order"))
					{
						if (!effectDict["options"])
							effectDict["options"] = new Object();

						effectDict["options"][option] = dict[option];
					}
				}

				if (!tempEffects[dict["order"]])
					tempEffects[dict["order"]] = new Array();

				tempEffects[dict["order"]][tempEffects[dict["order"]].length] = effectDict;
			}
		}

		// do the same for groups with '{{...}}' effect specifier texts
		var candidates = node.getElementsByTagNameNS(NSS["svg"], "g");
		for(var i=0; i<candidates.length; i++) 
		{
			var obj = tryFindGroupDict(candidates[i]);
			if (obj) 
			{
				console.log('found obj=' + obj);
				var id= candidates[i].getAttribute('id');
				var effectDict= { 
					dir:1,
					element:candidates[i],
					order:obj.order,
					effect:obj.name || 'appear',
					options:obj,
				};

				if (!tempEffects[obj.order])
					tempEffects[obj.order]= new Array();

				tempEffects[obj.order].push( effectDict );
			}
		}

		// Make invisible, but keep in rendering tree to ensure that bounding box can be calculated.
		node.setAttribute("opacity",0);
		node.style.display = "inherit";

		// Create a transform group.
		var transformGroup = document.createElementNS(NSS["svg"], "g");

		// Add content to transform group.
		while (node.firstChild)
			transformGroup.appendChild(node.firstChild);

		// Transfer the transform attribute from the node to the transform group.
		if (node.getAttribute("transform"))
		{
			transformGroup.setAttribute("transform", node.getAttribute("transform"));
			node.removeAttribute("transform");
		}

		// Create a view group.
		var viewGroup = document.createElementNS(NSS["svg"], "g");

		viewGroup.appendChild(transformGroup);
		slides[counter]["viewGroup"] = node.appendChild(viewGroup);

		// Insert background.
		if (BACKGROUND_COLOR != null)
		{
			var rectNode = document.createElementNS(NSS["svg"], "rect");

			rectNode.setAttribute("x", 0);
			rectNode.setAttribute("y", 0);
			rectNode.setAttribute("width", WIDTH);
			rectNode.setAttribute("height", HEIGHT);
			rectNode.setAttribute("id", "jessyInkBackground" + counter);
			rectNode.setAttribute("fill", BACKGROUND_COLOR);

			slides[counter]["viewGroup"].insertBefore(rectNode, slides[counter]["viewGroup"].firstChild);
		}

		// Set views.
		var tempViews = new Array();
		var views = getElementsByPropertyNS(node, NSS["jessyink"], "view");
		var matrixOld = (new matrixSVG()).fromElements(1, 0, 0, 0, 1, 0, 0, 0, 1);

		// Set initial view even if there are no other views.
		slides[counter]["viewGroup"].setAttribute("transform", matrixOld.toAttribute());
		slides[counter].initialView = matrixOld.toAttribute();

		for (var viewCounter = 0; viewCounter < views.length; viewCounter++)
		{
			var element = document.getElementById(views[viewCounter]);
			var dict = propStrToDict(element.getAttributeNS(NSS["jessyink"], "view"));

			if (dict["order"] == 0)
			{
				matrixOld = pointMatrixToTransformation(rectToMatrix(element)).mult((new matrixSVG()).fromSVGMatrix(slides[counter].viewGroup.getScreenCTM()).inv().mult((new matrixSVG()).fromSVGMatrix(element.parentNode.getScreenCTM())).inv());
				slides[counter].initialView = matrixOld.toAttribute();
			}
			else
			{
				var effectDict = new Object();

				effectDict["effect"] = dict["name"];
				effectDict["dir"] = 1;
				effectDict["element"] = slides[counter]["viewGroup"];
				effectDict["order"] = dict["order"];

				for (var option in dict)
				{
					if ((option != "name") && (option != "order"))
					{
						if (!effectDict["options"])
							effectDict["options"] = new Object();

						effectDict["options"][option] = dict[option];
					}
				}

				effectDict["options"]["matrixNew"] = pointMatrixToTransformation(rectToMatrix(element)).mult((new matrixSVG()).fromSVGMatrix(slides[counter].viewGroup.getScreenCTM()).inv().mult((new matrixSVG()).fromSVGMatrix(element.parentNode.getScreenCTM())).inv());

				tempViews[dict["order"]] = effectDict;
			}

			// Remove element.
			element.parentNode.removeChild(element);
		}

		// Consolidate view array and append it to the effect array.
		if (tempViews.length > 0)
		{
			for (var viewCounter = 0; viewCounter < tempViews.length; viewCounter++)
			{
				if (tempViews[viewCounter])
				{
					tempViews[viewCounter]["options"]["matrixOld"] = matrixOld;
					matrixOld = tempViews[viewCounter]["options"]["matrixNew"];

					if (!tempEffects[tempViews[viewCounter]["order"]])
						tempEffects[tempViews[viewCounter]["order"]] = new Array();

					tempEffects[tempViews[viewCounter]["order"]][tempEffects[tempViews[viewCounter]["order"]].length] = tempViews[viewCounter];
				}
			}
		}

		// Set consolidated effect array.
		if (tempEffects.length > 0)
		{
			slides[counter]["effects"] = new Array();

			for (var effectCounter = 0; effectCounter < tempEffects.length; effectCounter++)
			{
				if (tempEffects[effectCounter])
					slides[counter]["effects"][slides[counter]["effects"].length] = tempEffects[effectCounter];
			}
		}

		node.setAttribute("onmouseover", "if ((currentMode == INDEX_MODE) && ( activeSlide != " + counter + ")) { indexSetActiveSlide(" + counter + "); };");

		// Set visibility for initial state.
		if (counter == activeSlide)
		{
			node.style.display = "inherit";
			node.setAttribute("opacity",1);
		}
		else
		{
			node.style.display = "none";
			node.setAttribute("opacity",0);
		}
	}

	// Set key handler.
	var jessyInkObjects = document.getElementsByTagNameNS(NSS["svg"], "g");

	for (var counter = 0; counter < jessyInkObjects.length; counter++)
	{
		var elem = jessyInkObjects[counter];

		if (elem.getAttributeNS(NSS["jessyink"], "customKeyBindings"))
		{
			if (elem.getCustomKeyBindings != undefined)
				keyCodeDictionary = elem.getCustomKeyBindings();

			if (elem.getCustomCharBindings != undefined)
				charCodeDictionary = elem.getCustomCharBindings();
		}
	}

	// Set mouse handler.
	var jessyInkMouseHandler = document.getElementsByTagNameNS(NSS["jessyink"], "mousehandler");

	for (var counter = 0; counter < jessyInkMouseHandler.length; counter++)
	{
		var elem = jessyInkMouseHandler[counter];

		if (elem.getMouseHandler != undefined)
		{
			var tempDict = elem.getMouseHandler();

			for (mode in tempDict)
			{
				if (!mouseHandlerDictionary[mode])
					mouseHandlerDictionary[mode] = new Object();

				for (handler in tempDict[mode])
					mouseHandlerDictionary[mode][handler] = tempDict[mode][handler];
			}
		}
	}

	// Check effect number.
	if ((activeEffect < 0) || (!slides[activeSlide].effects))
	{
		activeEffect = 0;
	}
	else if (activeEffect > slides[activeSlide].effects.length)
	{
		activeEffect = slides[activeSlide].effects.length;
	}

	createProgressBar(JessyInkPresentationLayer);
	hideProgressBar();
	setProgressBarValue(activeSlide);
	setTimeIndicatorValue(0);
	setInterval("updateTimer()", 1000);
	setSlideToState(activeSlide, activeEffect);
	jessyInkInitialised = true;
}
