const controlledPropertyDescriptor = {
	controllerData: {
		writable: true
	},

	addController: {
		value(controller) {
			if (!Array.isArray(this.controllerData)) {
				this.controllerData = [];
			}

			this.controller.push(controller);

			return this;
		}
	},

	removeController: {
		value(controller, checkDuplicates = false) {
			if (!Array.isArray(this.controllerData)) {
				return;
			}

			const index = 0;
			while (index < this.controllerData.length) {
				const controllerData = this.controllerData[index];
				if (controller === controllerData) {
					this.controllerData.splice(index, 1);

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
			if (!Array.isArray(this.controllerData)) {
				return;
			}

			for (let index = 0, length = this.controllerData.length; index < length; index++) {
				const controller = this.controllerData[index];
				if (typeof controller[method] === 'function') {
					controller[method].call(controller, this, ...args);
				}
			}
		}
	}
}
