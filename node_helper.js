const Log = require('logger');
const fetch = require('node-fetch');
const NodeHelper = require('node_helper');
const CheckUtils = require('./utils/check.utils');
const HueUtils = require('./utils/hue.utils');

module.exports = NodeHelper.create({
	configs: undefined,
	...CheckUtils,
	...HueUtils,

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
			case 'CHANGE_BRIGHTNESS':
				await this.changeBrightness(payload);
				break;
			case 'CHANGE_COLOR':
				await this.changeColor(payload);
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
				brightness: value.state.bri,
				type: value.type.includes('Extended color light') ? 'color' : 'white',
				color: value.type.includes('Extended color light')
					? this.xyToHex(value.state.xy[0], value.state.xy[1])
					: 'rgba(242, 247, 0, 1)',
			});
		});

		self.sendSocketNotification('LIGHTS_LIST', allLights);
	},

	turnOffOrOnLights: async function (id, state) {
		try {
			await fetch(this.getUrlToChangeStateOfLight(id), {
				method: 'PUT',
				body: JSON.stringify({
					on: state,
				}),
			});
		} catch (error) {
			Log.error(error);
		}
	},

	changeBrightness: async function (payload) {
		let brightness;

		switch (payload.brightness) {
			case 1:
				brightness = 1;
				break;
			case 10:
				brightness = 25;
				break;
			case 20:
				brightness = 51;
				break;
			case 30:
				brightness = 77;
				break;
			case 40:
				brightness = 102;
				break;
			case 50:
				brightness = 128;
				break;
			case 60:
				brightness = 153;
				break;
			case 70:
				brightness = 179;
				break;
			case 80:
				brightness = 205;
				break;
			case 90:
				brightness = 230;
				break;
			case 100:
				brightness = 254;
				break;
			default:
				brightness = 254;
				break;
		}

		try {
			await fetch(this.getUrlToChangeStateOfLight(payload.id), {
				method: 'PUT',
				body: JSON.stringify({
					on: true,
					bri: brightness,
				}),
			});
		} catch (error) {
			Log.error(error);
		}
	},

	changeColor: async function (payload) {
		try {
			await fetch(this.getUrlToChangeStateOfLight(payload.id), {
				method: 'PUT',
				body: JSON.stringify({
					on: true,
					xy: this.hexToXY(payload.color),
				}),
			});
		} catch (error) {
			Log.error(error);
		}
	},
});
