import IOCContainer from "../IOCContainer";

/**
 * The decorator to inject a dependency into a class. This decorator must be used on a property.
 * The dependency is resolved in runtime when trying to access the property. It may throw an error if the dependency is not found.
 * @param {string} dependency The name of the class that implements the interface.
 *
 * @example
 * class SomeClass {
 *
 * @Inject("SomeDependency") private dependency: IDependency;
 *
 * }
 */
export default function Inject(dependency: string) {
  // Return a getter function that returns the class instance
  return function (target: any, propertyKey: string) {
    // Add the reference to the IOC container for testing purposes
    // With this, the IOC container is able to test if all dependencies are resolvable
    IOCContainer.addDependencyReference(dependency, target);

    // Define the getter function for the property
    Object.defineProperty(target, propertyKey, {
      get: function () {
        // Resolve the dependency from the IOC container
        // First, we try to resolve the dependency in the current scope
        // If it is not found, we try to resolve the dependency from the global scope
        return (
          IOCContainer.resolveScope(this, dependency) ??
          IOCContainer.resolve(dependency)
        );
      }
    });
  };
}
