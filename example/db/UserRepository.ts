import { Inject, Transient } from "../../src";
import type { IDbConnection } from "../types/db/IDbConnection";
import type { IUserRepository, User } from "../types/db/IUserRepository";

@Transient
export default class UserRepository implements IUserRepository {
  @Inject("DbConnection") private dbConnection: IDbConnection;

  constructor() {
    console.log("  UserRepository created!")
  }

  public getUserById(id: string): User {
    const result = this.dbConnection.query(`SELECT * FROM users WHERE id = ${id}`);

    return {
      id: result
    };
  }
}