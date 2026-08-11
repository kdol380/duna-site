# Guia de atualização do site Duna Fragrâncias

- **Responsável final:** Josué
- **Execução:** colaboradora com apoio do Codex
- **Última atualização:** 11/08/2026
**Revisão:** sempre que o catálogo ou a forma de publicação mudar

## Finalidade

Este guia permite que outra pessoa atualize preços, estoque, produtos, fotos e textos sem depender do histórico desta conversa. O GitHub guarda a versão oficial; depois de conectado ao repositório, o Netlify coloca no ar somente o que for aprovado.

## Escopo

Este processo cobre alterações de perfumes, skincare, preços, disponibilidade, imagens e textos do site. Também cobre revisão pelo GitHub e publicação pelo Netlify.

Não cobre compartilhamento de senhas, cobrança do Netlify, compra ou configuração de domínio e mudanças comerciais sem confirmação do responsável.

## O que a colaboradora precisa

1. Uma conta própria no GitHub.
2. Aceitar o convite para o repositório `kdol380/duna-site`.
3. Abrir o repositório no Codex.
4. Informar dados comerciais exatos. O Codex não deve adivinhar preços, estoque ou informações de produtos.

Nunca compartilhe senhas ou códigos de acesso. Cada pessoa usa sua própria conta.

## Responsabilidades

| Etapa | Colaboradora | Codex | Josué | Netlify |
|---|---|---|---|---|
| Informar a mudança | Responsável | Ajuda a identificar dados faltantes | Pode solicitar ou confirmar | — |
| Alterar o site | Acompanha | Executa e verifica | — | — |
| Conferir preço e estoque | Primeira conferência | Mostra exatamente o que mudou | Aprovação final | — |
| Aprovar a publicação | — | Prepara o Pull Request | Responsável final | — |
| Colocar no ar | — | — | Aprova a integração | Publica automaticamente depois de conectado ao GitHub |

## Fluxo simples

```text
Pedido com dados exatos
        ↓
Codex atualiza uma branch separada
        ↓
Codex testa e envia para revisão no GitHub
        ↓
Josué confere o link de teste do Netlify
        ↓
Aprovação e publicação no site oficial
```

## Como pedir uma alteração

Use uma solicitação objetiva:

> No site Duna, altere o preço do Fakhar Black de R$ 220 para R$ 239. Ele está disponível. Não modifique os outros produtos. Teste e envie a atualização para revisão no GitHub.

Para marcar um produto como esgotado:

> Marque o Turathi Electric como esgotado. Mantenha o preço atual e não altere os demais produtos. Teste e envie para revisão.

Para adicionar um produto novo, informe:

- nome completo;
- marca;
- preço;
- tamanho ou volume;
- disponível ou esgotado;
- foto do produto;
- descrição e características, caso devam aparecer no site.

Se alguma informação estiver faltando, o Codex deve perguntar antes de fazer a alteração.

## Passo a passo de uma atualização

### 1. Abrir e sincronizar

**Quem:** colaboradora com apoio do Codex

**Quando:** antes de toda atualização

**Como:** abrir o repositório `duna-site` e pedir ao Codex para conferir se está sincronizado com o GitHub. Se houver alterações de outra pessoa ainda não concluídas, não sobrescrever.

**Resultado:** trabalho iniciado a partir da versão correta.

### 2. Informar os dados

**Quem:** colaboradora

**Quando:** depois da sincronização

**Como:** enviar o pedido com produto, valor, estoque e demais informações exatas. Anexar a foto quando necessário.

**Resultado:** solicitação completa, sem espaço para o chat inventar dados.

### 3. Atualizar e testar

**Quem:** Codex

**Quando:** depois de confirmar todos os dados

**Como:** criar uma branch separada, modificar somente o necessário e conferir páginas, imagens, preços, estoque e WhatsApp.

**Resultado:** alteração pronta sem afetar o site oficial.

### 4. Enviar para revisão

**Quem:** Codex com autorização da colaboradora

**Quando:** depois dos testes

**Como:** enviar a branch ao GitHub e abrir um Pull Request descrevendo exatamente o que mudou.

**Resultado:** link de revisão e, quando configurado, uma prévia do Netlify.

### 5. Aprovar e publicar

**Quem:** Josué

**Quando:** depois de conferir o Pull Request e a prévia

**Como:** validar valores, estoque, fotos, textos e aparência. Aprovar a integração somente se tudo estiver correto.

**Resultado:** depois que o deploy contínuo estiver configurado, o Netlify publica automaticamente a nova versão da branch `main`.

## Conferência antes de aprovar

- [ ] O nome do produto está correto.
- [ ] O preço está exatamente como foi informado.
- [ ] A disponibilidade está correta.
- [ ] A foto corresponde ao produto e aparece no site.
- [ ] Nenhum outro produto foi alterado sem pedido.
- [ ] O botão do WhatsApp abre com o produto correto.
- [ ] O catálogo funciona no celular e no computador.
- [ ] A prévia do Netlify está correta.

## Situações especiais

| Situação | O que fazer |
|---|---|
| Duas pessoas alteraram o mesmo produto | Não escolher uma versão automaticamente; confirmar qual informação é a válida. |
| Preço ou estoque não foi informado | Perguntar antes de editar. |
| A foto não foi enviada | Manter a foto atual ou aguardar o arquivo; não usar imagem aleatória. |
| Produto novo sem descrição ou características | Solicitar os dados; não inventar alegações sobre o produto. |
| A prévia está diferente do esperado | Não aprovar; corrigir na mesma branch e conferir novamente. |
| Alteração urgente | Manter a revisão. Urgência não justifica publicar preço ou estoque sem conferência. |

## Padrão esperado

| Indicador | Meta |
|---|---|
| Preços ou estoque publicados incorretamente | Zero |
| Produtos modificados sem solicitação | Zero |
| Atualizações de colaborador revisadas antes da produção | 100% |
| Imagens quebradas após atualização | Zero |

## Arquivos relacionados

- `AGENTS.md`: regras automáticas para o Codex.
- `app.js`: catálogo de perfumes, preços, estoque e WhatsApp.
- `skincare.html`: catálogo de skincare.
- `assets/`: imagens do site.
- `netlify.toml`: configuração da publicação.
