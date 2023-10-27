class Slider {
	constructor(selfModule, light) {
		this.module = selfModule;
		this.light = light;
		this.isDragging = false;
		this.timerStart = null;

		this.slider = null;
		this.sliderLabel = null;
		this.colorChangeEvent = null;
	}

	createSlider() {
		const sliderContainer = document.createElement('div');
		sliderContainer.className = 'slider-container';

		this.slider = document.createElement('div');
		this.slider.id = 'brightness-slider';
		this.slider.className = 'slider';
		this.slider.setAttribute('data-before', '');

		this.sliderLabel = document.createElement('div');
		this.sliderLabel.className = 'slider-label';

		this.setSliderPosition();

		this.slider.style.setProperty(
			'--slider-background',
			!this.light.on ? 'grey' : `linear-gradient(to top, ${this.light.color} 0%, rgba(255, 255, 255, 1) 100%)`
		);

		sliderContainer.appendChild(this.slider);
		sliderContainer.appendChild(this.sliderLabel);

		this.addEvents();

		return sliderContainer;
	}

	/**
	 * 10% = 25
	 * 20% = 51
	 * 30% = 77
	 * 40% = 102
	 * 50% = 128
	 * 60% = 153
	 * 70% = 179
	 * 80% = 205
	 * 90% = 230
	 * 100% = 255
	 */
	setSliderPosition() {
		const brightness = this.light.brightness;

		if (brightness < 25) {
			this.slider.style.top = '100%';
			this.sliderLabel.textContent = '1%';
		} else if (brightness >= 25 && brightness < 51) {
			this.slider.style.top = '90%';
			this.sliderLabel.textContent = '10%';
		} else if (brightness >= 51 && brightness < 77) {
			this.slider.style.top = '80%';
			this.sliderLabel.textContent = '20%';
		} else if (brightness >= 77 && brightness < 102) {
			this.slider.style.top = '70%';
			this.sliderLabel.textContent = '30%';
		} else if (brightness >= 102 && brightness < 128) {
			this.slider.style.top = '60%';
			this.sliderLabel.textContent = '40%';
		} else if (brightness >= 128 && brightness < 153) {
			this.slider.style.top = '50%';
			this.sliderLabel.textContent = '450%';
		} else if (brightness >= 153 && brightness < 179) {
			this.slider.style.top = '40%';
			this.sliderLabel.textContent = '60%';
		} else if (brightness >= 179 && brightness < 205) {
			this.slider.style.top = '30%';
			this.sliderLabel.textContent = '70%';
		} else if (brightness >= 205 && brightness < 230) {
			this.slider.style.top = '20%';
			this.sliderLabel.textContent = '80%';
		} else if (brightness >= 230 && brightness < 254) {
			this.slider.style.top = '10%';
			this.sliderLabel.textContent = '90%';
		} else if (brightness >= 254 && brightness <= 255) {
			this.slider.style.top = '0%';
			this.sliderLabel.textContent = '100%';
		}
	}

	addEvents() {
		this.colorChangeEvent = document.addEventListener(`changeColor${this.light.id}`, e => {
			const color = e.detail;
			this.slider.style.setProperty(
				'--slider-background',
				`linear-gradient(to top, ${color} 0%, rgba(255, 255, 255, 1) 100%)`
			);

			this.module.sendSocketNotification('CHANGE_COLOR', {
				id: this.light.id,
				color,
			});
		});

		this.addMouseEvents();
		this.addMobileEvents();
	}

	addMouseEvents() {
		this.slider.addEventListener('mousedown', e => {
			this.timerStart = new Date().getTime();

			this.isDragging = true;
			e.preventDefault();
		});

		document.addEventListener('mouseup', () => {
			this.toggleSlider();
			this.isDragging = false;
		});

		document.addEventListener('mousemove', e => {
			this.moveSlider(e.clientY);
		});
	}

	addMobileEvents() {
		this.slider.addEventListener('touchstart', e => {
			this.timerStart = new Date().getTime();

			this.isDragging = true;
			e.preventDefault();
		});

		document.addEventListener('touchend', () => {
			this.toggleSlider();
			this.isDragging = false;
		});

		document.addEventListener('touchmove', e => {
			this.moveSlider(e.touches[0].clientY);
		});
	}

	moveSlider(clientY) {
		if (this.isDragging) {
			const sliderHeight = this.slider.clientHeight;
			const mouseY = clientY - this.slider.getBoundingClientRect().top;
			let newValue = this.getRoundedValue(mouseY, sliderHeight);

			if (newValue === 0) {
				newValue = 1;
			}

			this.slider.style.top = `${100 - newValue}%`;
			this.sliderLabel.textContent = `${newValue}%`;

			this.module.sendSocketNotification('CHANGE_BRIGHTNESS', {
				id: this.light.id,
				brightness: newValue,
			});

			if (!this.light.on) {
				this.slider.style.setProperty(
					'--slider-background',
					`linear-gradient(to top, ${this.light.color}, rgba(247, 255, 165, 1) 100%)`
				);
				this.light.on = true;
			}
		}
	}

	getRoundedValue(y, height) {
		const range = 100;
		const pixelStep = height / range;
		const value = 100 - y / pixelStep;
		const roundedValue = Math.round(value / 10) * 10;
		return Math.max(0, Math.min(100, roundedValue));
	}

	toggleSlider() {
		if (new Date().getTime() - this.timerStart < 100) {
			if (this.light.on) {
				this.module.sendSocketNotification('TURN_OFF_LIGHT', this.light.id);
				this.slider.style.setProperty('--slider-background', 'grey');
			} else {
				this.module.sendSocketNotification('TURN_ON_LIGHT', this.light.id);
				this.slider.style.setProperty(
					'--slider-background',
					`linear-gradient(to top, ${this.light.color}, rgba(247, 255, 165, 1) 100%)`
				);
			}

			this.light.on = !this.light.on;
		}
	}
}
