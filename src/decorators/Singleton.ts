import DependencyInjectionError from "../DependencyInjectionError";
import IOCContainer from "../IOCContainer";
import isClass from "../isClass";

/**
 * The decorator to mark a class as a singleton. This decorator must be used on a class.
 * When adding this decorator, the class is automatically initiated when it is needed.
 * There will only be one instance of the class throughout the application.
 *
 * @example
 * @Singleton
 * class SomeClass {
 *
 *  // Class implementation...
 *
 * }
 */
export default function Singleton(implementation: any) {
  // Check if the implementation is a class
  if (!isClass(implementation)) {
    throw new DependencyInjectionError(`Failed to register class definition for ${implementation.name}. The implementation is not a class.`);
  }

  // Register the class with the IOC container
  IOCContainer.register(implementation.name, "Singleton", implementation);
}