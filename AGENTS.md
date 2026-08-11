# Instruções do projeto Duna Fragrâncias

Este arquivo orienta qualquer assistente de código que trabalhe neste repositório. Leia também `GUIA-DE-ATUALIZACAO.md` antes de alterar catálogo, preços, estoque ou imagens.

## Objetivo e fonte oficial

- Este repositório é a fonte oficial do site Duna Fragrâncias.
- O site é estático: HTML, CSS e JavaScript, sem etapa de build.
- A branch de produção é `main`. Depois que o deploy contínuo estiver conectado, o Netlify publicará essa branch.
- Mudanças de colaboradores devem ser feitas em uma branch própria e enviadas por Pull Request.
- Nunca envie diretamente para `main` quando houver outra pessoa revisando o trabalho.

## Regras obrigatórias

1. Nunca invente preço, disponibilidade, descrição, volume, marca, notas ou promoção.
2. Se um pedido comercial estiver incompleto ou ambíguo, peça os dados que faltam antes de editar.
3. Faça a menor alteração necessária e preserve tudo que não foi solicitado.
4. Não altere o número em `CONFIG.whatsapp` sem pedido explícito do proprietário.
5. Nunca coloque senhas, tokens, credenciais ou chaves no repositório.
6. Não apague arquivos, produtos ou histórico para resolver conflitos. Pare e informe o conflito.
7. Antes de editar, confira o estado do Git. Preserve alterações existentes e sincronize com o remoto somente quando isso for seguro.
8. Não suponha que o Netlify já está conectado ao GitHub; confirme a integração antes de prometer publicação automática ou link de prévia.

## Onde cada informação fica

| Conteúdo | Arquivo | Observação |
|---|---|---|
| Perfumes, preços e estoque | `app.js` | Array `PERFUMES`, no início do arquivo |
| Número do WhatsApp | `app.js` | Objeto `CONFIG` |
| Produtos de skincare | `skincare.html` | Cards HTML dentro de `.skin-grid` |
| Imagens | `assets/` | Use caminho relativo `assets/nome-do-arquivo.ext` |
| Página inicial | `index.html` | Não duplicar o catálogo manualmente |
| Catálogo de perfumes | `catalogo.html` | Os cards são gerados a partir de `PERFUMES` |
| Aparência e responsividade | `styles.css` | Preserve desktop e celular |
| Publicação Netlify | `netlify.toml` | Site estático; publicação na raiz |

## Regras do catálogo de perfumes

- `preco` é um número sem `R$`, por exemplo `preco:279`.
- Use `preco:null` somente quando o valor deve aparecer como “Sob consulta”.
- `disponivel:false` significa esgotado.
- Produto disponível pode usar `disponivel:true` ou não ter o campo `disponivel`.
- A foto deve existir em `assets/` e ser referenciada, por exemplo `foto:"assets/p-produto.webp"`.
- Ao adicionar um perfume, exija: nome, marca, preço, tamanho, disponibilidade e foto. Não crie os demais dados comerciais ou olfativos sem confirmação.
- Preserve a sintaxe e todos os campos usados por filtros, busca, quiz, carrinho e WhatsApp.

## Regras de skincare

- Os produtos de skincare não estão no array `PERFUMES`; eles são cards em `skincare.html`.
- Para marcar um item como esgotado, mantenha coerentes a classe `is-soldout`, o selo “Esgotado”, o preço exibido e o texto/link de aviso.
- Ao adicionar ou remover um item, atualize a quantidade mostrada em `skincare.html` e a quantidade de skincare registrada em `app.js`.
- Confirme que a imagem existe em `assets/` e que o texto alternativo identifica o produto.

## Fluxo de trabalho

1. Entenda o pedido e liste qualquer dado que esteja faltando.
2. Parta de uma versão atualizada de `main` e crie uma branch descritiva, como `catalogo/ajusta-fakhar-black`.
3. Faça apenas as alterações pedidas.
4. Revise o diff para detectar mudanças acidentais.
5. Verifique pelo menos:
   - sintaxe de `app.js`;
   - existência das imagens referenciadas;
   - abertura de `index.html`, `catalogo.html` e `skincare.html`;
   - preço, estoque, busca, filtros e botão do WhatsApp afetados;
   - visualização em celular e desktop quando houver mudança visual.
6. Explique claramente o que mudou e o que foi verificado.
7. Quando autorizado a enviar a atualização, faça commit na branch, envie ao GitHub e abra um Pull Request. Aguarde revisão antes de integrar à `main`.

## Critérios para concluir

- Os valores exibidos correspondem exatamente aos dados fornecidos.
- Nenhum produto não solicitado foi modificado.
- Não há referência quebrada de imagem.
- O JavaScript continua válido.
- O Pull Request informa produtos alterados, preços/estoque anteriores e novos, e verificações realizadas.
