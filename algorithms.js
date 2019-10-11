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

function* heapSort(arr) {
  for (let i = arr.length; i >= 0; i--) {
    yield* heapify(arr, arr.length, i);
  }

  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, i, 0);
    yield;
    yield* heapify(arr, i, 0);
  }
}

function* heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[largest] < arr[left]) largest = left;
  if (right < n && arr[largest] < arr[right]) largest = right;
  if (largest != i) {
    swap(arr, i, largest);
    yield;
    yield* heapify(arr, n, largest);
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

function* shellSort(values) {
  let n = values.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let tmp = values[i];
      let j = i;
      for (j = i; j >= gap && values[j - gap] > tmp; j -= gap) {
        values[j] = values[j - gap];
        yield;
      }
      values[j] = tmp;
      yield;
    }
  }
}

function* radixSortLSD(array) {
  let values = [...array];
  let counter = new Array(10).fill(0);
  let n = values.length;
  let radix = 1;
  let max = Math.max(...array);

  while (radix < max) {
    for (let i = 0; i < n; i++) {
      counter[parseInt(values[i] / radix) % 10]++;
    }

    for (let i = 1; i < counter.length; i++) {
      counter[i] = counter[i] + counter[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      array[--counter[parseInt(values[i] / radix) % 10]] = values[i];
      yield;
    }

    values = [...array];
    counter.fill(0, 0);

    radix *= 10;
  }
}
