export abstract class BaseRepository<TEntity> {
  abstract create(data: Partial<TEntity>): Promise<TEntity>;
  abstract findById(id: string): Promise<TEntity | null>;
}