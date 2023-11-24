using SupplyFlow.Common.MongoDB;
using SupplyFlow.Common.MassTransit;
using SupplyFlow.Common;
using MongoDB.Driver;
using SupplyFlow.Common.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo().
AddMongoRepository<PedidoCompra>("PedidosCompra").
AddMassTransitWithRabbitMq().
AddScoped<IRepository<Produto>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Produto>(database, "Produtos");
}).
AddScoped<IRepository<Fornecedor>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Fornecedor>(database, "Fornecedores");
}).AddScoped<IRepository<Estoque>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Estoque>(database, "Estoques");
}).AddScoped<IRepository<Movimento>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Movimento>(database, "Movimentos");
});

builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
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