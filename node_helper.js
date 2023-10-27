const Log = require('logger');
const fetch = require('node-fetch');
const NodeHelper = require('node_helper');
const CheckUtils = require('./utils/check.utils');

module.exports = NodeHelper.create({
	configs: undefined,
	...CheckUtils,

	init: function () {
		Log.info('MMM-Hue-Controller-2 module helper initialized.');
	},

	socketNotificationReceived: async function (notification, payload) {
		switch (notification) {
			case 'CONFIGS':
				this.configs = payload;
				break;
			case 'GET_ALL_LIGHTS':
				await this.sendAllLights();
				break;
			case 'TURN_OFF_LIGHT':
				await this.turnOffOrOnLights(payload, false);
				break;
			case 'TURN_ON_LIGHT':
				await this.turnOffOrOnLights(payload, true);
				break;
		}
	},

	sendAllLights: async function () {
		var self = this;
		const allLights = [];

		const res = await fetch(this.getUrlAllLights(), { method: 'GET' });

		Object.entries(await res.json()).forEach(([key, value]) => {
			allLights.push({
				id: key,
				name: value.name,
				on: value.state.on,
				type: value.type.includes('Extended color light') ? 'color' : 'white',
			});
		});

		self.sendSocketNotification('LIGHTS_LIST', allLights);
	},

	turnOffOrOnLights: async function (id, state) {
		try {
			await fetch(this.getUrlToTurnOffLights(id), {
				method: 'PUT',
				body: JSON.stringify({
					on: state,
				}),
			});
		} catch (error) {
			Log.error(error);
		}
	},
});
