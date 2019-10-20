const FRAME_RATE = 60;
const CONTROL_HEIGHT = 20;
const TILE_SIZE = 20;
const DRAW_FRAMERATE = true;
const PARTIAL_SHUFFLE_FACTOR = 23;
const DEFAULT_ALGO = 'radixSort (LSD)';
const DEFAULT_ARRANGEMENT = 'partially sorted';
const GITHUB_URL = 'https://github.com/khoi/sorting-visualization';

const SORT_CLASSES = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  'quickSort (hoare)': quickSortHoare,
  'quickSort (lomuto)': quickSortLomuto,
  bogoSort: bogoSort,
  mergeSort: mergeSort,
  heapSort: heapSort,
  shellSort: shellSort,
  'radixSort (LSD)': radixSortLSD,
  combSort: combSort,
};

const INITIAL_DATA = {
  random: array => shuffle([...array], false),
  'partially sorted': array => shufflePartial([...array]),
  'reverse sorted': array => [...array].reverse(),
};

const shufflePartial = array => {
  const len = array.length;

  for (
    let i = 0, minIndex = 0, maxIndex = PARTIAL_SHUFFLE_FACTOR;
    i < len;
    i++
  ) {
    let newIndex =
      (Math.floor(Math.random() * PARTIAL_SHUFFLE_FACTOR) + minIndex) % N;
    let a = array[newIndex];
    array[newIndex] = array[i];
    array[i] = a;
    if (i === maxIndex) {
      minIndex += PARTIAL_SHUFFLE_FACTOR;
      maxIndex += PARTIAL_SHUFFLE_FACTOR;
    }
  }
  return array;
};
