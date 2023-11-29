using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using SupplyFlow.Common.Settings;

namespace SupplyFlow.Mail;

public class Email
{
    private readonly EmailSettings _emailSettings;

    public Email(EmailSettings emailSettings)
    {
        _emailSettings = emailSettings;
    }
    public async Task EnviaEmail(ParametrosEnvioEmail parametros)
    {
        if (_emailSettings == null)
            return;

        if (!await VerificaEmailValido(_emailSettings.From, parametros.EnderecoDestino))
            return;

        MailMessage email = new(_emailSettings.From, parametros.EnderecoDestino)
        {
            Subject = parametros.Assunto,
            Body = parametros.Corpo,
            IsBodyHtml = parametros.IsHtml
        };

        await EnviaEmailBySmtp(email);
    }

    private async Task EnviaEmailBySmtp(MailMessage email)
    {

        SmtpClient smtpClient = new()
        {
            Port = 587,
            Host = _emailSettings.Provedor,
            EnableSsl = true,
            Timeout = 60000,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(_emailSettings.From, _emailSettings.Senha)
        };

        await Task.Run(() =>
        {
            smtpClient.Send(email);
            smtpClient.Dispose();
        });
    }


    private async Task<bool> VerificaEmailValido(string enderecoFrom, string enderecoDestino)
    {
        Regex expression = new(@"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$", RegexOptions.None, TimeSpan.FromSeconds(2));
        bool resultadoFrom = await Task.Run(() => expression.IsMatch(enderecoFrom));
        bool resultadoDestino = await Task.Run(() => expression.IsMatch(enderecoDestino));

        return resultadoFrom && resultadoDestino;
    }


    public class ParametrosEnvioEmail
    {
        public string? EnderecoDestino { get; set; }
        public string? Assunto { get; set; }
        public string? Corpo { get; set; }
        public bool IsHtml { get; set; }
    }
}
