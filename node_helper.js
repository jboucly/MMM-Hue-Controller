var NodeHelper = require('node_helper');

const fetch = require('node-fetch');

module.exports = NodeHelper.create({
	turnOffAllLights: function (url) {
		var self = this;
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

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'TURN_OFF_LIGHTS') {
			this.turnOffAllLights(payload);
		}

		if (notification === 'TURN_ON_LIGHTS') {
			this.turnOnAllLights(payload);
		}

		if (notification == 'CHANGE_THEME') {
			this.changeThemeAllLights(payload);
		}
	},
});
