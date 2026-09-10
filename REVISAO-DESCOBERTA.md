# Revisão das melhorias de descoberta — 10/09/2026

Preparadas na branch `feature/descoberta-e-compra`. Ainda não publicadas.

1. Filtro por orçamento com escolha entre Pix e total no cartão, preservado na URL.
2. Favoritos neste navegador, sem cadastro.
3. Comparação de até três perfumes, com preços, volume e características existentes.
4. Montagem de kits de 3, 5 ou 10 fragrâncias, em 3, 5 ou 10 ml. Descontos já existentes aplicados apenas ao líquido e recalculados junto ao carrinho.
5. Quiz com orçamento, motivos da recomendação e tratamento de ausência de opções.
6. 168 páginas individuais geradas: 84 perfumes, 76 decants e 8 produtos de skincare. Conteúdo inicial estático, links compartilháveis e metadados próprios.
7. CEP opcional no pedido para cotação manual por WhatsApp. Não informa preço nem prazo automático.

## Verificações

- Oito testes automatizados aprovados, incluindo 768 combinações de respostas do quiz.
- Canonical, ofertas, sitemap, links e imagens das 168 páginas conferidos.
- Catálogo, configuração e dados comerciais dos 92 itens do feed preservados em comparação com a versão anterior; somente os links do feed mudaram.
- Sintaxe e diff sem erros.
- Navegador: orçamento com recarga, favoritos, limite e remoção da comparação, kit de três decants, cálculo com carrinho existente, CEP incompleto e mensagem preparada com CEP completo, volume de 10 ml, quiz sem resultado e recuperação com outro orçamento.
- Visualização em celular e desktop; skincare carregado sem erros no console.
- Nenhum pedido de teste foi enviado pelo WhatsApp.

## Limites e manutenção

Favoritos ficam neste navegador. CEP é validado somente pelo formato. A disponibilidade de decants continua usando a regra anterior, sem saldo de líquido independente; gestão de mostruário e frascos abertos foi registrada em `../../TASKS.md` para depois da aprovação desta entrega.

As páginas devem ser regeneradas após qualquer mudança de catálogo, conforme `GUIA-DE-ATUALIZACAO.md`. Não houve medição de velocidade em produção nesta etapa.
