export interface Repository<T> {
  exists(identifier: string): Promise<boolean>;
  save(t: T): Promise<T>;
  update(t: T): Promise<T | null>;
  delete(identifier: string): Promise<void>;
}
