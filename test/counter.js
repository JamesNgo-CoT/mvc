/**
 * Manages counter data.
 * @extends Eventful
 */
class CounterModel extends Eventful {

    /** 
     * @argument {number} count Initial count value.
     */
    constructor(count = 0) {
        super();

        this._count = count;
    }

    /**
     * @type {number}
     */
    get count() {
        return this._count;
    }
    set count(newValue) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(typeof newValue === 'number',
                'Agrument "newValue" must hold a number type value.');
        }
        // END ASSERT

        const oldValue = this.count;
        if (newValue !== oldValue) {
            this._count = newValue;

            this.trigger('change', 'count', newValue, oldValue);
            this.trigger('change:count', newValue, oldValue);
        }
    }

    /**
     * @returns {CounterModel}
     */
    increment() {
        this.count = this.count + 1;

        return this;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Counter user interface.
 * @extends Eventful
 */
class CounterView extends Eventful {

    /** */
    constructor() {
        super();

        this._element = document.createElement('button');
        this._element.textContent = 'Counter -';

        this._element.addEventListener('click', (event) => {
            event.preventDefault();
            this.trigger('click');
        });
    }

    /**
     * @type {HTMLElement}
     * @readonly
     */
    get element() {
        return this._element;
    }

    /**
     * @param {string} label 
     * @returns {CounterView}
     */
    setLabel(label) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(typeof label === 'string',
                'Agrument "newValue" must hold a string type value.');
        }
        // END ASSERT

        this._element.textContent = `Counter ${label}`;

        return this;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @extends Eventful
 */
class CounterController extends Eventful {

    /** */
    constructor() {
        super();

        this._model = new CounterModel();
        this._view = new CounterView();

        this._view.on('click', () => {
            this._model.increment();
        });

        this._view.on('click', () => {
            this._model.increment();
        });
    }

    /**
     * @type {CounterModel}
     * @readonly
     */
    get model() {
        return this._model;
    }

    /**
     * @type {CounterView}
     * @readonly
     */
    get view() {
        return this._view;
    }

    /**
     * Returns HTML element (view).
     * @type {HTMLElement}
     * @readonly
    */
    get viewElement() {
        return this._view.element;
    }
}