/** Class representing an svg matrix.
*/
function matrixSVG()
{
	this.e11 = 0; // a
	this.e12 = 0; // c
	this.e13 = 0; // e
	this.e21 = 0; // b
	this.e22 = 0; // d
	this.e23 = 0; // f
	this.e31 = 0;
	this.e32 = 0;
	this.e33 = 0;
}

/** Constructor function.
 *
 *	@param a element a (i.e. 1, 1) as described in the svg standard.
 *	@param b element b (i.e. 2, 1) as described in the svg standard.
 *	@param c element c (i.e. 1, 2) as described in the svg standard.
 *	@param d element d (i.e. 2, 2) as described in the svg standard.
 *	@param e element e (i.e. 1, 3) as described in the svg standard.
 *	@param f element f (i.e. 2, 3) as described in the svg standard.
 */
matrixSVG.prototype.fromSVGElements = function(a, b, c, d, e, f)
{
	this.e11 = a;
	this.e12 = c;
	this.e13 = e;
	this.e21 = b;
	this.e22 = d;
	this.e23 = f;
	this.e31 = 0;
	this.e32 = 0;
	this.e33 = 1;

	return this;
}

/** Constructor function.
 *
 *	@param matrix an svg matrix as described in the svg standard.
 */
matrixSVG.prototype.fromSVGMatrix = function(m)
{
	this.e11 = m.a;
	this.e12 = m.c;
	this.e13 = m.e;
	this.e21 = m.b;
	this.e22 = m.d;
	this.e23 = m.f;
	this.e31 = 0;
	this.e32 = 0;
	this.e33 = 1;

	return this;
}

/** Constructor function.
 *
 *	@param e11 element 1, 1 of the matrix.
 *	@param e12 element 1, 2 of the matrix.
 *	@param e13 element 1, 3 of the matrix.
 *	@param e21 element 2, 1 of the matrix.
 *	@param e22 element 2, 2 of the matrix.
 *	@param e23 element 2, 3 of the matrix.
 *	@param e31 element 3, 1 of the matrix.
 *	@param e32 element 3, 2 of the matrix.
 *	@param e33 element 3, 3 of the matrix.
 */
matrixSVG.prototype.fromElements = function(e11, e12, e13, e21, e22, e23, e31, e32, e33)
{
	this.e11 = e11;
	this.e12 = e12;
	this.e13 = e13;
	this.e21 = e21;
	this.e22 = e22;
	this.e23 = e23;
	this.e31 = e31;
	this.e32 = e32;
	this.e33 = e33;

	return this;
}

/** Constructor function.
 *
 *	@param attrString string value of the "transform" attribute (currently only "matrix" is accepted)
 */
matrixSVG.prototype.fromAttribute = function(attrString)
{
	str = attrString.substr(7, attrString.length - 8);

	str = str.trim();

	strArray = str.split(",");

	// Opera does not use commas to separate the values of the matrix, only spaces.
	if (strArray.length != 6)
		strArray = str.split(" ");

	this.e11 = parseFloat(strArray[0]);
	this.e21 = parseFloat(strArray[1]);
	this.e31 = 0;
	this.e12 = parseFloat(strArray[2]);
	this.e22 = parseFloat(strArray[3]);
	this.e32 = 0;
	this.e13 = parseFloat(strArray[4]);
	this.e23 = parseFloat(strArray[5]);
	this.e33 = 1;

	return this;
}

/** Output function
 *
 *	@return a string that can be used as the "transform" attribute.
 */
matrixSVG.prototype.toAttribute = function()
{
	return "matrix(" + this.e11 + ", " + this.e21 + ", " + this.e12 + ", " + this.e22 + ", " + this.e13 + ", " + this.e23 + ")";
}

/** Matrix nversion.
 *
 *	@return the inverse of the matrix
 */
matrixSVG.prototype.inv = function()
{
	out = new matrixSVG();

	det = this.e11 * (this.e33 * this.e22 - this.e32 * this.e23) - this.e21 * (this.e33 * this.e12 - this.e32 * this.e13) + this.e31 * (this.e23 * this.e12 - this.e22 * this.e13);

	out.e11 =  (this.e33 * this.e22 - this.e32 * this.e23) / det;
	out.e12 = -(this.e33 * this.e12 - this.e32 * this.e13) / det;
	out.e13 =  (this.e23 * this.e12 - this.e22 * this.e13) / det;
	out.e21 = -(this.e33 * this.e21 - this.e31 * this.e23) / det;
	out.e22 =  (this.e33 * this.e11 - this.e31 * this.e13) / det;
	out.e23 = -(this.e23 * this.e11 - this.e21 * this.e13) / det;
	out.e31 =  (this.e32 * this.e21 - this.e31 * this.e22) / det;
	out.e32 = -(this.e32 * this.e11 - this.e31 * this.e12) / det;
	out.e33 =  (this.e22 * this.e11 - this.e21 * this.e12) / det;

	return out;
}

