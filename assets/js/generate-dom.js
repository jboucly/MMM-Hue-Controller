class GenerateDom {
	constructor(selfModule) {
		this.module = selfModule;

		this.moduleContainer = null;
	}

	createDom() {
		this.moduleContainer = document.createElement('div');
		this.moduleContainer.className = 'flex-container';

		this.module.lightsList.forEach(light => {
			this.moduleContainer.appendChild(this.createLight(light));
		});

		return this.moduleContainer;
	}

	createLight(light) {
		const lightContainer = document.createElement('div');
		lightContainer.className = 'btn-group';

		const button = document.createElement('button');
		button.type = 'button';
		button.id = `btn-modal-${light.id}`;
		button.className = 'color-btn';
		button.setAttribute('on', light.on);

		// eslint-disable-next-line no-undef
		this.moduleContainer.appendChild(new ColorModal(this.module, button, light).createModal());

		const img = document.createElement('img');
		img.src = this.module.file('./assets/imgs/palet-color.svg');
		img.alt = 'palet-color';
		img.className = 'img-palet-color';

		button.appendChild(img);
		lightContainer.appendChild(button);

		// eslint-disable-next-line no-undef
		const sliderContainer = new Slider(this.module, light).createSlider();
		lightContainer.appendChild(sliderContainer);

		return lightContainer;
	}
}
