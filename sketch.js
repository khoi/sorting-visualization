'use strict';

let N;
let M;

let values;
let sorters;
let sortersFinished;
let capturer = new CCapture({ format: 'png', framerate: FRAME_RATE });
let isRecording = false;
let sortedSeed, reverseSeed, partialSortedSeed;

function setup() {
  const headerHeight = document.getElementsByClassName('mdl-layout__header')[0]
    .offsetHeight;
  const canvas = createCanvas(windowWidth, windowHeight - headerHeight);
  canvas.parent('visualization');
  colorMode(HSL, 360, 100, 100);
  frameRate(FRAME_RATE);

  N = Math.floor(width / TILE_SIZE);
  M = Math.floor(height / TILE_SIZE);
  values = new Array(M);
  sorters = new Array(M);

  let number = 0;
  sortedSeed = Array.from(Array(N), item => number++);

  startSorting();

  textSize(20);
  textStyle(BOLD);
  textAlign(RIGHT);
}

function startSorting(
  algorithm = DEFAULT_ALGO,
  arrangement = DEFAULT_ARRANGEMENT
) {
  values = new Array(M);
  sorters = new Array(M);
  sortersFinished = new Array(M);

  for (let i = 0; i < M; i++) {
    values[i] = INITIAL_DATA[arrangement](sortedSeed);
    sorters[i] = SORT_CLASSES[algorithm](values[i]);
    sortersFinished[i] = false;
  }
}

function draw() {
  for (let i = 0; i < M; i++) {
    if (sorters[i].next().done) {
      sortersFinished[i] = true;
      continue;
    }
    for (let j = 0; j < N; j++) {
      let c = color(map(values[i][j], 0, N, 0, 360), 100, 50);
      stroke(c);
      fill(c);
      square(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE);
    }
  }

  if (sortersFinished.every(finished => finished)) {
    stopAnimation(true);
  }

  if (isRecording) {
    capturer.capture(document.getElementById('defaultCanvas0'));
    if (sortersFinished.every(finished => finished)) {
      stopRecording();
      noLoop();
    }
  }

  if (DRAW_FRAMERATE) drawFrameRate();
}

function startRecording() {
  capturer.start();
  isRecording = true;
}

function stopRecording() {
  capturer.stop();
  capturer.save();
}

function drawFrameRate() {
  fill(255, 0, 0);
  text(Math.floor(frameRate()), width - 30, 30);
}
