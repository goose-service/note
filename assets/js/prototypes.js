/**
 * Wrap an HTML Element
 * https://jonlabelle.com/snippets/view/javascript/wrap-an-html-element-in-javascript
 *
 * @param {Array} elms
 */
HTMLElement.prototype.wrap = function (elms)
{
	// Convert `elms` to an array, if necessary.
	if (!elms.length) elms = [elms];

	// Loops backwards to prevent having to clone the wrapper on the
	// first element (see `child` below).
	for (let i = elms.length - 1; i >= 0; i--)
	{
		const child = (i > 0) ? this.cloneNode(true) : this;
		const el = elms[i];

		// Cache the current parent and sibling.
		const parent = el.parentNode;
		const sibling = el.nextSibling;

		// Wrap the element (is automatically removed from its current
		// parent).
		child.appendChild(el);

		// If the element had a sibling, insert the wrapper before
		// the sibling to maintain the HTML structure; otherwise, just
		// append it to the parent.
		if (sibling)
		{
			parent.insertBefore(child, sibling);
		}
		else
		{
			parent.appendChild(child);
		}
	}
};