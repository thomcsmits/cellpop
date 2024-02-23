/**
 * Find the upper bound for the axis for an array with values.
 * arr: array with values
 * Returns the first 5- or 1- value that is higher
 * E.g. if the max value is 97, it returns 100. If the max value is 147, it returns 500.
 */
export function getUpperBound(arr) {
	const maxValue = Math.max(...arr);
	const lengthValue = maxValue.toString().length;
	const bound10 = Math.pow(10, lengthValue);
	const bound5 = bound10 / 2;
	const bound25 = bound5 /2;
	if (maxValue < bound25) {
		return bound25
	}
	if (maxValue < bound5) {
		return bound5;
	}
	return bound10;
}


export function reorderArray(arr, currentIndex, newIndex) {
	let selectedElement = arr[currentIndex];
	let arrCopy = [...arr.slice(0, currentIndex), ...arr.slice(currentIndex + 1)];
	arrCopy = [...arrCopy.slice(0, newIndex), selectedElement, ...arrCopy.slice(newIndex)];
	return arrCopy;
}