# Preços e disponibilidade pela Central

## Funcionamento

A Central é a fonte de preço de venda e disponibilidade dos 107 produtos vinculados em `dados/central-vinculos.json`. O vínculo usa o ID permanente do Supabase; mudar um nome na Central não troca o produto do site. Produto inativo ou estoque menor ou igual a zero aparece como esgotado. Quantidades, custos, clientes e vendas não são publicados.

O workflow `.github/workflows/sincronizar-central.yml` consulta a projeção pública `duna_catalog_prices_v1`, atualiza os campos comerciais, regenera páginas e feed Meta, testa e grava somente os arquivos do catálogo em `main`. A Cloudflare publica essa alteração. Edições de layout, fotos, textos e novos produtos continuam pelo fluxo de branch e Pull Request. Antes de trabalhar, sincronize com a versão mais recente de `main`, pois a automação também gera commits.

A consulta está programada a cada cinco minutos, mas não é instantânea: filas do GitHub e a publicação podem aumentar o prazo. Agendamentos podem atrasar ou ser descartados, e o GitHub pode desativá-los após 60 dias sem atividade no repositório público. O cliente precisa recarregar a página para ver a versão publicada. A Meta tem seu próprio intervalo de leitura do feed.

Os cinco perfumes antigos sem vínculo na Central permanecem como estavam. Novos cadastros na Central não entram automaticamente no site.

## Decants

Continuam sob controle manual nesta fase. `precoDecantBase` e `disponivelDecant` preservam o preço-base e a disponibilidade anteriores dos decants, independentemente do preço e estoque do frasco fechado. O sincronizador não altera esses campos. Um perfume novo não deve habilitar decants sem confirmação de preço-base e disponibilidade; use `disponivelDecant:false` enquanto não houver decisão.

## Configuração e ativação

1. Aplicar `supabase/20261007_catalog_prices.sql` no projeto correto. A função retorna somente ID, preço e disponibilidade da lista aprovada; não concede leitura das tabelas privadas.
2. Nas variáveis de Actions do repositório, configurar `DUNA_SUPABASE_PUBLISHABLE_KEY` com a chave publicável já usada pela Central. Nunca usar chave administrativa ou gravar chaves em arquivos do repositório.
3. Integrar a implementação por Pull Request.
4. Definir `DUNA_CENTRAL_SYNC_ENABLED` como `true` e executar manualmente o workflow na aba Actions.
5. Conferir resultado, eventual commit automático e publicação em `https://dunafragrancias.com.br` e uma página de produto sem `.html`.

A autorização comercial para esta rotina é alterar preço de venda e disponibilidade dos produtos vinculados conforme a Central. O commit automático em `main` é exclusivo dessa rotina; mudanças humanas seguem o fluxo normal de revisão.

## Falhas e pausa

Valores ausentes, duplicados, inválidos ou produtos extras interrompem o lote inteiro. Falhas de acesso, testes ou conflito com um commit humano também interrompem a execução. O site mantém a última publicação válida; não transforma falha de conexão em estoque zero. Consulte Actions se uma alteração não aparecer. O próximo ciclo tenta novamente, sem forçar o histórico.

Para pausar, definir `DUNA_CENTRAL_SYNC_ENABLED` como `false`. Antes de reverter um preço pelo GitHub, pausar a rotina ou corrigir a Central, para não reaplicar o valor anterior no ciclo seguinte. Reversão de código segue Pull Request; não apagar histórico ou produtos.

## Novos produtos

Cadastrar no site com dados e imagem aprovados, adicionar o ID e nome do site à lista de vínculos e atualizar a lista permitida da função SQL. Aplicar a projeção e publicar os vínculos coordenadamente; durante eventual diferença, o sincronizador rejeita o lote. Atualizar testes de quantidade, executar os geradores e conferir a visualização. Não associar produtos por semelhança de nomes.

## Validação local

Com a chave publicável disponível apenas no ambiente:

```sh
node scripts/sincronizar-central.mjs --check
node scripts/gerar-paginas-produtos.mjs
node scripts/gerar-catalogo-meta.mjs
node --test tests/*.test.cjs
```

`--check` compara sem gravar. Os testes simulam preço, esgotamento, reposição e respostas inválidas, e verificam que os decants permanecem iguais.
