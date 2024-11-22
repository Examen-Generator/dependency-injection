/* eslint-disable no-console */

import { Inject, Scoped } from "../../src";
import type { IUserContainer, User } from "../types/bll/IUserContainer";
import type { IUserRepository } from "../types/db/IUserRepository";

@Scoped
export default class UserContainer implements IUserContainer {
  @Inject("UserRepository") private userRepository: IUserRepository;
  private userId?: number;

  constructor() {
    console.log("  UserContainer created!");
  }

  public getUserById(id: string): User {
    if (!this.userId) {
      this.userId = this.userRepository.getUserById(id).id;
    }

    return {
      id: (this.userId * 2).toString()
    };
  }
}
