var NodeHelper = require('node_helper');
const fetch = require('node-fetch');
const CheckUtils = require('./utils/check.utils');

module.exports = NodeHelper.create({
	...CheckUtils,

	configs: undefined,

	init: function () {
		console.log('MMM-Hue-Controller module helper initialized.');
	},

	socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case 'TURN_OFF_LIGHTS':
				this.turnOffAllLights(payload);
				break;
			case 'TURN_ON_LIGHTS':
				this.turnOnAllLights(payload);
				break;
			case 'CHANGE_THEME':
				this.changeThemeAllLights(payload);
				break;
			case 'CONFIGS':
				this.configs = payload;
				break;
		}
	},

	turnOffAllLights: function (url) {
		var self = this;
		this.checkConfigExist();

		fetch(url, {
			method: 'PUT',
			body: JSON.stringify({
				on: false,
			}),
		})
			.then(results => {
				self.sendSocketNotification('LIGHTS_TURNED_OFF', results);
			})
			.catch(error => {
				self.sendSocketNotification('LIGHTS_TURNED_OFF', error);
			});
	},

	turnOnAllLights: function (url) {
		let self = this;
		this.checkConfigExist();

		fetch(url, {
			method: 'PUT',
			body: JSON.stringify({
				on: true,
			}),
		})
			.then(results => {
				self.sendSocketNotification('LIGHTS_TURNED_ON', results);
			})
			.catch(error => {
				self.sendSocketNotification('LIGHTS_TURNED_ON', error);
			});
	},

	changeThemeAllLights: function (changeTheme) {
		let self = this;
		this.checkConfigExist();

		fetch(changeTheme.hueUrl, {
			method: 'PUT',
			body: JSON.stringify(changeTheme.theme),
		})
			.then(results => {
				self.sendSocketNotification('LIGHTS_THEME_CHANGED', results);
			})
			.catch(error => {
				self.sendSocketNotification('LIGHTS_THEME_CHANGED', error);
			});
	},
});
