# SupplyFlow

Para conhecer mais sobre o produto, acesse nossa página na Wiki.

## C4 Model

- [(C4Model.Contexto)](https://drive.google.com/file/d/1VSJ5fRvzJEzwLn7JBGe3nAu40cpLjjBe/view?usp=drive_link)
- [(C4Model.Containers)](https://drive.google.com/file/d/1JsUiNJ1vfnW-01cuZCHTYmnyuxkWclcy/view?usp=sharing)
- [(C4Model.Componentes)](https://drive.google.com/file/d/1hpJ1y6vrj-9h3Ka2L9MQdXEUGbs5Mw0w/view?usp=drive_link)

## Restrições

- WEB Desktop

## Trade-offs

- Confiabilidade
- Manutenabilidade

## Backlog

- [Board do Projeto](https://github.com/users/Tomasi/projects/2)

## Diagramas UML

- [Cados de Uso](https://drive.google.com/file/d/13gdoXdUy9TaRNPD85DMjGmPWb4XYUIg-/view?usp=sharing)
- [Diagrama de Sequência Usuário](https://drive.google.com/file/d/10HpHJ4Tb2HKy8uGdD7xmqnosM2g6FF-h/view?usp=sharing)
- [Diagrama de Sequência Geração Pedidos Automáticos](https://drive.google.com/file/d/1sN6TdM1TAUOIj4k8psJ89cS7fWrN1Ukp/view?usp=sharing)

## Como a aplicação esta hospedada?

- API's estão publicadas no <b>Azure</b> com CD através de pipeline
- Banco de dados esta hospeda em um cluster no AtlasDB
- RabbitMQ está hospedado em <b>CloudAMQP</b>
- Aplicação Web esta hospedada no [Vercel](https://supply-flow.vercel.app/)

## Ferramenta de Análise de Código

Para a análise de código é utilizado o Sonar Clound, atualmente com qualidade de código aprovada para produção.

![image](https://github.com/Tomasi/SupplyFlow/assets/61890715/ee8e0350-acf4-4490-8a5e-eab3e93ef472)

Para monitoramento da aplicação é utilizado a ferramente de monitoramento do Vercel.

![image](https://github.com/Tomasi/SupplyFlow/assets/61890715/9251ad6d-5cab-4229-b296-70bb1100337b)

## Técnologias

- C#
- Dotnet 7
- Ract
- Vite.js
- RabbitMq
- MongoDB
- Mui

## Contribuição

O projeto segue o critério Open Source, então sinta-se livre para verificar possíveis ajustes e novos implementos. Para executar o projeto e contribuir você deve realizar alguns passos, aqui estão eles:

### Como executar?

- Crie um fork do projeto
- Instale o pacote SDK do .net 7 (https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- Instale o pacote node 20.10 LTS (https://nodejs.org/en)
- Para facilitar o uso do MongoDB e RabbitMQ em seu ambiente instale o docker (https://www.docker.com/products/docker-desktop/). Execute o comando <b>docker-compose up</b> no arquivo <b>infra/docker-compose.yml</b> isso irá subir as imagens do docker e RabbitMQ em seu local host, se necessário mude as portas das imagens no arquivo específicado.




