namespace SupplyFlow.Common.Entities
{
    public class ItemPedido : IEntity
    {
        public Guid Id { get; set; }
        public Guid? IdProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
        public decimal PrecoTotal { get; set; }
    }
}