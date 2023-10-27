class GenerateDom {
	constructor(selfModule) {
		this.module = selfModule;
	}

	createDom() {
		const container = document.createElement('div');
		container.className = 'flex-container';

		this.module.lightsList.forEach(light => {
			container.appendChild(this.createOnOffButton(light));
		});

		container.appendChild(this.createModal());

		return container;
	}

	createOnOffButton(light) {
		const self = this;
		var button = document.createElement('button');

		button.innerHTML = light.name;
		button.className = 'hue-btn-on-off';
		button.setAttribute('on', light.on);

		button.addEventListener('click', function () {
			if (light.on) {
				self.module.sendSocketNotification('TURN_OFF_LIGHT', light.id);
				light.on = false;
			} else {
				self.module.sendSocketNotification('TURN_ON_LIGHT', light.id);
				light.on = true;
			}
			button.setAttribute('on', light.on);
		});

		return button;
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
