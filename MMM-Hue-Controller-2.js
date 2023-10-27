Module.register('MMM-Hue-Controller-2', {
	defaults: {
		user: '',
		bridgeIp: '',
		colors: ['#ff0000', '#40A347', '#2DA7E4', '#FF00FF', '#50e8ff', '#94c930', '#86bc39'],
	},
	lightsList: [],
	lightsListRequested: false,

	getStyles: function () {
		return [
			this.file('./assets/styles/MMM-Hue-Controller.css'),
			this.file('./assets/styles/modal.css'),
			this.file('./assets/styles/slider.css'),
		];
	},

	getScripts: function () {
		return [
			this.file('./assets/js/slider.js'),
			this.file('./assets/js/color-modal.js'),
			this.file('./assets/js/generate-dom.js'),
		];
	},

	start: function () {
		Log.info('Starting module : MMM-Hue-Controller-2');
		this.sendSocketNotification('CONFIGS', this.config);
		this.sendSocketNotification('GET_ALL_LIGHTS');

		// Refresh DOM every 10 seconds for update lights status
		// setInterval(() => {
		// 	this.sendSocketNotification('GET_ALL_LIGHTS');
		// }, 10000);
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

	getDom: function () {
		if (this.lightsList?.length === 0) {
			const pElem = document.createElement('p');
			pElem.innerHTML = 'No lights found. Waiting...';
			return pElem;
		} else {
			// eslint-disable-next-line no-undef
			return new GenerateDom(this).createDom();
		}
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
