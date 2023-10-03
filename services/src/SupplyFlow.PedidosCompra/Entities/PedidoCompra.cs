
using System.ComponentModel;
using SupplyFlow.Common;

namespace SupplyFlow.Service.Entities
{
    public class PedidoCompra : IEntity
    {
        public Guid Id { get; set; }
        public long NumeroPedido { get; set; }
        public DateTimeOffset DataPedido { get; set; }
        public DateTimeOffset DataAprovacao { get; set; }
        public DateTimeOffset DataEntrega { get; set; }
        public decimal TotalPedido
        {
            get
            {
                return Itens == null ? 0 : Itens.Sum(item => item.PrecoTotal);
            }
        }
        public EnumSituacao SituacaoPedido { get; set; }
        public string? Observacao { get; set; }
        public List<ItemPedido>? Itens { get; set; }
        public string? Fornecedor { get; set; }
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