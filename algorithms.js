function* bubbleSort(values) {
  let swapped = false;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length - i - 1; j++) {
      if (values[j] > values[j + 1]) {
        swap(values, j, j + 1);
        swapped = true;
      }
      yield;
    }

    if (!swapped) {
      return;
    }
  }
}

function* insertionSort(values) {
  for (let i = 1; i < values.length; i++) {
    let key = values[i];
    let j = i - 1;
    while (j >= 0 && values[j] > key) {
      values[j + 1] = values[j];
      j = j - 1;
      yield;
    }
    values[j + 1] = key;
    yield;
  }
}

function* selectionSort(values) {
  for (let i = 0; i < values.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < values.length; j++) {
      if (values[j] < values[minIdx]) {
        minIdx = j;
      }
    }
    swap(values, i, minIdx);
    yield;
  }
}

function* quickSortLomuto(values) {
  yield* _quickSortLomuto(values, 0, values.length - 1);
}

function* _quickSortLomuto(values, left, right) {
  if (left >= right) {
    return;
  }
  let partitionGenerator = _partitionLomuto(values, left, right);

  let result = partitionGenerator.next();
  while (!result.done) {
    result = partitionGenerator.next();
    yield 1;
  }

  let idx = result.value;
  yield* _quickSortLomuto(values, left, idx - 1);
  yield* _quickSortLomuto(values, idx + 1, right);
}

function* _partitionLomuto(values, left, right) {
  let pivot = values[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (values[j] < pivot) {
      swap(values, ++i, j);
      yield;
    }
  }
  swap(values, i + 1, right);
  yield;
  return i + 1;
}

function* quickSortHoare(values) {
  yield* _quickSortHoare(values, 0, values.length - 1);
}

function* _quickSortHoare(values, left, right) {
  if (left >= right) {
    return;
  }
  let partitionGenerator = _partitionHoare(values, left, right);

  let result = partitionGenerator.next();
  while (!result.done) {
    result = partitionGenerator.next();
    yield 1;
  }

  let idx = result.value;
  yield* _quickSortHoare(values, left, idx);
  yield* _quickSortHoare(values, idx + 1, right);
}

function* _partitionHoare(values, left, right) {
  let pivotIdx = left + Math.floor((right - left) / 2);
  let pivot = values[pivotIdx];
  while (true) {
    while (values[left] < pivot) left++;
    while (values[right] > pivot) right--;
    if (left >= right) return right;
    swap(values, left++, right--);
    yield;
  }
}

function* mergeSort(values) {
  yield* _mergeSort(values, 0, values.length - 1);
}

function* _mergeSort(values, l, r) {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  yield* _mergeSort(values, l, m);
  yield* _mergeSort(values, m + 1, r);
  yield* _merge(values, l, m, r);
}

function* _merge(values, l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;
  let L = new Array(n1);
  let R = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = values[l + i];
  for (let j = 0; j < n2; j++) R[j] = values[m + 1 + j];

  let i = 0;
  let j = 0;
  let k = l;

  while (i < n1 && j < n2) {
    if (L[i] < R[j]) values[k++] = L[i++];
    else values[k++] = R[j++];
    yield;
  }

  while (i < n1) {
    values[k++] = L[i++];
    yield;
  }

  while (j < n2) {
    values[k++] = R[j++];
    yield;
  }
}

function* bogoSort(values) {
  while (!isSorted(values)) {
    shuffle(values, true);
    yield;
  }
}

function* heapSort(array) {
  yield* buildMaxHeap(array);
  let lastElement = array.length - 1;
  while (lastElement > 0) {
    swap(array, 0, lastElement);
    yield;
    yield* heapify(array, 0, lastElement);
    lastElement -= 1;
  }
}

function* buildMaxHeap(array) {
  let i = Math.floor(array.length / 2 - 1);
  while (i >= 0) {
    yield* heapify(array, i, array.length);
    i -= 1;
  }
}

function* heapify(heap, i, max) {
  var index, leftChild, righChild;
  while (i < max) {
    index = i;
    leftChild = 2 * i + 1;
    righChild = leftChild + 1;
    if (leftChild < max && heap[leftChild] > heap[index]) {
      index = leftChild;
    }
    if (righChild < max && heap[righChild] > heap[index]) {
      index = righChild;
    }
    if (index == i) {
      return;
    }
    swap(heap, i, index);
    i = index;
    yield;
  }
}

function swap(array, firstIdx, secondIdx) {
  [array[firstIdx], array[secondIdx]] = [array[secondIdx], array[firstIdx]];
}

function isSorted(values) {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] > values[i + 1]) return false;
  }
  return true;
}