/** Matrix multiplication.
 *
 *	@param op another svg matrix
 *	@return this * op
 */
matrixSVG.prototype.mult = function(op)
{
	out = new matrixSVG();

	out.e11 = this.e11 * op.e11 + this.e12 * op.e21 + this.e13 * op.e31;
	out.e12 = this.e11 * op.e12 + this.e12 * op.e22 + this.e13 * op.e32;
	out.e13 = this.e11 * op.e13 + this.e12 * op.e23 + this.e13 * op.e33;
	out.e21 = this.e21 * op.e11 + this.e22 * op.e21 + this.e23 * op.e31;
	out.e22 = this.e21 * op.e12 + this.e22 * op.e22 + this.e23 * op.e32;
	out.e23 = this.e21 * op.e13 + this.e22 * op.e23 + this.e23 * op.e33;
	out.e31 = this.e31 * op.e11 + this.e32 * op.e21 + this.e33 * op.e31;
	out.e32 = this.e31 * op.e12 + this.e32 * op.e22 + this.e33 * op.e32;
	out.e33 = this.e31 * op.e13 + this.e32 * op.e23 + this.e33 * op.e33;

	return out;
}

/** Matrix addition.
 *
 *	@param op another svg matrix
 *	@return this + op
 */
matrixSVG.prototype.add = function(op)
{
	out = new matrixSVG();

	out.e11 = this.e11 + op.e11;
	out.e12 = this.e12 + op.e12;
	out.e13 = this.e13 + op.e13;
	out.e21 = this.e21 + op.e21;
	out.e22 = this.e22 + op.e22;
	out.e23 = this.e23 + op.e23;
	out.e31 = this.e31 + op.e31;
	out.e32 = this.e32 + op.e32;
	out.e33 = this.e33 + op.e33;

	return out;
}

/** Matrix mixing.
 *
 *	@param op another svg matrix
 *	@parma contribOp contribution of the other matrix (0 <= contribOp <= 1)
 *	@return (1 - contribOp) * this + contribOp * op
 */
matrixSVG.prototype.mix = function(op, contribOp)
{
	contribThis = 1.0 - contribOp;
	out = new matrixSVG();

	out.e11 = contribThis * this.e11 + contribOp * op.e11;
	out.e12 = contribThis * this.e12 + contribOp * op.e12;
	out.e13 = contribThis * this.e13 + contribOp * op.e13;
	out.e21 = contribThis * this.e21 + contribOp * op.e21;
	out.e22 = contribThis * this.e22 + contribOp * op.e22;
	out.e23 = contribThis * this.e23 + contribOp * op.e23;
	out.e31 = contribThis * this.e31 + contribOp * op.e31;
	out.e32 = contribThis * this.e32 + contribOp * op.e32;
	out.e33 = contribThis * this.e33 + contribOp * op.e33;

	return out;
}

/** Convenience function to obtain a matrix with three corners of a rectangle.
 *
 *	@param rect an svg rectangle
 *	@return a matrixSVG containing three corners of the rectangle
 */
function rectToMatrix(rect)
{
	rectWidth = rect.getBBox().width;
	rectHeight = rect.getBBox().height;
	rectX = rect.getBBox().x;
	rectY = rect.getBBox().y;
	rectXcorr = 0;
	rectYcorr = 0;

	scaleX = WIDTH / rectWidth;
	scaleY = HEIGHT / rectHeight;

	if (scaleX > scaleY)
	{
		scaleX = scaleY;
		rectXcorr -= (WIDTH / scaleX - rectWidth) / 2;
		rectWidth = WIDTH / scaleX;
	}	
	else
	{
		scaleY = scaleX;
		rectYcorr -= (HEIGHT / scaleY - rectHeight) / 2;
		rectHeight = HEIGHT / scaleY;
	}

	if (rect.transform.baseVal.numberOfItems < 1)
	{
		mRectTrans = (new matrixSVG()).fromElements(1, 0, 0, 0, 1, 0, 0, 0, 1);
	}
	else
	{
		mRectTrans = (new matrixSVG()).fromSVGMatrix(rect.transform.baseVal.consolidate().matrix);
	}

	newBasePoints = (new matrixSVG()).fromElements(rectX, rectX, rectX, rectY, rectY, rectY, 1, 1, 1);
	newVectors = (new matrixSVG()).fromElements(rectXcorr, rectXcorr + rectWidth, rectXcorr + rectWidth, rectYcorr, rectYcorr, rectYcorr + rectHeight, 0, 0, 0);

	return mRectTrans.mult(newBasePoints.add(newVectors));
}

/** Convenience function to obtain a transformation matrix from a point matrix.
 *
 *	@param mPoints Point matrix.
 *	@return A transformation matrix.
 */
function pointMatrixToTransformation(mPoints)
{
	mPointsOld = (new matrixSVG()).fromElements(0, WIDTH, WIDTH, 0, 0, HEIGHT, 1, 1, 1);

	return mPointsOld.mult(mPoints.inv());
}


