using System.Linq.Expressions;

namespace SupplyFlow.Common;

public interface IRepository<T> where T : IEntity
{
    Task CreateAsync(T entity);
    Task<IReadOnlyCollection<TEntity>> GetAllAsync<TEntity>();
    Task<IReadOnlyCollection<TEntity>> GetAllAsync<TEntity>(Expression<Func<T, bool>> filter);
    Task<TEntity> GetAsync<TEntity>(Guid id);
    Task<TEntity> GetAsync<TEntity>(Expression<Func<T, bool>> filter);
    Task RemoveAsync(Guid id);
    Task UpdateAsync(T entity);
}