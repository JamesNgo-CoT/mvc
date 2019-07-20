const controlledPropertyDescriptor = {
	_controllerData: {
		writable: true
	},

	addController: {
		value(controller) {
			if (!Array.isArray(this._controllerData)) {
				this._controllerData = [];
			}

			this._controllerData.push(controller);

			return this;
		}
	},

	removeController: {
		value(controller, checkDuplicates = false) {
			if (!Array.isArray(this._controllerData)) {
				return;
			}

			const index = 0;
			while (index < this._controllerData.length) {
				const controllerData = this._controllerData[index];
				if (controller === controllerData) {
					this._controllerData.splice(index, 1);

					if (checkDuplicates) {
						continue;
					} else {
						break;
					}
				}

				index++;
			}
		}
	},

	callControllers: {
		value(method, ...args) {
			if (!Array.isArray(this._controllerData)) {
				return;
			}

			for (let index = 0, length = this._controllerData.length; index < length; index++) {
				const controller = this._controllerData[index];
				if (typeof controller[method] === 'function') {
					controller[method].call(controller, this, ...args);
				}
			}
		}
	}
}
