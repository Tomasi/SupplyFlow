using SupplyFlow.Common.MongoDB;
using SupplyFlow.Common.MassTransit;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using MongoDB.Driver;

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
});

builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
    );
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
