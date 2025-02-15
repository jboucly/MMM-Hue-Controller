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
		lightContainer.className = 'light-container';

		const spanLabel = document.createElement('span');
		spanLabel.className = 'light-label';
		spanLabel.innerHTML = light.name;

		const divBtnGroup = document.createElement('div');
		divBtnGroup.className = 'btn-group';

		if (light.type === 'color') {
			const button = document.createElement('button');
			button.type = 'button';
			button.id = `btn-modal-${light.id}`;
			button.className = 'color-btn';
			button.setAttribute('on', light.on);

			// eslint-disable-next-line no-undef
			this.moduleContainer.appendChild(new ColorModal(this.module, button, light).render());

			const img = document.createElement('img');
			img.src = this.module.file('./assets/imgs/palet-color.svg');
			img.alt = 'palet-color';
			img.className = 'img-palet-color';

			button.appendChild(img);
			divBtnGroup.appendChild(button);
		}

		lightContainer.appendChild(divBtnGroup);
		lightContainer.appendChild(spanLabel);

		// eslint-disable-next-line no-undef
		const sliderContainer = new Slider(this.module, light).render();
		divBtnGroup.appendChild(sliderContainer);

		return lightContainer;
	}
}
