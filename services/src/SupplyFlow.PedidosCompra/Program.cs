using SupplyFlow.Common.MongoDB;
using SupplyFlow.Common.MassTransit;
using SupplyFlow.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMongo().AddMongoRepository<IEntity>("PedidosCompra").AddMassTransitWithRabbitMq();
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
