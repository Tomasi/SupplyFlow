
using System.ComponentModel;
using MongoDB.Bson.Serialization.Attributes;

namespace SupplyFlow.Common.Entities
{
    [BsonDiscriminator("PedidoCompra")]
    public class PedidoCompra : IEntity
    {
        public Guid Id { get; set; }
        public long NumeroPedido { get; set; }
        public DateOnly DataPedido { get; set; }
        public DateOnly DataAprovacao { get; set; }
        public DateOnly DataEntrega { get; set; }
        public decimal PrecoTotal
        {
            get
            {
                return Itens == null ? 0 : Itens.Sum(item => item.PrecoTotal);
            }
        }
        public EnumSituacaoPedido SituacaoPedido { get; set; }
        public string? Observacao { get; set; }
        public List<ItemPedido>? Itens { get; set; }
        public Fornecedor? Fornecedor { get; set; }

    }

    public enum EnumSituacaoPedido
    {
        [Description("Pendente")]
        Pendente = 1,
        [Description("Aprovado")]
        Aprovado = 2,
        [Description("Em Trânsito")]
        EmTransito = 3,
        [Description("Entregue")]
        Entregue = 4,
        [Description("Reprovado")]
        Reprovado = 5
    }
}