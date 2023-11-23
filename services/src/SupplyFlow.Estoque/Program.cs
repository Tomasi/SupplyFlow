using MongoDB.Driver;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Common.MassTransit;
using SupplyFlow.Common.MongoDB;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo().
AddMongoRepository<Estoque>("Estoques").
AddScoped<IRepository<Produto>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Produto>(database, "Produtos");
}).
AddScoped<IRepository<Movimento>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Movimento>(database, "Movimentos");
}).AddMassTransitWithRabbitMq();

builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();