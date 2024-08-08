import { Singleton } from "../../src";
import type { IDbConnection } from "../types/db/IDbConnection";

@Singleton
export default class DbConnection implements IDbConnection {
  constructor() {
    console.log("  DbConnection created!")
  }

  public query(query: string): number {
    console.log("Querying: ", query);

    return Math.random();
  }
}