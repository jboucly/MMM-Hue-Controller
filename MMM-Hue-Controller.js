/* Magic Mirror
 *
 * By gueguet57
 * MIT Licensed.
 */

Module.register('MMM-Hue-Controller', {
	defaults: {
		bridgeIp: '',
		user: '',
		lightsNumArray: '',
		themeArray: '',
	},

	// CSS
	getStyles: function () {
		return ['MMM-Hue-Controller.css'];
	},

	turnOffLights: function () {
		let lightArray = this.config.lightsNumArray;
		let self = this;

		lightArray.forEach(function (lightNum) {
			const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;
			console.log(hueUrl);
			self.sendSocketNotification('TURN_OFF_LIGHTS', hueUrl);
		});
	},

	turnOnLights: function () {
		let lightArray = this.config.lightsNumArray;
		let self = this;

		lightArray.forEach(function (lightNum) {
			const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;
			console.log(hueUrl);
			self.sendSocketNotification('TURN_ON_LIGHTS', hueUrl);
		});
	},

	createOnOffButton: function (action) {
		var button = document.createElement('button');
		button.innerHTML = action;
		button.className = 'hue-btn-on-off';

		var self = this;
		let lightArray = this.config.lightsNumArray;

		button.addEventListener('click', function () {
			switch (action) {
				case 'Turn Off':
					lightArray.forEach(function (lightNum) {
						const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;
						self.sendSocketNotification('TURN_OFF_LIGHTS', hueUrl);
					});
					break;
				case 'Turn On':
					lightArray.forEach(function (lightNum) {
						const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;
						self.sendSocketNotification('TURN_ON_LIGHTS', hueUrl);
					});
					break;
				default:
				// nothing
			}
		});
		return button;
	},

	creatThemeButton: function (theme) {
		var button = document.createElement('button');
		button.innerHTML = theme.themeName;
		button.className = 'hue-btn-theme';

		var self = this;
		let lightArray = this.config.lightsNumArray;

		button.addEventListener('click', function () {
			lightArray.forEach(function (lightNum) {
				const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;

				changeTheme = {
					hueUrl: hueUrl,
					theme: theme.themeValue,
				};

				// self.sendSocketNotification('CHANGE_THEME', hueUrl, theme);
				self.sendSocketNotification('CHANGE_THEME', changeTheme);
			});
		});

		return button;
	},

	// Override dom generator.
	getDom: function () {
		let hueBtnWrapper = document.createElement('div');
		hueBtnWrapper.className = 'hue-btn-ctn';

		let bueBtnWrapperFirstRow = document.createElement('div');
		bueBtnWrapperFirstRow.className = 'hue-btn-row';

		bueBtnWrapperFirstRow.appendChild(this.createOnOffButton('Turn Off'));
		bueBtnWrapperFirstRow.appendChild(this.createOnOffButton('Turn On'));
		hueBtnWrapper.appendChild(bueBtnWrapperFirstRow);

		let bueBtnWrapperSecondRow = document.createElement('div');
		bueBtnWrapperSecondRow.className = 'hue-btn-row';

		this.config.themeArray.forEach(theme => {
			bueBtnWrapperSecondRow.appendChild(this.creatThemeButton(theme));
		});

		hueBtnWrapper.appendChild(bueBtnWrapperSecondRow);

		return hueBtnWrapper;
	},

	// start
	start: function () {
		console.log('Starting module : MMM-Hue-Controller');
	},

	// notifications
	socketNotificationReceived: function (notification, payload) {
		if (notification === 'LIGHTS_TURNED_OFF') {
			console.log('TURNED OFF');
		}

		if (notification === 'LIGHTS_TURNED_ON') {
			console.log('TURNED ON');
		}

		if (notification === 'LIGHTS_THEME_CHANGED') {
			console.log('THEME CHANGED');
		}
	},
});
