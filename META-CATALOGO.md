# Catálogo Duna no Meta Commerce Manager

## Endereço público do feed

Depois da publicação no GitHub Pages, use este endereço como fonte de dados do catálogo:

`https://kdol380.github.io/duna-site/catalogo-meta.csv`

O arquivo contém os perfumes e produtos de skincare com preço, disponibilidade, imagem, marca e link individual. Produtos esgotados permanecem no feed como `out of stock`.

## Como manter sincronizado

Sempre que houver mudança em produto, preço, estoque ou imagem, execute:

`node scripts/gerar-catalogo-meta.mjs`

O script recria o feed e interrompe a atualização se encontrar campo obrigatório vazio, ID repetido, preço inválido ou imagem inexistente.

## Configuração na Meta

1. Abra o Commerce Manager e crie ou selecione o catálogo da Duna.
2. Entre em **Fontes de dados** e escolha **Feed de dados**.
3. Escolha **Usar uma URL** e informe o endereço público acima.
4. Selecione atualização programada diária ou por hora, moeda BRL e país Brasil.
5. Após a primeira importação, confira **Problemas** ou **Diagnóstico**.

As etapas dentro da conta Meta exigem que o proprietário esteja conectado e confirme os ativos empresariais. Nunca registre senhas, códigos ou tokens neste repositório.
