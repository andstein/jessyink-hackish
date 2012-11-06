/** Convenience function to get an element depending on whether it has a property with a particular name.
 *	This function emulates some dearly missed XPath functionality.
 *
 *  @param node the node
 *  @param namespace namespace of the attribute
 *  @param name attribute name
 */
function getElementsByPropertyNS(node, namespace, name)
{
	var elems = new Array();

	if (node.getAttributeNS(namespace, name))
		elems.push(node.getAttribute("id"));

	for (var counter = 0; counter < node.childNodes.length; counter++)
	{
		if (node.childNodes[counter].nodeType == 1)
			elems = elems.concat(getElementsByPropertyNS(node.childNodes[counter], namespace, name));
	}

	return elems;
}

/** Sub-function to add a suffix to the ids of the node and all its children.
 *	
 *	@param node the node to change
 *	@param suffix the suffix to add
 *	@param replace dictionary of replaced ids
 *  @see suffixNodeIds
 */
function suffixNoneIds_sub(node, suffix, replace)
{
	if (node.nodeType == 1)
	{
		if (node.getAttribute("id"))
		{
			var id = node.getAttribute("id")
				replace["#" + id] = id + suffix;
			node.setAttribute("id", id + suffix);
		}

		if ((node.nodeName == "use") && (node.getAttributeNS(NSS["xlink"], "href")) && (replace[node.getAttribute(NSS["xlink"], "href")]))
			node.setAttribute(NSS["xlink"], "href", node.getAttribute(NSS["xlink"], "href") + suffix);

		if (node.childNodes)
		{
			for (var counter = 0; counter < node.childNodes.length; counter++)
				suffixNoneIds_sub(node.childNodes[counter], suffix, replace);
		}
	}
}

/** Function to add a suffix to the ids of the node and all its children.
 *	
 *	@param node the node to change
 *	@param suffix the suffix to add
 *  @return the changed node
 *  @see suffixNodeIds_sub
 */
function suffixNodeIds(node, suffix)
{
	var replace = new Object();

	suffixNoneIds_sub(node, suffix, replace);

	return node;
}


