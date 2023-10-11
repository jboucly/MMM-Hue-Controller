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

	start: function () {
		console.log('Starting module : MMM-Hue-Controller');
		this.sendSocketNotification('CONFIGS', this.config);
	},

	socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case 'LIGHTS_TURNED_OFF':
				console.info('[Hue] - TURNED OFF');
				break;
			case 'LIGHTS_TURNED_ON':
				console.info('[Hue] - TURNED ON');
				break;
			case 'LIGHTS_THEME_CHANGED':
				console.info('[Hue] - THEME CHANGED');
				break;
			case 'GET_CONFIGS':
				this.sendSocketNotification('CONFIGS', this.config);
				break;
		}
	},

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
			bueBtnWrapperSecondRow.appendChild(this.createThemeButton(theme));
		});

		hueBtnWrapper.appendChild(bueBtnWrapperSecondRow);

		return hueBtnWrapper;
	},

	getStyles: function () {
		return ['MMM-Hue-Controller.css'];
	},

	// turnOffLights: function () {
	// 	let lightArray = this.config.lightsNumArray;
	// 	let self = this;

	// 	lightArray.forEach(function (lightNum) {
	// 		const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;
	// 		console.log(hueUrl);
	// 		self.sendSocketNotification('TURN_OFF_LIGHTS', hueUrl);
	// 	});
	// },

	// turnOnLights: function () {
	// 	let lightArray = this.config.lightsNumArray;
	// 	let self = this;

	// 	lightArray.forEach(function (lightNum) {
	// 		const hueUrl = `http://${self.config.bridgeIp}/api/${self.config.user}/lights/${lightNum}/state`;
	// 		console.log(hueUrl);
	// 		self.sendSocketNotification('TURN_ON_LIGHTS', hueUrl);
	// 	});
	// },

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
			}
		});
		return button;
	},

	createThemeButton: function (theme) {
		var button = document.createElement('button');
		button.innerHTML = theme.themeName;
		button.className = 'hue-btn-theme';

		var self = this;
		let lightArray = this.config.lightsNumArray;

		let changeTheme;

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
});
