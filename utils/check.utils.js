module.exports = {
	checkConfigExist: function () {
		if (this.configs === undefined) {
			this.sendSocketNotification('GET_CONFIGS');
		}
	},
};
