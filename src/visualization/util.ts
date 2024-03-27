/**
 * Find the upper bound for the axis for an array with values.
 * @param arr: array with values
 * @returns the first 5- or 1- value that is higher
 * E.g. if the max value is 97, it returns 100. If the max value is 147, it returns 500.
 */
export function getUpperBound(arr: number[]): number {
	const maxValue = Math.max(...arr);
	if (maxValue > 1) {
		return getUpperBoundInner(maxValue);
	} else {
		const multiplyFactor = Math.round(1/maxValue);
		const multiplyFactorRound = Math.pow(10, multiplyFactor.toString().length);
		const newVal = getUpperBoundInner(maxValue * multiplyFactorRound) / multiplyFactorRound;
		return newVal;
	}
}

/**
 * Helper function for getUpperBound
 * @param maxValue number to find the nearest 2.5/5/10 above
 * @returns number that is the nearest 2.5/5/10 above maxValue
 */
function getUpperBoundInner(maxValue: number): number {
	const maxValueRound = Math.round(maxValue);
	const lengthValue = maxValueRound.toString().length;
	const bound10 = Math.pow(10, lengthValue);
	const bound5 = bound10 / 2;
	const bound25 = bound5 /2;
	if (maxValue < bound25) {
		return bound25;
	}
	if (maxValue < bound5) {
		return bound5;
	}
	return bound10;
}

/**
 * Move an element from one position to another in an array and return a copy
 * @param arr array with strings to be ordered
 * @param currentIndex index of the item to be moved
 * @param newIndex index where the item should be moved to
 * @returns copy of the array with new ordering
 */
export function reorderArray(arr: string[], currentIndex: number, newIndex: number): string[] {
	const selectedElement = arr[currentIndex];
	let arrCopy = [...arr.slice(0, currentIndex), ...arr.slice(currentIndex + 1)];
	arrCopy = [...arrCopy.slice(0, newIndex), selectedElement, ...arrCopy.slice(newIndex)];
	return arrCopy;
}