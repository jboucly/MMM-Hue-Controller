const slider = document.getElementById("brightness-slider");
const sliderLabel = document.querySelector(".slider-label");

let isOn = true;
let isDragging = false;
let timerStart = null;

const event = document.addEventListener("colorChange", (e) => {
  const color = e.detail;
  slider.style.setProperty(
    "--slider-background",
    `linear-gradient(to top, ${color} 0%, rgba(255, 255, 255, 1) 100%)`
  );
});

function moveSlider(clientY) {
  if (isDragging) {
    const sliderHeight = slider.clientHeight;
    const mouseY = clientY - slider.getBoundingClientRect().top;
    let newValue = Math.max(
      0,
      Math.min(100, 100 - (mouseY / sliderHeight) * 100)
    );

    if (newValue === 0) {
      newValue = 1;
    }

    slider.style.top = `${100 - newValue}%`;
    sliderLabel.textContent = `${Math.round(newValue)}%`;
  }
}

function toggleSlider() {
  if (new Date().getTime() - timerStart < 100) {
    if (isOn) {
      slider.style.setProperty("--slider-background", "grey");
    } else {
      slider.style.setProperty(
        "--slider-background",
        "linear-gradient(to top, rgba(242, 247, 0, 1) 0%, rgba(247, 255, 165, 1) 100%)"
      );
    }

    isOn = !isOn;
  }
}

// Mouse Events
slider.addEventListener("mousedown", (e) => {
  timerStart = new Date().getTime();

  isDragging = true;
  e.preventDefault();
});

document.addEventListener("mouseup", () => {
  toggleSlider();

  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  moveSlider(e.clientY);
});

// Mobile Events
slider.addEventListener("touchstart", (e) => {
  timerStart = new Date().getTime();

  isDragging = true;
  e.preventDefault();
});

document.addEventListener("touchend", () => {
  toggleSlider();
  isDragging = false;
});

document.addEventListener("touchmove", (e) => {
  moveSlider(e.touches[0].clientY);
});

// Initial brightness
isOn = true;
slider.style.top = "50%";
sliderLabel.textContent = "50%";
