class ColorModal {
	constructor(selfModule, buttonElement, light) {
		this.light = light;
		this.module = selfModule;
		this.buttonElement = buttonElement;

		this.modal = null;
		this.closeSpan = null;
	}

	createModal() {
		this.modal = document.createElement('div');
		this.modal.id = 'color-modal';
		this.modal.className = 'modal';

		const modalTitle = document.createElement('div');
		modalTitle.className = 'modal-title';
		modalTitle.innerHTML = 'Choose a color';

		this.closeSpan = document.createElement('span');
		this.closeSpan.className = 'close';
		this.closeSpan.innerHTML = '&times;';

		modalTitle.appendChild(this.closeSpan);
		this.modal.appendChild(modalTitle);

		const modalContent = document.createElement('div');
		modalContent.className = 'modal-content';

		const modalContainer = document.createElement('div');
		modalContainer.id = 'modal-container';

		this.setAllColors(modalContainer);

		modalContent.appendChild(modalContainer);
		this.modal.appendChild(modalContent);

		this.addGlobalEvent();
		this.addEvent();

		return this.modal;
	}

	setAllColors(modalContainer) {
		this.module.config.colors.forEach(color => {
			const div = document.createElement('div');
			div.classList.add('color');
			div.style.backgroundColor = color;

			div.addEventListener('click', () => {
				document.dispatchEvent(new CustomEvent(`changeColor${this.light.id}`, { detail: color }));
				this.modal.style.display = 'none';
			});

			modalContainer.appendChild(div);
		});
	}

	addEvent() {
		this.buttonElement.addEventListener('click', () => {
			this.modal.style.display = 'block';
		});

		this.closeSpan.addEventListener('click', () => {
			this.modal.style.display = 'none';
		});
	}

	addGlobalEvent() {
		window.onclick = function (event) {
			if (event.target === this.modal) {
				this.modal.style.display = 'none';
			}
		};
	}
}
