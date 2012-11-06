/** The view effect.
 *
 *  @param dir direction the effect should be played (1 = forwards, -1 = backwards)
 *  @param element the element the effect should be applied to
 *  @param time the time that has elapsed since the beginning of the effect
 *  @param options a dictionary with additional options (e.g. length of the effect); for the view effect the options need to contain the old and the new matrix.
 */
function view(dir, element, time, options)
{
	var length = 250;
	var fraction;

	if (!options["matrixInitial"])
	{
		var tempString = slides[activeSlide]["viewGroup"].getAttribute("transform");

		if (tempString)
			options["matrixInitial"] = (new matrixSVG()).fromAttribute(tempString);
		else
			options["matrixInitial"] = (new matrixSVG()).fromSVGElements(1, 0, 0, 1, 0, 0);
	}

	if ((time == STATE_END) || (time == STATE_START))
		fraction = 1;
	else
	{
		if (options && options["length"])
			length = options["length"];

		fraction = time / length;
	}

	if (dir == 1)
	{
		if (fraction <= 0)
		{
			element.setAttribute("transform", options["matrixInitial"].toAttribute());
		}
		else if (fraction >= 1)
		{
			element.setAttribute("transform", options["matrixNew"].toAttribute());

			set_path_paint_width();

			options["matrixInitial"] = null;
			return true;
		}
		else
		{
			element.setAttribute("transform", options["matrixInitial"].mix(options["matrixNew"], fraction).toAttribute());
		}
	}
	else if (dir == -1)
	{
		if (fraction <= 0)
		{
			element.setAttribute("transform", options["matrixInitial"].toAttribute());
		}
		else if (fraction >= 1)
		{
			element.setAttribute("transform", options["matrixOld"].toAttribute());
			set_path_paint_width();

			options["matrixInitial"] = null;
			return true;
		}
		else
		{
			element.setAttribute("transform", options["matrixInitial"].mix(options["matrixOld"], fraction).toAttribute());
		}
	}

	return false;
}

/** The fade effect.
 *
 *  @param dir direction the effect should be played (1 = forwards, -1 = backwards)
 *  @param element the element the effect should be applied to
 *  @param time the time that has elapsed since the beginning of the effect
 *  @param options a dictionary with additional options (e.g. length of the effect)
 */
function fade(dir, element, time, options)
{
	var length = 250;
	var fraction;

	if ((time == STATE_END) || (time == STATE_START))
		fraction = 1;
	else
	{
		if (options && options["length"])
			length = options["length"];

		fraction = time / length;
	}

	if (dir == 1)
	{
		if (fraction <= 0)
		{
			element.style.display = "none";
			element.setAttribute("opacity", 0);
		}
		else if (fraction >= 1)
		{
			element.style.display = "inherit";
			element.setAttribute("opacity", 1);
			return true;
		}
		else
		{
			element.style.display = "inherit";
			element.setAttribute("opacity", fraction);
		}
	}
	else if (dir == -1)
	{
		if (fraction <= 0)
		{
			element.style.display = "inherit";
			element.setAttribute("opacity", 1);
		}
		else if (fraction >= 1)
		{
			element.setAttribute("opacity", 0);
			element.style.display = "none";
			return true;
		}
		else
		{
			element.style.display = "inherit";
			element.setAttribute("opacity", 1 - fraction);
		}
	}
	return false;
}

/** The appear effect.
 *
 *  @param dir direction the effect should be played (1 = forwards, -1 = backwards)
 *  @param element the element the effect should be applied to
 *  @param time the time that has elapsed since the beginning of the effect
 *  @param options a dictionary with additional options (e.g. length of the effect)
 */
function appear(dir, element, time, options)
{
	if (dir == 1)
	{
		element.style.display = "inherit";
		element.setAttribute("opacity",1);
	}
	else if (dir == -1)
	{
		element.style.display = "none";
		element.setAttribute("opacity",0);
	}
	return true;
}

/** The pop effect.
 *
 *  @param dir direction the effect should be played (1 = forwards, -1 = backwards)
 *  @param element the element the effect should be applied to
 *  @param time the time that has elapsed since the beginning of the effect
 *  @param options a dictionary with additional options (e.g. length of the effect)
 */
