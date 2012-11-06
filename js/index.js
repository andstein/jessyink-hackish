/** Function to decrease the number of columns in index mode.
*/
function indexDecreaseNumberOfColumns()
{
	if (INDEX_COLUMNS >= 3)
	{
		INDEX_COLUMNS -= 1;
		INDEX_OFFSET = -1
			indexSetPageSlide(activeSlide);
	}
}

/** Function to increase the number of columns in index mode.
*/
function indexIncreaseNumberOfColumns()
{
	if (INDEX_COLUMNS < 7)
	{
		INDEX_COLUMNS += 1;
		INDEX_OFFSET = -1
			indexSetPageSlide(activeSlide);
	}
}

/** Function to reset the number of columns in index mode.
*/
function indexResetNumberOfColumns()
{
	if (INDEX_COLUMNS != INDEX_COLUMNS_DEFAULT)
	{
		INDEX_COLUMNS = INDEX_COLUMNS_DEFAULT;
		INDEX_OFFSET = -1
			indexSetPageSlide(activeSlide);
	}
}

/** Function to set the page and active slide in index view. 
 *
 *  @param nbr index of the active slide
 *
 *  NOTE: To force a redraw,
 *  set INDEX_OFFSET to -1 before calling indexSetPageSlide().
 *
 *  This is necessary for zooming (otherwise the index might not
 *  get redrawn) and when switching to index mode.
 *
 *  INDEX_OFFSET = -1
 *  indexSetPageSlide(activeSlide);
 */
function indexSetPageSlide(nbr)
{
	if (nbr >= slides.length)
		nbr = slides.length - 1;
	else if (nbr < 0)
		nbr = 0;

	//calculate the offset
	var offset = nbr - nbr % (INDEX_COLUMNS * INDEX_COLUMNS);

	if (offset < 0)
		offset = 0;

	//if different from kept offset, then record and change the page
	if (offset != INDEX_OFFSET)
	{
		INDEX_OFFSET = offset;
		displayIndex(INDEX_OFFSET);
	}

	//set the active slide
	indexSetActiveSlide(nbr);
}

/** Function to toggle between index and slide mode.
*/
function toggleSlideIndex()
{
	var suspendHandle = ROOT_NODE.suspendRedraw(500);

	if (currentMode == SLIDE_MODE)
	{
		hideProgressBar();		
		INDEX_OFFSET = -1;
		indexSetPageSlide(activeSlide);
		currentMode = INDEX_MODE;
	}
	else if (currentMode == INDEX_MODE)
	{
		for (var counter = 0; counter < slides.length; counter++)
		{
			slides[counter]["element"].setAttribute("transform","scale(1)");

			if (counter == activeSlide)
			{
				slides[counter]["element"].style.display = "inherit";
				slides[counter]["element"].setAttribute("opacity",1);
				activeEffect = 0;
			}
			else
			{
				slides[counter]["element"].setAttribute("opacity",0);
				slides[counter]["element"].style.display = "none";
			}
		}
		currentMode = SLIDE_MODE;
		setSlideToState(activeSlide, STATE_START);
		setProgressBarValue(activeSlide);

		if (progress_bar_visible)
		{
			showProgressBar();
		}
	}

	ROOT_NODE.unsuspendRedraw(suspendHandle);
	ROOT_NODE.forceRedraw();
}


/** Function to display the index sheet.
 *
 *  @param offsetNumber offset number
 */
function displayIndex(offsetNumber)
{
	var offsetX = 0;
	var offsetY = 0;

	if (offsetNumber < 0)
		offsetNumber = 0;
	else if (offsetNumber >= slides.length)
		offsetNumber = slides.length - 1;

	for (var counter = 0; counter < slides.length; counter++)
	{
		if ((counter < offsetNumber) || (counter > offsetNumber + INDEX_COLUMNS * INDEX_COLUMNS - 1))
		{
			slides[counter]["element"].setAttribute("opacity",0);
			slides[counter]["element"].style.display = "none";
		}
		else
		{
			offsetX = ((counter - offsetNumber) % INDEX_COLUMNS) * WIDTH;
			offsetY = Math.floor((counter - offsetNumber) / INDEX_COLUMNS) * HEIGHT;

			slides[counter]["element"].setAttribute("transform","scale("+1/INDEX_COLUMNS+") translate("+offsetX+","+offsetY+")");
			slides[counter]["element"].style.display = "inherit";
			slides[counter]["element"].setAttribute("opacity",0.5);
		}

		setSlideToState(counter, STATE_END);
	}

	//do we need to save the current offset?
	if (INDEX_OFFSET != offsetNumber)
		INDEX_OFFSET = offsetNumber;
}
