import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const siteBase = "https://kdol380.github.io/duna-site";

const appSource = await fs.readFile(path.join(rootDir, "app.js"), "utf8");
const skincareSource = await fs.readFile(path.join(rootDir, "skincare.html"), "utf8");

function extractLiteral(source, declaration, openChar, closeChar) {
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex < 0) throw new Error(`Declaração não encontrada: ${declaration}`);
  const start = source.indexOf(openChar, declarationIndex + declaration.length);
  if (start < 0) throw new Error(`Início não encontrado para: ${declaration}`);

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Fim não encontrado para: ${declaration}`);
}

function evaluateLiteral(literal) {
  return Function(`"use strict"; return (${literal});`)();
}

function decodeHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&middot;|&#183;/gi, "·")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function csvCell(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " ").trim();
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function fullName(product) {
  return product.marca ? `${product.marca} ${product.nome}` : product.nome;
}

function genderForMeta(value) {
  if (value === "Masculino") return "male";
  if (value === "Feminino") return "female";
  if (value === "Unissex") return "unisex";
  return "";
}

function feedRow(product, kind) {
  const name = fullName(product);
  const productSlug = slug(name);
  const page = kind === "skincare" ? "skincare.html" : "catalogo.html";
  const productType = kind === "skincare"
    ? "Skincare"
    : (/body spray/i.test(product.nome) ? "Perfumes > Body Spray" : "Perfumes > Frasco");

  return {
    id: `${kind}-${productSlug}`,
    title: `${name} (${product.tamanho})`,
    description: product.desc || product.descricao || product.inspiracao || `${name} disponível na Duna Fragrâncias.`,
    availability: product.disponivel === false ? "out of stock" : "in stock",
    condition: "new",
    price: `${Number(product.preco).toFixed(2)} BRL`,
    link: `${siteBase}/${page}?produto=${encodeURIComponent(productSlug)}`,
    image_link: `${siteBase}/${product.foto}`,
    brand: product.marca,
    product_type: productType,
    size: product.tamanho,
    gender: kind === "perfume" ? genderForMeta(product.genero) : "unisex",
    age_group: "adult",
    custom_label_0: kind,
    custom_label_1: product.disponivel === false ? "esgotado" : "disponivel",
  };
}

const perfumesLiteral = extractLiteral(appSource, "const PERFUMES =", "[", "]");
const perfumes = evaluateLiteral(perfumesLiteral);
const guideLiteral = extractLiteral(appSource, "const SKINCARE_GUIDE =", "{", "}");
const skincareGuide = evaluateLiteral(guideLiteral);

const skincare = [];
const cardPattern = /<article class="skin-card([^\"]*)">([\s\S]*?)<\/article>/g;
for (const match of skincareSource.matchAll(cardPattern)) {
  const classes = match[1] || "";
  const card = match[2];
  const image = card.match(/<img[^>]+src="([^"]+)"/i)?.[1];
  const brand = decodeHtml(card.match(/<p class="skin-brand">([\s\S]*?)<\/p>/i)?.[1]);
  const name = decodeHtml(card.match(/<h3>([\s\S]*?)<\/h3>/i)?.[1]);
  const paragraphs = [...card.matchAll(/<p(?![^>]*class="skin-brand")[^>]*>([\s\S]*?)<\/p>/gi)];
  const descriptionLine = decodeHtml(paragraphs[0]?.[1]);
  const priceText = decodeHtml(card.match(/<strong class="skin-price">([\s\S]*?)<\/strong>/i)?.[1]);
  const priceMatch = priceText.match(/R\$\s*([\d.,]+)/i);
  if (!image || !brand || !name || !priceMatch) continue;

  const price = Number(priceMatch[1].replace(/\./g, "").replace(",", "."));
  skincare.push({
    nome: name,
    marca: brand,
    preco: price,
    tamanho: descriptionLine.split("·").pop().trim(),
    foto: image,
    disponivel: !/is-soldout/i.test(classes),
    descricao: skincareGuide[name]?.serve || descriptionLine,
  });
}

const excluded = perfumes.filter((product) => !(typeof product.preco === "number" && product.preco > 0));
const rows = [
  ...perfumes
    .filter((product) => typeof product.preco === "number" && product.preco > 0)
    .map((product) => feedRow(product, "perfume")),
  ...skincare.map((product) => feedRow(product, "skincare")),
];

const requiredFields = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand"];
const ids = new Set();
for (const row of rows) {
  for (const field of requiredFields) {
    if (!row[field]) throw new Error(`Campo obrigatório vazio (${field}) no produto ${row.id || row.title || "sem identificação"}.`);
  }
  if (ids.has(row.id)) throw new Error(`ID duplicado no feed: ${row.id}`);
  ids.add(row.id);
  if (!/^(in stock|out of stock)$/.test(row.availability)) throw new Error(`Disponibilidade inválida: ${row.id}`);
  if (!/^\d+\.\d{2} BRL$/.test(row.price)) throw new Error(`Preço inválido: ${row.id}`);
  new URL(row.link);
  new URL(row.image_link);
  const imageRelativePath = new URL(row.image_link).pathname.replace("/duna-site/", "");
  try {
    await fs.access(path.join(rootDir, imageRelativePath));
  } catch {
    throw new Error(`Imagem inexistente no feed: ${imageRelativePath}`);
  }
}

const headers = [
  "id", "title", "description", "availability", "condition", "price", "link", "image_link",
  "brand", "product_type", "size", "gender", "age_group", "custom_label_0", "custom_label_1",
];
const csv = [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
].join("\n") + "\n";

await fs.writeFile(path.join(rootDir, "catalogo-meta.csv"), csv, "utf8");

console.log(`Feed criado com ${rows.length} produtos: ${rows.filter((row) => row.custom_label_0 === "perfume").length} perfumes e ${skincare.length} itens de skincare.`);
if (excluded.length) {
  console.log(`Fora do feed por falta de preço (${excluded.length}): ${excluded.map(fullName).join(", ")}`);
}
