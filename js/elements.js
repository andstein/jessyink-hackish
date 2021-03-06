
/** tries to find specially formatted text element in group
 *
 * @param node group that is tested for direct child node with text
 * @return object with information of parsed text
 * @see tryParseDict for formatting of special text nodes
 */
function tryFindGroupDict(node) {
	for(var i=0; i<node.childNodes.length; i++) 
	{
		var child= node.childNodes[i];
		if (child.tagName == 'text' && child.childNodes.length==1 && child.childNodes[0].tagName == 'tspan') {
			var text = child.childNodes[0].textContent;
			var obj = tryParseDict(text);
			if (obj) return obj;
		}
	}

	return undefined
}

/** Function to handle JessyInk elements.
 *
 *	@param	node	Element node.
 */
function handleElement(node)
{
	if (node.getAttributeNS(NSS['jessyink'], 'element') == 'core.video')
	{
		var url;
		var width;
		var height;
		var x;
		var y;
		var transform;

		var tspans = node.getElementsByTagNameNS("http://www.w3.org/2000/svg", "tspan");

		for (var tspanCounter = 0; tspanCounter < tspans.length; tspanCounter++)
		{
			if (tspans[tspanCounter].getAttributeNS("https://launchpad.net/jessyink", "video") == "url")
			{
				url = tspans[tspanCounter].firstChild.nodeValue;
			}
		}

		var rects = node.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect");

		for (var rectCounter = 0; rectCounter < rects.length; rectCounter++)
		{
			if (rects[rectCounter].getAttributeNS("https://launchpad.net/jessyink", "video") == "rect")
			{
				x = rects[rectCounter].getAttribute("x");
				y = rects[rectCounter].getAttribute("y");
				width = rects[rectCounter].getAttribute("width");
				height = rects[rectCounter].getAttribute("height");
				transform = rects[rectCounter].getAttribute("transform");
			}
		}

		for (var childCounter = 0; childCounter < node.childNodes.length; childCounter++)
		{
			if (node.childNodes[childCounter].nodeType == 1)
			{
				if (node.childNodes[childCounter].style)
				{
					node.childNodes[childCounter].style.display = 'none';
				}
				else
				{
					node.childNodes[childCounter].setAttribute("style", "display: none;");
				}
			}
		}

		var foreignNode = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		foreignNode.setAttribute("x", x);
		foreignNode.setAttribute("y", y);
		foreignNode.setAttribute("width", width);
		foreignNode.setAttribute("height", height);
		foreignNode.setAttribute("transform", transform);

		var videoNode = document.createElementNS("http://www.w3.org/1999/xhtml", "video");
		videoNode.setAttribute("src", url);

		foreignNode.appendChild(videoNode);
		node.appendChild(foreignNode);
	}
}

