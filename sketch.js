const FRAME_RATE = 60;
const CONTROL_HEIGHT = 20;
const TILE_WIDTH = 20;
const DRAW_FRAMERATE = false;
const DEFAULT_ALGO = "mergeSort";

const SORT_CLASSES = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  "quickSort (hoare)": quickSortHoare,
  "quickSort (lomuto)": quickSortLomuto,
  bogoSort: bogoSort,
  mergeSort: mergeSort
};

let N;
let M;

let values;
let sorters;
let sortersFinished;
let capturer = new CCapture({ format: "png", framerate: FRAME_RATE });
let isRecording = false;
let sel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL, 360, 100, 100);
  frameRate(FRAME_RATE);

  setupInput(DEFAULT_ALGO);

  N = Math.floor(width / TILE_WIDTH);
  M = Math.floor(height / TILE_WIDTH);

  values = new Array(M);
  sorters = new Array(M);

  startSorting(DEFAULT_ALGO);

  textSize(20);
  textStyle(BOLD);
  textAlign(RIGHT);
}

function setupInput(initialValue) {
  sel = createSelect();
  sel.position(10, 10);
  Object.keys(SORT_CLASSES).forEach(k => {
    sel.option(k);
  });
  sel.value(initialValue);
  sel.changed(() => startSorting(sel.value()));
}

function startSorting(algorithm) {
  values = new Array(M);
  sorters = new Array(M);
  sortersFinished = new Array(M);

  for (let i = 0; i < M; i++) {
    values[i] = new Array(N);
    for (let j = 0; j < N; j++) {
      values[i][j] = j;
    }
    shuffle(values[i], true);
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
      rect(j * TILE_WIDTH, i * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
    }
  }

  if (isRecording) {
    capturer.capture(document.getElementById("defaultCanvas0"));
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
