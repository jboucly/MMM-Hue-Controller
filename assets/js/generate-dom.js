class GenerateDom {
	constructor(selfModule) {
		this.module = selfModule;
	}

	createDom() {
		const container = document.createElement('div');
		container.className = 'flex-container';

		this.module.lightsList.forEach(light => {
			container.appendChild(this.createLight(light));
		});

		container.appendChild(this.createModal());

		return container;
	}

	createLight(light) {
		const lightContainer = document.createElement('div');
		lightContainer.className = 'btn-group';

		const button = document.createElement('button');
		button.type = 'button';
		button.id = 'btn-modal';
		button.className = 'color-btn';
		button.setAttribute('on', light.on);

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

	createModal() {
		const modal = document.createElement('div');
		modal.id = 'color-modal';
		modal.className = 'modal';

		const modalTitle = document.createElement('div');
		modalTitle.className = 'modal-title';
		modalTitle.innerHTML = 'Choose a color';

		const closeSpan = document.createElement('span');
		closeSpan.className = 'close';
		closeSpan.innerHTML = '&times;';
		closeSpan.addEventListener('click', () => {
			modal.style.display = 'none';
		});

		modalTitle.appendChild(closeSpan);
		modal.appendChild(modalTitle);

		const modalContent = document.createElement('div');
		modalContent.className = 'modal-content';

		const modalContainer = document.createElement('div');
		modalContainer.id = 'modal-container';

		modalContent.appendChild(modalContainer);
		modal.appendChild(modalContent);

		return modal;
	}
}
