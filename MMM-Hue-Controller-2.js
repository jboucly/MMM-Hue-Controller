Module.register('MMM-Hue-Controller-2', {
	defaults: {
		user: '',
		bridgeIp: '',
	},
	lightsList: [],
	lightsListRequested: false,

	start: function () {
		Log.info('Starting module : MMM-Hue-Controller-2');
		this.sendSocketNotification('CONFIGS', this.config);
		this.sendSocketNotification('GET_ALL_LIGHTS');

		// Refresh DOM every 10 seconds for update lights status
		setInterval(() => {
			this.sendSocketNotification('GET_ALL_LIGHTS');
		}, 10000);
	},

	notificationReceived: function (notification, payload, sender) {
		switch (notification) {
			case 'HUE_GET_ALL_LIGHTS':
				if (this.lightsList?.length === 0) {
					this.sendSocketNotification('GET_ALL_LIGHTS');
					this.lightsListRequested = true;
				} else {
					this.sendNotification('HUE_LIGHTS_LIST', this.lightsList);
				}
				break;
			case 'HUE_TURN_ON_LIGHT':
				this.sendSocketNotification('TURN_ON_LIGHT', this.checkPayloadOonOffIsString(payload));
				break;
			case 'HUE_TURN_OFF_LIGHT':
				this.sendSocketNotification('TURN_OFF_LIGHT', this.checkPayloadOonOffIsString(payload));
				break;
		}
	},

	socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case 'GET_CONFIGS':
				this.sendSocketNotification('CONFIGS', this.config);
				break;
			case 'LIGHTS_LIST':
				this.lightsList = payload;
				this.updateDom();

				if (this.lightsListRequested) {
					this.lightsListRequested = false;
					this.sendNotification('HUE_LIGHTS_LIST', this.lightsList);
				}
				break;
		}
	},

	getStyles: function () {
		return ['MMM-Hue-Controller.css'];
	},

	getDom: function () {
		if (this.lightsList?.length === 0) {
			const pElem = document.createElement('p');
			pElem.innerHTML = 'No lights found. Waiting...';
			return pElem;
		} else {
			const container = document.createElement('div');
			container.className = 'flex-container';

			this.lightsList.forEach(light => {
				container.appendChild(this.createOnOffButton(light));
			});

			return container;
		}
	},

	createOnOffButton: function (light) {
		var self = this;
		var button = document.createElement('button');
		button.innerHTML = light.name;
		button.className = 'hue-btn-on-off';
		button.setAttribute('on', light.on);

		button.addEventListener('click', function () {
			if (light.on) {
				self.sendSocketNotification('TURN_OFF_LIGHT', light.id);
				light.on = false;
			} else {
				self.sendSocketNotification('TURN_ON_LIGHT', light.id);
				light.on = true;
			}
			button.setAttribute('on', light.on);
		});

		return button;
	},

	// ——— UTILS ———————————————————————————————————————————————————————————

	checkPayloadOonOffIsString: function (payload) {
		if (typeof payload === 'string') {
			return payload;
		} else {
			throw new Error('Payload to switch on/off is not a string');
		}
	},
});
