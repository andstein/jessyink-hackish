/** Function to subtitute the auto-texts.
 *
 *  @param node the node
 *  @param slideName name of the slide the node is on
 *  @param slideNumber number of the slide the node is on
 *  @param numberOfSlides number of slides in the presentation
 */
function substituteAutoTexts(node, slideName, slideNumber, numberOfSlides)
{
	var texts = node.getElementsByTagNameNS(NSS["svg"], "tspan");

	for (var textCounter = 0; textCounter < texts.length; textCounter++)
	{
		if (texts[textCounter].getAttributeNS(NSS["jessyink"], "autoText") == "slideNumber")
			texts[textCounter].firstChild.nodeValue = slideNumber;
		else if (texts[textCounter].getAttributeNS(NSS["jessyink"], "autoText") == "numberOfSlides")
			texts[textCounter].firstChild.nodeValue = numberOfSlides;
		else if (texts[textCounter].getAttributeNS(NSS["jessyink"], "autoText") == "slideTitle")
			texts[textCounter].firstChild.nodeValue = slideName;
	}
}


