/**
 * Determines if a value is a class.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a class; otherwise, false.
 */
export default function isClass(
  value: any
): value is new (...args: any[]) => any {
  // Check if value is a function
  if (typeof value !== "function") return false;

  // Check if the function's prototype has a constructor
  if (!value.prototype) return false;

  // Check if the prototype's constructor property is the value itself
  if (value.prototype.constructor !== value) return false;

  // Check if the prototype has properties that indicate it's a class
  const protoProps = Object.getOwnPropertyNames(value.prototype);
  return protoProps.length > 1; // Constructor plus at least one more property
}
