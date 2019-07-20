const counterModelPropertyDescriptor = {
	_count: {
		writable: true
	},

	count: {
		get() {
			return this._count;
		},
		set(newValue) {
			oldValue = this._count;
			if (newValue !== oldValue) {
				this._count = newValue;

				this.trigger('change', 'count', newValue, oldValue);
				this.trigger('change:count', newValue, oldValue);

				this.callControllers('counterModelDidChange', 'count', newValue, oldValue);
				this.callControllers('counterModelCountPropertyDidChange', newValue, oldValue);
			}
		}
	},

	increment: {
		value() {
			if (this.count == null) {
				this.count = 0;
			}

			this.count = this.count + 1;
		}
	}
};

function createCounterModel(obj = {}) {
	Object.defineProperties(obj, Object.assign(counterModelPropertyDescriptor, eventfulPropertyDescriptors, controlledPropertyDescriptor));
	return obj;
}

const counterViewPropertyDescriptor = {
	_suffix: {
		writable: true
	},

	_click: {
		value() {
			this.trigger('click');
			this.callControllers('click');
		}
	},

	setLable: {
		value(newLabel) {
			this._suffix = newLabel;
			this.render();
		}
	}
};

function createCounterView(ele = 'button') {
	ele = el(ele);

	Object.defineProperties(ele, Object.assign(counterViewPropertyDescriptor, eventfulPropertyDescriptors, controlledPropertyDescriptor));

	ele._suffix = '0';

	ele.attrs({ 'class': 'counter', 'type': 'button' });

	ele.childEls([['span', {}, () => `BUTTON ${ele._suffix}`]]);

	ele.addEventListener('click', ele._click);

	return ele;
}

const counterController1PropertyDescriptors = {};

function createCounterController1(model = createCounterModel(), view = createCounterView(), obj = {}) {
	Object.defineProperties(obj, Object.assign(counterControllerProperty1Descriptors, eventfulPropertyDescriptors, controlledPropertyDescriptor));

	obj.listenTo(model, 'change', () => view.setLable(model.count));

	obj.listenTo(view, 'click', () => model.increment());

	return obj;
}

const counterController2PropertyDescriptors = {
	_model: {
		writable: true
	},

	_view: {
		writable: true
	},

	model: {
		set(newValue) {
			this._model = newValue;
			newValue.addController(this);
		}
	},

	view: {
		set(newValue) {
			this._view = newValue;
			newValue.addController(this);
		}
	},

	counterModelCountPropertyDidChange: {
		value(model) {
			this._view.setLable(model.count);
		}
	},

	click: {
		value(view) {
			this._model.increment();
		}
	}
};

function createCounterController2(model = createCounterModel(), view = createCounterView(), obj = {}) {
	Object.defineProperties(obj, Object.assign(counterController2PropertyDescriptors, eventfulPropertyDescriptors, controlledPropertyDescriptor));

	obj.model = model;
	obj.view = view;

	return obj;
}
