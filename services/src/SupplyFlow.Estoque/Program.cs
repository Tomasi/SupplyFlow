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
});
// AddMassTransitWithRabbitMq();

builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
