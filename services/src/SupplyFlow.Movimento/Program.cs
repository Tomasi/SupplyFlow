using MongoDB.Driver;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Common.MassTransit;
using SupplyFlow.Common.MongoDB;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo().
AddMongoRepository<Movimento>("Movimentos").
AddMassTransitWithRabbitMq().
AddScoped<IRepository<Produto>>(provider =>
{
    var database = provider.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Produto>(database, "Produtos");
});

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