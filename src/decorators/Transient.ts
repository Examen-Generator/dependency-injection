import DependencyInjectionError from "../DependencyInjectionError";
import IOCContainer from "../IOCContainer";
import isClass from "../isClass";

/**
 * The decorator to mark a class as a transient. This decorator must be used on a class.
 * When adding this decorator, the class is automatically initiated when it is needed.
 * Each time the class is resolved, a new instance is created.
 *
 * @example
 * @Transient
 * class SomeClass {
 *
 *  // Class implementation...
 *
 * }
 */
export default function Transient(implementation: any) {
  // Check if the implementation is a class
  if (!isClass(implementation)) {
    throw new DependencyInjectionError(`Failed to register class definition for ${implementation.name}. The implementation is not a class.`);
  }

  // Register the class with the IOC container
  IOCContainer.register(implementation.name, "Transient", implementation);
}