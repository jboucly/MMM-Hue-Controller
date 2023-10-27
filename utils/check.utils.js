module.exports = {
	checkConfigExist: async function () {
		if (this.configs === undefined) {
			this.sendSocketNotification('GET_CONFIGS');
		}
	},

	getUrlAllLights: function () {
		this.checkConfigExist();
		return `http://${this.configs.bridgeIp}/api/${this.configs.user}/lights`;
	},

	getUrlToChangeStateOfLight: function (id) {
		this.checkConfigExist();
		return `http://${this.configs.bridgeIp}/api/${this.configs.user}/lights/${id}/state`;
	},
};
