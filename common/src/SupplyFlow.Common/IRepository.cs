using System.Linq.Expressions;

namespace SupplyFlow.Common;

public interface IRepository<T> where T : IEntity
{
    Task CreateAsync(T entity);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter);
    Task<T> GetAsync(Guid id);
    Task<T> GetAsync(Expression<Func<T, bool>> filter);
    Task RemoveAsync(Guid id);
    Task UpdateAsync(T entity);
}