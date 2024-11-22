export type Constructor<T = {}> = new (...args: any[]) => T;
export type DependencyInjectionType = "Singleton" | "Scoped" | "Transient";
export type Dependency = {
  injectionType: DependencyInjectionType;
  implementation: Constructor;
};
