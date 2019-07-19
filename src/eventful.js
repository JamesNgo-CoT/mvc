/** */
class Eventful {
    constructor() {
        this.eventData = [];
        this.eventListenData = [];
    }

    on(name, handler, once = false, context = this) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(typeof name === 'string',
                'Agrument "name" must hold a string type value.');
            console.assert(typeof handler === 'function',
                'Agrument "handler" must hold a function type value.');
            console.assert(typeof once === 'boolean',
                'Agrument "once" must hold a boolean type value.');
            console.assert(context instanceof Eventful,
                'Agrument "context" must hold an "Eventful" class instance.');
        }
        // END ASSERT

        this.eventData.push({ name, handler, once, context });

        return this;
    }

    off(name, handler, once, context, cleanupListenTo = true) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(name === undefined || name === null || typeof name === 'string',
                'Agrument "name" must be omitted, must be null or must hold a string type value.');
            console.assert(handler === undefined || handler === null || typeof handler === 'function',
                'Agrument "handler" must be omitted, must be null or must hold a function type value.');
            console.assert(once === undefined || once === null || typeof once === 'boolean',
                'Agrument "once" must be omitted, must be null or must hold a boolean type value.');
            console.assert(context === undefined || context === null || context instanceof Eventful,
                'Agrument "context" must be omitted, must be null or must hold an "Eventful" class instance.');
            console.assert(typeof cleanupListenTo === 'boolean',
                'Agrument "cleanupListenTo" must hold a boolean type value.');
        }
        // END ASSERT

        let index = 0;
        while (index < this.eventData.length) {
            const eventData = this.eventData[index];
            if ((name === undefined || name === null || eventData.name === name)
                && (handler === undefined || handler === null || eventData.handler === handler)
                && (once === undefined || once === null || eventData.once === once)
                && (context === undefined || context === null || eventData.context === context)) {

                this.eventData.splice(index, 1);

                if (cleanupListenTo === true && context instanceof Eventful && context !== this) {
                    context.stopListening(this, eventData.name, eventData.handler, eventData.once); // INFINIT LOOP
                }

                continue;
            }

            index++;
        }

        return this;
    }

    trigger(name, ...args) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(typeof name === 'string',
                'Agrument "name" must hold a string type value.');
        }
        // END ASSERT

        for (let index = 0, length = this.eventData.length; index < length; index++) {
            const eventData = this.eventData[index];
            if (eventData.name === name) {
                eventData.handler.call(eventData.context, ...args);
            }
        }

        this.off(name, null, true, null);

        return this;
    }

    listenTo(context, name, handler, once = false) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(context instanceof Eventful,
                'Agrument "context" must hold an "Eventful" class instance.');
            console.assert(typeof name === 'string',
                'Agrument "name" must hold a string type value.');
            console.assert(typeof handler === 'function',
                'Agrument "handler" must hold a function type value.');
            console.assert(typeof once === 'boolean',
                'Agrument "once" must hold a boolean type value.');
        }
        // END ASSERT

        this.eventListenData.push({ context, name, handler, once });
        context.on(name, handler, once, this);

        return this;
    }

    stopListening(context, name, handler, once) {

        // START ASSERT
        if (typeof window.console === 'object' && console !== null && typeof console.assert === 'function') {
            console.assert(context === undefined || context === null || context instanceof Eventful,
                'Agrument "context" must be omitted, must be null or must hold an "Eventful" class instance.');
            console.assert(name === undefined || name === null || typeof name === 'string',
                'Agrument "name" must be omitted, must be null or must hold a string type value.');
            console.assert(handler === undefined || handler === null || typeof handler === 'function',
                'Agrument "handler" must be omitted, must be null or must hold a function type value.');
            console.assert(once === undefined || once === null || typeof once === 'boolean',
                'Agrument "once" must be omitted, must be null or must hold a boolean type value.');
        }
        // END ASSERT

        let index = 0;
        while (index < this.eventListenData.length) {
            const eventData = this.eventData[index];
            if ((context === undefined || context === null || eventData.context === context)
                && (name === undefined || name === null || eventData.name === name)
                && (handler === undefined || handler === null || eventData.handler === handler)
                && (once === undefined || once === null || eventData.once === once)) {

                this.eventData.splice(index, 1);
                eventData.context.off(eventData.name, eventData.handler, eventData.once, this, false);

                continue;
            }

            index++;
        }

        return this;
    }
}