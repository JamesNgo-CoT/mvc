const eventfulPropertyDescriptors = {
	_eventData: {
		writable: true
	},

	_eventListenData: {
		writable: true
	},

	on: {
		value(name, handler, once = false, owner = this) {
			if (!Array.isArray(this._eventData)) {
				this._eventData = [];
			}

			this._eventData.push({ name, handler, once, owner });

			return this;
		}
	},

	off: {
		value(name, handler, once, owner, manageEventListenTo = true) {
			if (!Array.isArray(this._eventData)) {
				return;
			}

			let index = 0;
			while (index < this._eventData.length) {
				const eventData = this._eventData[index];
				if ((name === undefined || name === null || eventData.name === name)
					&& (handler === undefined || handler === null || eventData.handler === handler)
					&& (once === undefined || once === null || eventData.once === once)
					&& (owner === undefined || owner === null || eventData.owner === owner)) {

					this._eventData.splice(index, 1);

					if (manageEventListenTo === true && owner.hasOwnProperty('stopListening') && owner !== this) {
						owner.stopListening(this, eventData.name, eventData.handler, eventData.once);
					}

					continue;
				}

				index++;
			}

			return this;
		}
	},

	trigger: {
		value(name, ...args) {
			if (!Array.isArray(this._eventData)) {
				return;
			}

			for (let index = 0, length = this._eventData.length; index < length; index++) {
				const eventData = this._eventData[index];
				if (eventData.name === name) {
					eventData.handler.call(eventData.owner, ...args);
				}
			}

			this.off(name, null, true);

			return this;
		}
	},

	listenTo: {
		value(other, name, handler, once = false) {
			if (!Array.isArray(this._eventListenData)) {
				this._eventListenData = [];
			}

			if (other.hasOwnProperty('on')) {
				this._eventListenData.push({ other, name, handler, once });
				other.on(name, handler, once, this);
			}

			return this;
		}
	},

	stopListeningTo: {
		value(other, name, handler, once) {
			if (!Array.isArray(this._eventListenData)) {
				return;
			}

			let index = 0;
			while (index < this._eventListenData.length) {
				const eventListData = this._eventListenData[index];
				if ((other === undefined || other === null || eventListData.other === other)
					&& (name === undefined || name === null || eventListData.name === name)
					&& (handler === undefined || handler === null || eventListData.handler === handler)
					&& (once === undefined || once === null || eventListData.once === once)) {

					if (eventListData.other.hasOwnProperty('off')) {
						this._eventListenData.splice(index, 1);
						eventListData.other.off(eventListData.name, eventListData.handler, eventListData.once, this, false);
					}

					continue;
				}

				index++;
			}

			return this;
		}
	}
};
