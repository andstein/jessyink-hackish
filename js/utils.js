/** Convenience function to pad a string with zero in front up to a certain length.
 */
function padString(str, len)
{
	var outStr = str;

	while (outStr.length < len)
	{
		outStr = '0' + outStr;
	}

	return outStr;
}


/** Convenience function to translate a attribute string into a dictionary.
 *
 *	@param str the attribute string
 *  @return a dictionary
 *  @see dictToPropStr
 */
function propStrToDict(str)
{
	var list = str.split(";");
	var obj = new Object();

	for (var counter = 0; counter < list.length; counter++)
	{
		var subStr = list[counter];
		var subList = subStr.split(":");
		if (subList.length == 2)
		{
			obj[subList[0]] = subList[1];
		}	
	}

	return obj;
}

/** Convenience function to translate a dictionary into a string that can be used as an attribute.
 *
 *  @param dict the dictionary to convert
 *  @return a string that can be used as an attribute
 *  @see propStrToDict
 */
function dictToPropStr(dict)
{
	var str = "";

	for (var key in dict)
	{
		str += key + ":" + dict[key] + ";";
	}

	return str;
}

/** Convert screen coordinates to document coordinates.
 *
 *  @param e event with screen coordinates
 *
 *  @return coordinates in SVG file coordinate system	
 */
function calcCoord(e)
{
	var svgPoint = document.documentElement.createSVGPoint();
	svgPoint.x = e.clientX + window.pageXOffset;
	svgPoint.y = e.clientY + window.pageYOffset;

	var matrix = slides[activeSlide]["element"].getScreenCTM();

	if (slides[activeSlide]["viewGroup"])
		matrix = slides[activeSlide]["viewGroup"].getScreenCTM();

	svgPoint = svgPoint.matrixTransform(matrix.inverse());
	return svgPoint;
}

/** Class processing the location hash.
 *
 *	@param str location hash
 */
function LocationHash(str)
{
	this.slideNumber = 0;
	this.effectNumber = 0;

	str = str.substr(1, str.length - 1);

	var parts = str.split('_');

	// Try to extract slide number.
	if (parts.length >= 1)
	{
		try
		{
			var slideNumber = parseInt(parts[0]);

			if (!isNaN(slideNumber))
			{
				this.slideNumber = slideNumber - 1;
			}
		}
		catch (e)
		{
		}
	}
	
	// Try to extract effect number.
	if (parts.length >= 2)
	{
		try
		{
			var effectNumber = parseInt(parts[1]);

			if (!isNaN(effectNumber))
			{
				this.effectNumber = effectNumber;
			}
		}
		catch (e)
		{
		}
	}
}


/** Trimming function for strings.
*/
String.prototype.trim = function()
{
	return this.replace(/^\s+|\s+$/g, '');
}
