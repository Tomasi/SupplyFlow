using Microsoft.AspNetCore.Mvc;
using SupplyFlow.Common;
using SupplyFlow.Common.Entities;
using SupplyFlow.Services.Dtos;

namespace SupplyFlow.Services.Produtos.Controllers;

[ApiController]
[Route("produtos")]
public class ProdutosController : ControllerBase
{

    private readonly IRepository<Produto> _entityRepository;
    private readonly IRepository<Fornecedor> _entityRepositoryFornecedor;
    public ProdutosController(IRepository<Produto> entityRepository, IRepository<Fornecedor> entityRespositoryFornecedor)
    {
        this._entityRepository = entityRepository;
        this._entityRepositoryFornecedor = entityRespositoryFornecedor;
    }

    [HttpPost]
    public async Task<ActionResult<ProdutoDto>> PostAsync(CreateProdutoDto produtoDto)
    {
        Produto produto = new()
        {
            Id = Guid.NewGuid(),
            Codigo = produtoDto.CodigoProduto,
            Descricao = produtoDto.DescricaoProduto,
            PrecoUnitario = produtoDto.PrecoUnitario,
            SituacaoProduto = SituacaoProduto.Ativo,
            Validade = produtoDto.Validade
        };

        produto.Fornecedor = await _entityRepositoryFornecedor.GetAsync(produtoDto.FornecedorId);
        await _entityRepository.CreateAsync(produto);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = produto.Id }, produto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutAsync(Guid id, [FromBody] UpdateProdutoDto produtoDto)
    {
        var produto = await _entityRepository.GetAsync(id);

        if (produto == null)
            return BadRequest();

        produto.Codigo = produtoDto.CodigoProduto;
        produto.Descricao = produtoDto.DescricaoProduto;
        produto.Fornecedor = await _entityRepositoryFornecedor.GetAsync(produtoDto.FornecedorId);
        produto.PrecoUnitario = produtoDto.PrecoUnitario;
        produto.SituacaoProduto = produtoDto.SituacaoProduto;
        produto.Validade = produtoDto.Validade;

        await _entityRepository.UpdateAsync(produto);
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetAllAsync()
    {
        var produtos = await _entityRepository.GetAllAsync();
        return Ok(produtos?.Select(produto => produto.AsDto()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProdutoDto>> GetByIdAsync(Guid? id)
    {
        if (id == null)
        {
            return BadRequest();
        }

        var produto = await _entityRepository.GetAsync(id.GetValueOrDefault());
        return Ok(produto.AsDto());
    }

    [HttpGet("fornecedor")]
    public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetAllByFornecedorAsync([FromQuery] Guid? idFornecedor)
    {
        if (idFornecedor == null)
        {
            return BadRequest("Favor informar um fornecedor.");
        }

        var produtos = await _entityRepository.GetAllAsync(produto => produto.Fornecedor.Id == idFornecedor.GetValueOrDefault());
        return Ok(produtos.Select(produto => produto.AsDto()));
    }
}
