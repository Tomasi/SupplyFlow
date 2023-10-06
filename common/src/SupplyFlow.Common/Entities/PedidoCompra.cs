
using System.ComponentModel;

namespace SupplyFlow.Common.Entities
{
    public class PedidoCompra : IEntity
    {
        public Guid Id { get; set; }
        public long NumeroPedido { get; set; }
        public DateTimeOffset DataPedido { get; set; }
        public DateTimeOffset DataAprovacao { get; set; }
        public DateTimeOffset DataEntrega { get; set; }
        public decimal PrecoTotal
        {
            get
            {
                return Itens == null ? 0 : Itens.Sum(item => item.PrecoTotal);
            }
        }
        public EnumSituacao SituacaoPedido { get; set; }
        public string? Observacao { get; set; }
        public List<ItemPedido>? Itens { get; set; }
        public Fornecedor? Fornecedor { get; set; }

    }

    public enum EnumSituacao
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