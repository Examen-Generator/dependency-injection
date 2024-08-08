import DependencyInjectionError from "./DependencyInjectionError";
import type { Constructor, Dependency, DependencyInjectionType } from "./types";

/**
 * A simple IOC container to manage class implementation, singleton instances and scopes.
 * This container is used to register and resolve class instances.
 * IOC stands for Inversion of Control. This container is used to invert the control of creating class instances.
 *
 * @class
 */
export default class IOCContainer {
  private static implementations: Map<any, Dependency> = new Map(); // The implementations (the code of the classes)
  private static instances: Map<any, any> = new Map(); // The singleton instances (ready-to-use objects)

  /**
   * Register a class constructor with the container.
   * This method is used to register a class constructor with the container.
   *
   * @template T
   * @param {string} token The class identifier to register.
   * @param {DependencyInjectionType} injectionType The type of dependency injection to use.
   * @param {Constructor<T>} implementation The class constructor to register.
   * @method IOCContainer#register
   */
  public static register<T>(token: string, injectionType: DependencyInjectionType, implementation: Constructor<T>): void {
    // If there already is an implementation with the same token, throw an error
    if (this.implementations.has(token)) {
      throw new DependencyInjectionError(`There already is a class named ${token} registered.`);
    }

    // Add the implementation
    this.implementations.set(token, { injectionType, implementation });
  }

  /**
   * Resolve a class instance from the container.
   * @throws {DependencyInjectionError} When the instance is not found, the injection type is scoped or the IOC is unable to create an instance.
   *
   * @template T
   * @param {string} token The class identifier to resolve.
   * @returns {T} The class instance.
   * @method IOCContainer#resolve
   */
  public static resolve<T>(token: string): T {
    // Get the injection for the token
    const injection = this.implementations.get(token);

    // Check if the constructor exists
    if (!injection) {
      throw new DependencyInjectionError(`Class constructor for ${token} not found. Did you forget to add the @Singleton decorator to the class?`);
    }

    // If the type isn't singleton, create a new instance
    if (injection.injectionType !== "Singleton") {
      return <T> new injection.implementation();
    }

    // The type is singleton. There should only be one instance of the class.
    // If the instance doesn't exist yet, create a new instance
    try {
      if (!this.instances.has(injection.implementation)) {
        this.instances.set(injection.implementation, new injection.implementation());
      }
    } catch(error) {
      throw new DependencyInjectionError(`Failed to create an instance of ${token}. ${error.message}`);
    }

    // Return the instance
    return this.instances.get(injection.implementation);
  }

  /**
   * Get the injection type of a dependency.
   * @param {string} token The class identifier to get the injection type from.
   * @returns {DependencyInjectionType | null} The injection type of the dependency.
   * @method IOCContainer#getInjectionType
   */
  public static getInjectionType(token: string): DependencyInjectionType | null {
    return this.implementations.get(token)?.injectionType ?? null;
  }

  /*
    +========================================+
    | Used for managing scoped dependencies. |
    +========================================+
  */
  private static scopes: Map<any, any> = new Map();

  /**
   * Register a class instance as a scope.
   * @param {any} instance An instance of a class to register as a scope
   * @param {(dependency: string) => any} resolve The resolve function to resolve the dependency
   * @method IOCContainer#registerScope
   */
  public static registerScope(instance: any, resolve: (dependency: string) => any): void {
    this.scopes.set(instance, resolve);
  }

  /**
   * Resolve a scoped dependency from a class instance.
   * @template T
   * @param {any} instance The class instance to resolve from (probably "this")
   * @param {string} dependency The class identifier to resolve.
   * @returns {T | null} The class instance or null if the dependency is not found.
   * @method IOCContainer#resolveScope
   */
  public static resolveScope<T>(instance: any, dependency: string): T | null {
    const resolve = this.scopes.get(instance);
    return resolve ? resolve(dependency) : null;
  }

  /**
   * Clean up the scopes. This method is used to clean up the scopes after they are used.
   * @param {Iterable<any>} scopes The scopes to clean up.
   * @method IOCContainer#cleanScope
   */
  public static cleanScope(scopes: Iterable<any>): void {
    for (const scope of scopes) {
      this.scopes.delete(scope);
    }
  }

  /*
    +========================================================+
    | Used for testing if all dependencies resolve properly. |
    +========================================================+
  */
  private static dependencyReferences: Map<string, any> = new Map();

  /**
   * Add a reference to a dependency to the container. This is used to test if all dependencies are resolvable.
   * @param {string} token The class identifier to register.
   * @param {any} origin The origin of the dependency reference.
   * @method IOCContainer#addDependencyReference
   */
  public static addDependencyReference(token: string, origin: any): void {
    this.dependencyReferences.set(token, origin);
  }

  /**
   * Test if all dependencies are resolvable.
   * @returns {object} The result of the test. The object contains a boolean value and an array of errors.
   * @method IOCContainer#testDependencyReferences
   */
  public static testDependencyReferences(): { valid: boolean, errors: string[] } {
    let valid = true;
    let errors: string[] = [];

    // Go over all the dependencies and check if they are resolvable
    for (const [token, origin] of this.dependencyReferences) {
      const dependency = this.implementations.get(token);

      // Check if the dependency is properly registered
      if (!dependency) {
        errors.push(`${origin.constructor.name}: The dependency ${token} is not registered`);
        valid = false;
        continue;
      }

      // A scoped dependency cannot be resolved from a non-scoped class
      // Get the injectionType of the origin
      if (dependency.injectionType === "Scoped") {
        const originDependency = this.implementations.get(origin.constructor.name);
        if (originDependency && originDependency.injectionType !== "Scoped") {
          errors.push(`${origin.constructor.name}: The scoped dependency ${token} cannot be resolved from a non-scoped class`);
          valid = false;
        }
      }
    }

    return { valid, errors };
  }
}