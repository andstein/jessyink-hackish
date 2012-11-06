
/** Function to update the export layer.
 */
function slideUpdateExportLayer()
{
	// Suspend redraw since we are going to mess with the slides.
	var suspendHandle = ROOT_NODE.suspendRedraw(2000);

	var tmpActiveSlide = activeSlide;
	var tmpActiveEffect = activeEffect;
	var exportedLayers = new Array();

	for (var counterSlides = 0; counterSlides < slides.length; counterSlides++)
	{
		var exportNode;

		setSlideToState(counterSlides, STATE_START);

		var maxEffect = 0;

		if (slides[counterSlides].effects)
		{
			maxEffect = slides[counterSlides].effects.length;
		}

		exportNode = slides[counterSlides].element.cloneNode(true);
		exportNode.setAttributeNS(NSS["inkscape"], "groupmode", "layer");
		exportNode.setAttributeNS(NSS["inkscape"], "label", "slide_" + padString((counterSlides + 1).toString(), slides.length.toString().length) + "_effect_" + padString("0", maxEffect.toString().length));

		exportedLayers.push(exportNode);

		if (slides[counterSlides]["effects"])
		{	
			for (var counter = 0; counter < slides[counterSlides]["effects"].length; counter++)
			{
				for (var subCounter = 0; subCounter < slides[counterSlides]["effects"][counter].length; subCounter++)
				{
					var effect = slides[counterSlides]["effects"][counter][subCounter];
					if (effect["effect"] == "fade")
						fade(parseInt(effect["dir"]), effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "appear")
						appear(parseInt(effect["dir"]), effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "pop")
						pop(parseInt(effect["dir"]), effect["element"], STATE_END, effect["options"]);	
					else if (effect["effect"] == "view")
						view(parseInt(effect["dir"]), effect["element"], STATE_END, effect["options"]);	
				}

				var layerName = "slide_" + padString((counterSlides + 1).toString(), slides.length.toString().length) + "_effect_" + padString((counter + 1).toString(), maxEffect.toString().length);
				exportNode = slides[counterSlides].element.cloneNode(true);
				exportNode.setAttributeNS(NSS["inkscape"], "groupmode", "layer");
				exportNode.setAttributeNS(NSS["inkscape"], "label", layerName);
				exportNode.setAttribute("id", layerName);

				exportedLayers.push(exportNode);
			}
		}
	}

	activeSlide = tmpActiveSlide;
	activeEffect = tmpActiveEffect;
	setSlideToState(activeSlide, activeEffect);

	// Copy image.
	var newDoc = document.documentElement.cloneNode(true);

	// Delete viewbox form new imag and set width and height.
	newDoc.removeAttribute('viewbox');
	newDoc.setAttribute('width', WIDTH);
	newDoc.setAttribute('height', HEIGHT);

	// Delete all layers and script elements.
	var nodesToBeRemoved = new Array();

	for (var childCounter = 0; childCounter <  newDoc.childNodes.length; childCounter++)
	{
		var child = newDoc.childNodes[childCounter];

		if (child.nodeType == 1)
		{
			if ((child.nodeName.toUpperCase() == 'G') || (child.nodeName.toUpperCase() == 'SCRIPT'))
			{
				nodesToBeRemoved.push(child);
			}
		}
	}

	for (var ndCounter = 0; ndCounter < nodesToBeRemoved.length; ndCounter++)
	{
		var nd = nodesToBeRemoved[ndCounter];

		// Before removing the node, check whether it contains any definitions.
		var defs = nd.getElementsByTagNameNS(NSS["svg"], "defs");

		for (var defsCounter = 0; defsCounter < defs.length; defsCounter++)
		{
			if (defs[defsCounter].id)
			{
				newDoc.appendChild(defs[defsCounter].cloneNode(true));
			}
		}

		// Remove node.
		nd.parentNode.removeChild(nd);
	}

	// Set current layer.
	if (exportedLayers[0])
	{
		var namedView;

		for (var nodeCounter = 0; nodeCounter < newDoc.childNodes.length; nodeCounter++)
		{
			if ((newDoc.childNodes[nodeCounter].nodeType == 1) && (newDoc.childNodes[nodeCounter].getAttribute('id') == 'base'))
			{
				namedView = newDoc.childNodes[nodeCounter];
			}
		}

		if (namedView)
		{
			namedView.setAttributeNS(NSS['inkscape'], 'current-layer', exportedLayers[0].getAttributeNS(NSS['inkscape'], 'label'));
		}
	}

	// Add exported layers.
	while (exportedLayers.length > 0)
	{
		var nd = exportedLayers.pop();

		nd.setAttribute("opacity",1);
		nd.style.display = "inherit";

		newDoc.appendChild(nd);
	}

	// Serialise the new document.
	var serializer = new XMLSerializer();
	var strm = 
	{
		content : "",
		close : function() {},  
		flush : function() {},  
		write : function(str, count) { this.content += str; }  
	};

	var xml = serializer.serializeToStream(newDoc, strm, 'UTF-8');

	window.location = 'data:application/svg+xml;base64;charset=utf-8,' + window.btoa(strm.content);

	// Unsuspend redraw.
	ROOT_NODE.unsuspendRedraw(suspendHandle);
	ROOT_NODE.forceRedraw();
}

