Module.register('MMM-Hue-Controller', {
	defaults: {
		user: '',
		bridgeIp: '',
	},
	lightsList: [],

	start: function () {
		console.log('Starting module : MMM-Hue-Controller');
		this.sendSocketNotification('CONFIGS', this.config);
		this.sendSocketNotification('GET_ALL_LIGHTS');
	},

	socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case 'GET_CONFIGS':
				this.sendSocketNotification('CONFIGS', this.config);
				break;
			case 'LIGHTS_LIST':
				this.lightsList = payload;
				this.updateDom();
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
});
