export declare interface IUserRepository {
  getUserById(id: string): User;
}

export type User = {
  id: number;
};