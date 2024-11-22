/* eslint-disable no-console */

// Import the classes used in DI
import "./db/DbConnection";

import "./bll/UserContainer";
import "./db/UserRepository";

import { IOCContainer } from "../src";
import { IUserContainer } from "./types/bll/IUserContainer";

// Tests if all the dependencies are registered correctly
const testResult = IOCContainer.testDependencyReferences();
if (!testResult.valid) {
  throw new Error(
    `Found Dependency Injection errors!\n${testResult.errors.join("\n")}`
  );
} else console.debug("All dependencies are registered correctly!");

// Example of a request handler
function handleRequest(id: number) {
  console.log(`Handling request ${id}...`);

  // Create a simple Scope Manager
  // For more information about the Scope Manager, see the documentation in README.md
  // This Scope Manager is based on the sveltekit example
  const scopedDependencies: Map<string, any> = new Map();

  function resolve<T>(key: string): T {
    if (scopedDependencies.has(key)) {
      return scopedDependencies.get(key);
    }

    const resolvedDependency = IOCContainer.resolve<T>(key);
    if (IOCContainer.getInjectionType(key) === "Scoped") {
      scopedDependencies.set(key, resolvedDependency);
      IOCContainer.registerScope(key, resolve);
    }

    return resolvedDependency;
  }

  // Get the UserContainer
  const userContainer = resolve<IUserContainer>("UserContainer");

  // Get the user by id
  const user = userContainer.getUserById(id.toString());
  console.log(`We found the user: ${JSON.stringify(user)}`);

  // Now let's do that again!
  const user2 = userContainer.getUserById(user.id);
  console.log(`We found the user: ${JSON.stringify(user2)}`);

  // The id's match because we do some caching in the UserContainer
  // But each UserContainer is limited to its own scope
  // So the ID is always different between requests

  // Clear the scope
  IOCContainer.cleanScope(scopedDependencies.values());

  console.log(`Finished handling request ${id}`);
}

for (let i = 0; i < 5; i++) {
  console.log("\n\n\n");
  handleRequest(i);
}
