function el(element = 'div', attrs, children) {
	if (typeof element === 'function') {
		element = element.call(this);
	}

	if (typeof element === 'string') {
		element = document.createElement(element);
	}

	for (const key in el.fn) {
		if (!element.hasOwnProperty(key)) {
			element[key] = el.fn[key];
		}
	}

	if (attrs != null) {
		element.attrs(attrs);
	}

	if (children != null) {
		element.childEls(children);
	}

	return element;
}

el.fn = {
	attrs(attributes) {
		if (arguments[0] === 'RENDER') {
			if (this._attrs != null) {
				this.attrs(this._attrs);
			}

			return this;
		}

		this._attrs = attributes;

		if (typeof attributes === 'function') {
			attributes = attributes.call(this);
		}

		Array.prototype.slice.call(this.attributes)
			.filter(attribute => !(attribute in attributes))
			.forEach(attribute => this.removeAttribute(attribute));

		for (let key in attributes) {
			let attribute = attributes[key];
			if (typeof attribute === 'function') {
				attribute = attribute.call(this);
			}

			this.setAttribute(key, attribute);
		}
	},

	childEls(children, renderChildEl = false) {
		if (arguments[0] === 'RENDER') {
			if (this._childEls != null) {
				this.childEls(this._childEls, true);
			}

			return this;
		}

		while (this.firstChild) {
			this.removeChild(this.firstChild);
		}

		this._childEls = children;

		if (typeof children === 'function') {
			children = children.call(this);
		}

		if (!Array.isArray(children)) {
			children = [children];
		}

		const fragment = document.createDocumentFragment();
		for (let index = 0, length = children.length; index < length; index++) {
			let child = children[index];

			let renderChildElShouldRender = true;

			if (typeof child === 'function') {
				child = child.call(this);
				renderChildElShouldRender = false;
			}

			if (Array.isArray(child)) {
				child = el(...child);
				renderChildElShouldRender = false;
			}

			if (!(child instanceof HTMLElement)) {
				child = document.createTextNode(String(child));
			} else if (renderChildEl && renderChildElShouldRender && child.hasOwnProperty('render')) {
				child.render();
			}

			fragment.appendChild(child);
		}
		this.appendChild(fragment);

		return this;
	},

	cbk(callback) {
		if (arguments[0] === 'RENDER') {
			if (this._cbk != null) {
				this.cbk(this._cbk);
			}

			return this;
		}

		this._cbk = callback;

		callback.call(this);

		return this;
	},

	render() {
		if (arguments[0] === 'RENDER') {
			return this;
		}

		for (const key in el.fn) {
			if (this.hasOwnProperty(key)) {
				this[key].call(this, 'RENDER');
			}
		}

		return this;
	}
};

el.tags = ['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br',
	'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'comment', 'datalist', 'dd', 'del', 'details',
	'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
	'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label',
	'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup',
	'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section',
	'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot',
	'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

el.tags.forEach(tag => el[tag] = (...args) => el(tag, ...args));
