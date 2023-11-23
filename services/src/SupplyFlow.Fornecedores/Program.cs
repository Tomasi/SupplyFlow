using SupplyFlow.Common.MongoDB;
using SupplyFlow.Common.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo().AddMongoRepository<Fornecedor>("Fornecedores");
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
// app.UseAuthorization();
app.MapControllers();
app.Run();
