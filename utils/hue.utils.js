module.exports = {
	hexToXY: function (hexColor) {
		// Remove the "#" symbol if it is present in the hexadecimal color
		const newHexColor = hexColor.replace(/^#/, '');

		// Convert the hexadecimal color to RGB values
		const r = parseInt(newHexColor.slice(0, 2), 16) / 255;
		const g = parseInt(newHexColor.slice(2, 4), 16) / 255;
		const b = parseInt(newHexColor.slice(4, 6), 16) / 255;

		// Convert the RGB values to XYZ values
		const X = r * 0.649926 + g * 0.103455 + b * 0.197109;
		const Y = r * 0.234327 + g * 0.743075 + b * 0.022598;
		const Z = r * 0.0 + g * 0.053077 + b * 1.035763;

		// Calculate the XY values from the XYZ values
		const x = X / (X + Y + Z);
		const y = Y / (X + Y + Z);

		return [x, y];
	},

	xyToHex: function (x, y) {
		// Convert the xy values to XYZ values
		const z = 1.0 - x - y;
		const Y = 1.0; // La luminosité Y est fixée à 1
		const X = (Y / y) * x;
		const Z = (Y / y) * z;

		// Convert the XYZ values to RGB values
		let r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
		let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
		let b = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

		// Make sure the RGB values are within the range 0-1
		r = Math.min(1, Math.max(0, r));
		g = Math.min(1, Math.max(0, g));
		b = Math.min(1, Math.max(0, b));

		// Convert the RGB values to hexadecimal values
		const rHex = Math.round(r * 255)
			.toString(16)
			.padStart(2, '0');
		const gHex = Math.round(g * 255)
			.toString(16)
			.padStart(2, '0');
		const bHex = Math.round(b * 255)
			.toString(16)
			.padStart(2, '0');

		return `#${rHex}${gHex}${bHex}`;
	},
};
