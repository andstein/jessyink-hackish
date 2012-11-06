
/** Function to query the duration of the presentation from the user in slide mode.
*/
function slideQueryDuration()
{
	var new_duration = prompt("Length of presentation in minutes?", timer_duration);

	if ((new_duration != null) && (new_duration != ''))
	{
		timer_duration = new_duration;
	}

	updateTimer();
}
/** Function to toggle the visibility of the progress bar in slide mode.
*/
function slideToggleProgressBarVisibility()
{
	if (progress_bar_visible)
	{
		progress_bar_visible = false;
		hideProgressBar();
	}
	else
	{
		progress_bar_visible = true;
		showProgressBar();
	}
}

/** Function to reset the timer in slide mode.
*/
function slideResetTimer()
{
	timer_start = timer_elapsed;
	updateTimer();
}


/** Function to build a progress bar.
 *	
 *  @param parent node to attach the progress bar to
 */
function createProgressBar(parent_node)
{
	var g = document.createElementNS(NSS["svg"], "g");
	g.setAttribute("clip-path", "url(#jessyInkSlideClipPath)");
	g.setAttribute("id", "layer_progress_bar");
	g.setAttribute("style", "display: none;");

	var rect_progress_bar = document.createElementNS(NSS["svg"], "rect");
	rect_progress_bar.setAttribute("style", "marker: none; fill: rgb(128, 128, 128); stroke: none;");
	rect_progress_bar.setAttribute("id", "rect_progress_bar");
	rect_progress_bar.setAttribute("x", 0);
	rect_progress_bar.setAttribute("y", 0.99 * HEIGHT);
	rect_progress_bar.setAttribute("width", 0);
	rect_progress_bar.setAttribute("height", 0.01 * HEIGHT);
	g.appendChild(rect_progress_bar);

	var circle_timer_indicator = document.createElementNS(NSS["svg"], "circle");
	circle_timer_indicator.setAttribute("style", "marker: none; fill: rgb(255, 0, 0); stroke: none;");
	circle_timer_indicator.setAttribute("id", "circle_timer_indicator");
	circle_timer_indicator.setAttribute("cx", 0.005 * HEIGHT);
	circle_timer_indicator.setAttribute("cy", 0.995 * HEIGHT);
	circle_timer_indicator.setAttribute("r", 0.005 * HEIGHT);
	g.appendChild(circle_timer_indicator);

	parent_node.appendChild(g);
}

/** Function to hide the progress bar.
 *	
 */
function hideProgressBar()
{
	var progress_bar = document.getElementById("layer_progress_bar");

	if (!progress_bar)
	{
		return;
	}

	progress_bar.setAttribute("style", "display: none;");
}

/** Function to show the progress bar.
 *	
 */
function showProgressBar()
{
	var progress_bar = document.getElementById("layer_progress_bar");

	if (!progress_bar)
	{
		return;
	}

	progress_bar.setAttribute("style", "display: inherit;");
}

/** Set progress bar value.
 *	
 *	@param value the current slide number
 *
 */
function setProgressBarValue(value)
{
	var rect_progress_bar = document.getElementById("rect_progress_bar");

	if (!rect_progress_bar)
	{
		return;
	}

	if (value < 1)
	{
		// First slide, assumed to be the title of the presentation
		var x = 0;
		var w = 0.01 * HEIGHT;
	}
	else if (value >= slides.length - 1)
	{
		// Last slide, assumed to be the end of the presentation
		var x = WIDTH - 0.01 * HEIGHT;
		var w = 0.01 * HEIGHT;
	}
	else
	{
		value -= 1;
		value /= (slides.length - 2);

		var x = WIDTH * value;
		var w = WIDTH / (slides.length - 2);
	}

	rect_progress_bar.setAttribute("x", x);
	rect_progress_bar.setAttribute("width", w);
}

/** Set time indicator.
 *	
 *	@param value the percentage of time elapse so far between 0.0 and 1.0
 *
 */
function setTimeIndicatorValue(value)
{
	var circle_timer_indicator = document.getElementById("circle_timer_indicator");

	if (!circle_timer_indicator)
	{
		return;
	}

	if (value < 0.0)
	{
		value = 0.0;
	}

	if (value > 1.0)
	{
		value = 1.0;
	}

	var cx = (WIDTH - 0.01 * HEIGHT) * value + 0.005 * HEIGHT;
	circle_timer_indicator.setAttribute("cx", cx);
}

/** Update timer.
 *	
 */
function updateTimer()
{
	timer_elapsed += 1;
	setTimeIndicatorValue((timer_elapsed - timer_start) / (60 * timer_duration));
}
