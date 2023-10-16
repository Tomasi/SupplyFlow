
using System.Linq.Expressions;
using MongoDB.Driver;

namespace SupplyFlow.Common.MongoDB;

public class MongoRepository<T> : IRepository<T> where T : IEntity
{

    private readonly IMongoCollection<T> _dbCollection;
    private readonly FilterDefinitionBuilder<T> filterBuilder = Builders<T>.Filter;

    public MongoRepository(IMongoDatabase database, string collectionName)
    {
        _dbCollection = database.GetCollection<T>(collectionName);
    }

    public async Task CreateAsync(T entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException();
        }
        await _dbCollection.InsertOneAsync(entity);
    }

    public async Task UpdateAsync(T entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException();
        }

        FilterDefinition<T> filter = filterBuilder.Eq(x => x.Id, entity.Id);
        await _dbCollection.ReplaceOneAsync(filter, entity);
    }
    public async Task RemoveAsync(Guid id)
    {
        FilterDefinition<T> filter = filterBuilder.Eq(x => x.Id, id);
        await _dbCollection.DeleteOneAsync(filter);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        IEnumerable<T> result = await _dbCollection.Find(filterBuilder.Empty).ToListAsync();
        return result;
    }

    public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter)
    {
        IEnumerable<T> result = await _dbCollection.Find(filter).ToListAsync();
        return result;
    }

    public async Task<T> GetAsync(Guid id)
    {
        FilterDefinition<T> filter = filterBuilder.Eq(x => x.Id, id);
        T result = await _dbCollection.Find(filter).FirstOrDefaultAsync();
        return result;
    }

    public async Task<T> GetAsync(Expression<Func<T, bool>> filter)
    {
        T result = await _dbCollection.Find(filter).FirstOrDefaultAsync();
        return result;
    }
}