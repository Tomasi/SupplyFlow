using System.Text;
using MassTransit;
using Microsoft.Extensions.Options;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Common.Settings;
using SupplyFlow.Contracts;
using SupplyFlow.Mail;

namespace SupplyFlow.Service.PedidosCompra.Clients;

public class SituacaoPedidoChangedClient : IConsumer<SitucaoPedidoChanged>
{

    private readonly IRepository<PedidoCompra> _repositoryPedidoCompra;
    private readonly IOptions<EmailSettings> _emailSettings;

    public SituacaoPedidoChangedClient(IRepository<PedidoCompra> repositoryPedidoCompra, IOptions<EmailSettings> emailSettings)
    {
        this._repositoryPedidoCompra = repositoryPedidoCompra;
        this._emailSettings = emailSettings;
    }

    public async Task Consume(ConsumeContext<SitucaoPedidoChanged> context)
    {
        await EnviarEmail(context.Message.Id);
    }

    private async Task EnviarEmail(Guid idPedido)
    {
        var pedidoCompra = await _repositoryPedidoCompra.GetAsync(idPedido);
        if (pedidoCompra == null || pedidoCompra.SituacaoPedido == SituacaoPedidoCompra.Reprovado)
            return;

        Email email = new(_emailSettings.Value);
        Email.ParametrosEnvioEmail parametrosEnvioEmail = new()
        {
            Assunto = $"Pedido de compra {pedidoCompra.NumeroPedido} aprovado!",
            EnderecoDestino = pedidoCompra.Fornecedor == null ? $"" : $"{pedidoCompra.Fornecedor.Email}",
            IsHtml = true,
            Corpo = await GerarCoporMensagem(pedidoCompra.Itens),
        };
        _ = email.EnviaEmail(parametrosEnvioEmail);
    }

    public async Task<string> GerarCoporMensagem(List<ItemPedido>? itens)
    {
        if (itens == null || itens.Count == 0)
            return "";

        StringBuilder htmlBuilder = new();

        htmlBuilder.AppendLine("<table style='border-collapse: collapse; width: 100%;'>");

        htmlBuilder.AppendLine("<thead style='background-color: #f2f2f2;'>");
        htmlBuilder.AppendLine("<tr>");
        htmlBuilder.AppendLine("<th style='padding: 10px; border: 1px solid #dddddd;'>Código</th>");
        htmlBuilder.AppendLine("<th style='padding: 10px; border: 1px solid #dddddd;'>Descrição</th>");
        htmlBuilder.AppendLine("<th style='padding: 10px; border: 1px solid #dddddd;'>Quantidade</th>");
        htmlBuilder.AppendLine("</tr>");
        htmlBuilder.AppendLine("</thead>");
        htmlBuilder.AppendLine("<tbody>");

        foreach (var item in itens)
        {
            htmlBuilder.AppendLine("<tr>");
            htmlBuilder.AppendLine($"<td style='padding: 10px; border: 1px solid #dddddd;'>{item.Produto.Codigo}</td>");
            htmlBuilder.AppendLine($"<td style='padding: 10px; border: 1px solid #dddddd;'>{item.Produto.Descricao}</td>");
            htmlBuilder.AppendLine($"<td style='padding: 10px; border: 1px solid #dddddd;'>{item.Quantidade}</td>");
            htmlBuilder.AppendLine("</tr>");
        }

        htmlBuilder.AppendLine("</tbody>");
        htmlBuilder.AppendLine("</table>");

        return await Task.Run(() => htmlBuilder.ToString());
    }
}