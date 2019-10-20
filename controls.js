'use strict';

let startAnimation;
let stopAnimation;

window.onload = () => {
  setupAlgorithmDropdown();
  setupSeedTypes();
  setupStartStopBtn();
};

const setupAlgorithmDropdown = () => {
  const dropdown = document.getElementById('sort_algo');
  const selectButton = dropdown.getElementsByClassName('mdl-select')[0];
  const options = dropdown.querySelector('.mdl-js-menu');

  selectButton.addEventListener('click', () => {
    options.MaterialMenu.show();
  });

  const generateOptionHTML = name => `
    <li class="mdl-menu__item" data-val="${name}">
      ${name}
    </li>
  `;

  options.innerHTML = Object.keys(SORT_CLASSES)
    .map(generateOptionHTML)
    .join('');

  options.addEventListener('click', e =>
    updateSelectedAlgorithm(e.target.getAttribute('data-val'))
  );

  updateSelectedAlgorithm(DEFAULT_ALGO);
};

const updateSelectedAlgorithm = name => {
  const selectValue = document.getElementById('select-value');
  selectValue.innerText = name;
  selectValue.setAttribute('value', name);
};

const setupSeedTypes = () => {
  const chipContainer = document.getElementById('seed-types');

  const generateChipHTML = name =>
    `<span class="mdl-chip">
      <label
        class="mdl-radio mdl-js-radio mdl-js-ripple-effect initial-data-options" 
        for="data-${name.replace(' ', '-')}"
        value="${name}"
      >
        <input
          type="radio"
          id="data-${name.replace(' ', '-')}"
          class="mdl-radio__button"
          name="initial-data"
          ${DEFAULT_ARRANGEMENT === name ? 'checked' : ''}
        />
      </label>
      <span class="mdl-chip__text">${name}</span>
    </span>`;

  chipContainer.innerHTML = Object.keys(INITIAL_DATA)
    .map(generateChipHTML)
    .join('');
};

const setupStartStopBtn = () => {
  const startStopBtn = document.getElementById('control__start-stop');
  startAnimation = _startAnimation(startStopBtn);
  stopAnimation = _stopAnimation(startStopBtn);

  startStopBtn.addEventListener('click', e => {
    if (e.target.offsetParent.getAttribute('data-action') === 'start') {
      const selectValue = document
        .getElementById('select-value')
        .getAttribute('value');
      const selectedLabel = Array.from(
        document.getElementsByClassName('initial-data-options')
      )
        .filter(element => element.className.includes('is-checked'))[0]
        .getAttribute('value');

      startAnimation(selectValue, selectedLabel);
    } else {
      stopAnimation();
    }
  });
};

const _startAnimation = btn => (algo, arrangement) => {
  loop();
  btn.setAttribute('data-action', 'stop');
  btn.childNodes[1].childNodes[0].nodeValue = 'stop';

  startSorting(algo, arrangement);
};

const _stopAnimation = btn => (finished = false) => {
  btn.setAttribute('data-action', 'start');
  btn.childNodes[1].childNodes[0].nodeValue = 'play_arrow';
  if (!finished) {
    noLoop();
  }
};

const redirectToGithub = () => {
  window.open(GITHUB_URL, '_blank');
};