function pop(dir, element, time, options)
{
	var length = 500;
	var fraction;

	if ((time == STATE_END) || (time == STATE_START))
		fraction = 1;
	else
	{
		if (options && options["length"])
			length = options["length"];

		fraction = time / length;
	}

	if (dir == 1)
	{
		if (fraction <= 0)
		{
			element.setAttribute("opacity", 0);
			element.setAttribute("transform", "scale(0)");
			element.style.display = "none";
		}
		else if (fraction >= 1)
		{
			element.setAttribute("opacity", 1);
			element.removeAttribute("transform");
			element.style.display = "inherit";
			return true;
		}
		else
		{
			element.style.display = "inherit";
			var opacityFraction = fraction * 3;
			if (opacityFraction > 1)
				opacityFraction = 1;
			element.setAttribute("opacity", opacityFraction);
			var offsetX = WIDTH * (1.0 - fraction) / 2.0;
			var offsetY = HEIGHT * (1.0 - fraction) / 2.0;
			element.setAttribute("transform", "translate(" + offsetX + "," + offsetY + ") scale(" + fraction + ")");
		}
	}
	else if (dir == -1)
	{
		if (fraction <= 0)
		{
			element.setAttribute("opacity", 1);
			element.setAttribute("transform", "scale(1)");
			element.style.display = "inherit";
		}
		else if (fraction >= 1)
		{
			element.setAttribute("opacity", 0);
			element.removeAttribute("transform");
			element.style.display = "none";
			return true;
		}
		else
		{
			element.setAttribute("opacity", 1 - fraction);
			element.setAttribute("transform", "scale(" + 1 - fraction + ")");
			element.style.display = "inherit";
		}
	}
	return false;
}



/** Function to run an effect.
 *
 *  @param dir direction in which to play the effect (1 = forwards, -1 = backwards)
 */
function effect(dir)
{
	var done = true;

	var suspendHandle = ROOT_NODE.suspendRedraw(200);

	for (var counter = 0; counter < effectArray.length; counter++)
	{
		if (effectArray[counter]["effect"] == "fade")
			done &= fade(parseInt(effectArray[counter]["dir"]) * dir, effectArray[counter]["element"], transCounter, effectArray[counter]["options"]);
		else if (effectArray[counter]["effect"] == "appear")
			done &= appear(parseInt(effectArray[counter]["dir"]) * dir, effectArray[counter]["element"], transCounter, effectArray[counter]["options"]);
		else if (effectArray[counter]["effect"] == "pop")
			done &= pop(parseInt(effectArray[counter]["dir"]) * dir, effectArray[counter]["element"], transCounter, effectArray[counter]["options"]);
		else if (effectArray[counter]["effect"] == "view")
			done &= view(parseInt(effectArray[counter]["dir"]) * dir, effectArray[counter]["element"], transCounter, effectArray[counter]["options"]);
	}

	ROOT_NODE.unsuspendRedraw(suspendHandle);
	ROOT_NODE.forceRedraw();

	if (!done)
	{
		var currentTime = (new Date()).getTime();
		var timeDiff = 1;

		transCounter = currentTime - startTime;

		if (lastFrameTime != null)
		{
			timeDiff = timeStep - (currentTime - lastFrameTime);

			if (timeDiff <= 0)
				timeDiff = 1;
		}

		lastFrameTime = currentTime;

		window.setTimeout("effect(" + dir + ")", timeDiff);
	}
	else
	{
		window.location.hash = (activeSlide + 1) + '_' + activeEffect;
		processingEffect = false;
	}
}

/** Function to dispatch the next effect, if there is none left, change the slide.
 *
 *  @param dir direction of the change (1 = forwards, -1 = backwards)
 */
function dispatchEffects(dir)
{
	if (slides[activeSlide]["effects"] && (((dir == 1) && (activeEffect < slides[activeSlide]["effects"].length)) || ((dir == -1) && (activeEffect > 0))))
	{
		processingEffect = true;

		if (dir == 1)
		{
			effectArray = slides[activeSlide]["effects"][activeEffect];
			activeEffect += dir;
		}
		else if (dir == -1)
		{
			activeEffect += dir;
			effectArray = slides[activeSlide]["effects"][activeEffect];
		}

		transCounter = 0;
		startTime = (new Date()).getTime();
		lastFrameTime = null;
		effect(dir);
	}
	else if (((dir == 1) && (activeSlide < (slides.length - 1))) || (((dir == -1) && (activeSlide > 0))))
	{
		changeSlide(dir);
	}
}

/** Function to skip effects and directly either put the slide into start or end state or change slides.
 *
 *  @param dir direction of the change (1 = forwards, -1 = backwards)
 */
function skipEffects(dir)
{
	if (slides[activeSlide]["effects"] && (((dir == 1) && (activeEffect < slides[activeSlide]["effects"].length)) || ((dir == -1) && (activeEffect > 0))))
	{
		processingEffect = true;

		if (slides[activeSlide]["effects"] && (dir == 1))
			activeEffect = slides[activeSlide]["effects"].length;
		else
			activeEffect = 0;

		if (dir == 1)
			setSlideToState(activeSlide, STATE_END);
		else
			setSlideToState(activeSlide, STATE_START);

		processingEffect = false;
	}
	else if (((dir == 1) && (activeSlide < (slides.length - 1))) || (((dir == -1) && (activeSlide > 0))))
	{
		changeSlide(dir);
	}
}
