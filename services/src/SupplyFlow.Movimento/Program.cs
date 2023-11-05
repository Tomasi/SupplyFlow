using MongoDB.Driver;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Common.MassTransit;
using SupplyFlow.Common.MongoDB;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo().
AddMongoRepository<Movimento>("Movimento").
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowOrigin");
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowOrigin",
            builder => builder
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader());
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
