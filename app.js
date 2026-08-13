/* =====================================================================
   ⚙️  CONFIGURAÇÃO  —  TROQUE AQUI (e só aqui)
   ===================================================================== */
const CONFIG = {
  // TROCAR: número do WhatsApp no formato internacional, só dígitos (55 + DDD + número)
  whatsapp: "5533991106555",
  // Mensagem padrão para o botão geral
  msgGeral: "Olá, Duna! Vim pelo site e quero saber mais sobre os perfumes. 🌙"
};

// preferência global de movimento reduzido (usada por todos os efeitos)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================================
   📦  CATÁLOGO  —  fictício realista (edite à vontade)
   campos: nome, inspiracao, familia, genero, periodo, ocasiao,
           intensidade, preco, tamanho, notas {topo, coracao, fundo},
           accent, selo
   campo opcional: foto:"assets/nome-do-arquivo.png"  → mostra a FOTO
           real do frasco no lugar do desenho.
   ===================================================================== */
// preco: null  →  mostra "Sob consulta" (troque pelo valor, ex: preco:199, quando tiver os preços)
const PERFUMES = [
  { nome:"Club de Nuit Intense Man", marca:"Armaf", inspiracao:"frutado esfumado", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"potente", preco:250, tamanho:"105 ml · EDT", selo:"Ícone", disponivel:false,
    notas:{ topo:"Abacaxi · Limão · Cassis · Maçã", coracao:"Bétula · Jasmim · Rosa", fundo:"Almíscar · Ambargris · Patchouli · Baunilha" },
    accent:"#5a5238", foto:"assets/p-club-intense-new.jpg", desc:"O fenômeno árabe: abacaxi esfumado sobre bétula e madeiras. Projeção e fixação enormes — presença que rende elogios o dia inteiro." },

  { nome:"Club de Nuit Maleka", marca:"Armaf", inspiracao:"frutado elegante", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:335, tamanho:"100 ml · EDP", selo:"Para ela", disponivel:false,
    notas:{ topo:"Lichia · Bergamota · Pimenta Rosa", coracao:"Íris", fundo:"Praliné · Ambroxan · Sândalo" },
    accent:"#9e4a63", foto:"assets/p-club-maleka.jpg", desc:"Floral-frutado luminoso e moderno: lichia e pimenta rosa sobre íris e praliné. Feminino elegante, do dia à noite." },

  { nome:"Odyssey Homme White Edition", marca:"Armaf", inspiracao:"aromático fresco-doce", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:270, tamanho:"100 ml · EDP", selo:"Versátil",
    notas:{ topo:"Pimenta Rosa · Cardamomo · Hortelã", coracao:"Sálvia · Notas Aquáticas · Abacaxi", fundo:"Baunilha · Âmbar · Cedro" },
    accent:"#7a8a93", foto:"assets/p-odyssey-white.jpg", desc:"Fresco e doce na medida: especiarias suaves sobre baunilha e madeiras âmbar. Aromático moderno que veste bem em qualquer estação." },

  { nome:"Turathi Blue", marca:"Afnan", inspiracao:"aquático fresco", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"equilibrado", preco:285, tamanho:"90 ml · EDP", selo:"Fresco", disponivel:false,
    notas:{ topo:"Bergamota · Toranja · Gengibre", coracao:"Hortelã · Âmbar · Notas Amadeiradas", fundo:"Almíscar · Patchouli · Especiarias" },
    accent:"#2f5a73", foto:"assets/p-turathi-blue.jpg", desc:"Azul, frio e arejado: cítricos e gengibre com fundo amadeirado e almíscar. Coringa fresco para o dia a dia e o calor." },

  { nome:"Turathi Electric", marca:"Afnan", inspiracao:"cítrico doce", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"equilibrado", preco:295, tamanho:"90 ml · EDP", selo:"Novidade",
    notas:{ topo:"Pera · Toranja Rosa · Bergamota", coracao:"Flor de Laranjeira · Maçã · Cedro", fundo:"Almíscar · Âmbar · Baunilha" },
    accent:"#2d6c8c", foto:"assets/p-turathi-electric.jpg", desc:"Fresco com brilho doce: pera e toranja sobre flor de laranjeira. Jovem, sofisticado e fácil de usar." },

  { nome:"Vulcan Feu", marca:"French Avenue", inspiracao:"frutado cremoso", familia:"Gourmand", genero:"Masculino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"potente", preco:375, tamanho:"100 ml · EDP", selo:"Frutado",
    notas:{ topo:"Manga · Limão · Ruibarbo · Gengibre", coracao:"Pimenta Rosa · Jasmim · Praliné", fundo:"Fava Tonka · Cedro · Musgo · Ambargris" },
    accent:"#8a3b1e", foto:"assets/p-vulcan-feu.jpg", desc:"Frutado intenso e cremoso: manga e ruibarbo sobre praliné e fava tonka. Doce, marcante e viciante — extrait de alta projeção." },

  { nome:"Thunder", marca:"French Avenue", inspiracao:"íris aveludada", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"marcante", preco:365, tamanho:"100 ml · EDP", selo:"Sofisticado",
    notas:{ topo:"Elemi · Lavanda · Bergamota · Pimenta Rosa", coracao:"Íris · Baunilha · Gerânio", fundo:"Fava Tonka · Cedro · Vetiver" },
    accent:"#4a4a6a", foto:"assets/p-thunder.jpg", desc:"Íris aveludada e levemente empoeirada sobre baunilha e madeiras. Elegante, cremoso e sofisticado — ótima presença." },

  { nome:"Fakhar (Gold)", marca:"Lattafa", inspiracao:"tuberosa amadeirada", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:265, tamanho:"100 ml · EDP", selo:"Para ela", disponivel:false,
    notas:{ topo:"Tuberosa · Notas Salinas", coracao:"Âmbar · Fava Tonka · Cashmeran", fundo:"Cedro · Vetiver · Labdano" },
    accent:"#c2a24e", foto:"assets/p-fakhar-gold-new.webp", desc:"Tuberosa cremosa com toque salino sobre âmbar e madeiras. Feminino moderno, macio e sofisticado." },

  { nome:"Fakhar (Black)", marca:"Lattafa", inspiracao:"aromático fresco", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"marcante", preco:220, tamanho:"100 ml · EDP", selo:"Para ele", disponivel:false,
    notas:{ topo:"Maçã · Bergamota · Gengibre", coracao:"Lavanda · Sálvia · Gerânio", fundo:"Fava Tonka · Cedro · Âmbar" },
    accent:"#3a322a", foto:"assets/p-fakhar-black-new.webp", desc:"Maçã e ervas aromáticas sobre madeiras âmbar — fresco-amadeirado, moderno e elegante. Coringa masculino de ótimo custo." },

  { nome:"Nebras Pride", marca:"Lattafa", inspiracao:"baunilha e cacau", familia:"Gourmand", genero:"Feminino", periodo:"Versátil",
    ocasiao:"noite", intensidade:"marcante", preco:265, tamanho:"100 ml · EDP", selo:"Doce", disponivel:false,
    notas:{ topo:"Frutas Vermelhas · Tangerina", coracao:"Baunilha · Cacau · Rosa", fundo:"Açúcar · Fava Tonka · Âmbar · Almíscar" },
    accent:"#9a6a2a", foto:"assets/p-nebras.jpg", desc:"Baunilha cremosa com cacau e frutas vermelhas. Gourmand doce e aconchegante, com fixação longa." },

  { nome:"Zimaya Tiramisu Caramel", marca:"Lattafa", inspiracao:"caramelo cremoso", familia:"Gourmand", genero:"Feminino", periodo:"Noite",
    ocasiao:"noite", intensidade:"marcante", preco:265, tamanho:"100 ml · EDP", selo:"Gourmand", disponivel:false,
    notas:{ topo:"Caramelo", coracao:"Mel · Cumarina · Notas Amadeiradas", fundo:"Baunilha · Uísque · Almíscar" },
    accent:"#8a5a2c", foto:"assets/p-zimaya-tiramisu.jpg", desc:"Sobremesa vestível: caramelo e mel com um toque de uísque sobre baunilha. Doce, cremoso e convidativo." },

  { nome:"Delilah", marca:"Maison Alhambra", inspiracao:"rosa e ruibarbo", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:250, tamanho:"100 ml · EDP", selo:"Para ela", disponivel:false,
    notas:{ topo:"Ruibarbo · Lichia · Bergamota", coracao:"Rosa Turca · Peônia · Lírio", fundo:"Almíscar Branco · Cashmeran · Baunilha" },
    accent:"#b06a85", foto:"assets/p-delilah.jpg", desc:"Floral-frutado rosado e radiante: ruibarbo e lichia sobre rosa e baunilha. Feminino elogiadíssimo e versátil." },

  { nome:"Salvo", marca:"Maison Alhambra", inspiracao:"fresco especiado", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"marcante", preco:200, tamanho:"100 ml · EDP", selo:"Coringa",
    notas:{ topo:"Bergamota", coracao:"Lavanda · Pimenta de Sichuan · Anis Estrelado · Noz-moscada", fundo:"Ambroxan · Baunilha" },
    accent:"#3a6a8a", foto:"assets/p-salvo.jpg", desc:"Fresco, picante e potente: bergamota e ambroxan no estilo coringa. Agrada todo mundo, do dia ao trabalho." },

  { nome:"Alpine Homme Sport", marca:"Maison Alhambra", inspiracao:"cítrico esportivo", familia:"Cítrico", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"suave", preco:225, tamanho:"100 ml · EDP", selo:"Dia a dia", disponivel:false,
    notas:{ topo:"Tangerina · Hortelã · Cipreste · Sálvia", coracao:"Cedro · Pimenta", fundo:"Fava Tonka · Almíscar · Sândalo" },
    accent:"#3f7a6a", foto:"assets/p-alpine-sport.jpg", desc:"Esportivo e revigorante: tangerina e hortelã sobre cedro e almíscar. Frescor leve para o calor e o uso de todo dia." },

  { nome:"Rayhaan Elixir", marca:"Rayhaan", inspiracao:"lavanda e baunilha", familia:"Gourmand", genero:"Masculino", periodo:"Noite",
    ocasiao:"especial", intensidade:"potente", preco:290, tamanho:"100 ml · EDP", selo:"Assinatura",
    notas:{ topo:"Hortelã · Bergamota", coracao:"Lavanda · Benjoim", fundo:"Baunilha · Fava Tonka" },
    accent:"#7a3a2a", foto:"assets/p-rayhaan-elixir.jpg", desc:"Lavanda e baunilha cremosa com mel de benjoim — doce, aromático e potente. Assinatura marcante para a noite." },

  { nome:"Hawas Black", marca:"Rasasi", inspiracao:"cítrico escuro e amadeirado", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"potente", preco:300, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Bergamota · Abacaxi · Toranja", coracao:"Patchouli · Cedro · Jasmim", fundo:"Musgo de Carvalho · Notas Amadeiradas · Âmbar" },
    accent:"#25221f", foto:"assets/p-hawas-black.jpg", desc:"Cítricos e abacaxi sobre uma base escura de musgo, âmbar e madeiras. Masculino elegante, intenso e de longa presença." },

  { nome:"Pacific Aura", marca:"Rayhaan", inspiracao:"cítrico verde e aquático", familia:"Cítrico", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"equilibrado", preco:350, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Tangerina · Hortelã · Cidra · Bergamota · Cassis · Coentro", coracao:"Manjericão · Cenoura · Rosa", fundo:"Figo · Ambroxan · Âmbar" },
    accent:"#1395a3", foto:"assets/p-pacific-aura.jpg", desc:"Refrescante e vibrante, combina cítricos, hortelã e cassis com um fundo moderno de figo e âmbar. Ideal para dias quentes." },

  { nome:"Chants Tenderina", marca:"Maison Alhambra", inspiracao:"floral frutado delicado", familia:"Floral", genero:"Feminino", periodo:"Dia",
    ocasiao:"dia", intensidade:"suave", preco:200, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Bergamota · Flor de Toranja · Pêssego", coracao:"Rosa · Jasmim · Íris", fundo:"Almíscar Branco · Baunilha · Vetiver · Patchouli" },
    accent:"#d9a8b4", foto:"assets/p-chants-tenderina.webp", desc:"Floral limpo e feminino, com pêssego, rosa e almíscar branco. Leve, confortável e perfeito para o uso diário." },

  { nome:"Hawas Malibu", marca:"Rasasi", inspiracao:"frutado tropical cremoso", familia:"Gourmand", genero:"Masculino", periodo:"Versátil",
    ocasiao:"noite", intensidade:"marcante", preco:340, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Abacaxi · Laranja · Toranja", coracao:"Âmbar · Íris · Lavanda", fundo:"Fava Tonka · Almíscar · Patchouli · Cashmeran" },
    accent:"#168fa5", foto:"assets/p-hawas-malibu.webp", desc:"Frutas tropicais luminosas encontram íris, âmbar e tonka. Cremoso, envolvente e com clima de noite de verão." },

  { nome:"Nocturno", marca:"Rayhaan", inspiracao:"aromático fresco especiado", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:330, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Bergamota · Pimenta · Hortelã", coracao:"Lavanda · Pimenta Rosa · Gerânio", fundo:"Amberwood · Cedro" },
    accent:"#22364c", foto:"assets/p-nocturno.jpg", desc:"Bergamota, hortelã e especiarias sobre lavanda e madeiras secas. Limpo, moderno e fácil de usar do trabalho à noite." },

  { nome:"Attar Al Wesal", marca:"Al Wataniah", inspiracao:"aromático doce especiado", familia:"Gourmand", genero:"Masculino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:210, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Lavanda · Pera · Hortelã · Bergamota · Limão", coracao:"Canela · Sálvia Esclaréia · Cominho", fundo:"Baunilha Negra · Âmbar · Cedro · Patchouli" },
    accent:"#2c2a2c", foto:"assets/p-attar-al-wesal.jpg", desc:"Aromático adocicado com pera, lavanda e canela sobre baunilha escura. Envolvente, versátil e de excelente custo-benefício." },

  { nome:"Pacific Blue", marca:"Maison Alhambra", inspiracao:"cítrico floral mediterrâneo", familia:"Cítrico", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"suave", preco:170, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Limão · Tangerina · Bergamota · Laranja Amarga · Alecrim · Lavanda · Murta", coracao:"Néroli · Flor de Laranjeira · Jasmim", fundo:"Âmbar · Angélica · Ambreta" },
    accent:"#4b9da5", foto:"assets/p-pacific-blue.jpg", desc:"Uma brisa mediterrânea de cítricos, néroli e flores brancas. Fresco, luminoso e confortável para o calor." },

  { nome:"Maahir Honor", marca:"Lattafa", inspiracao:"cítrico aromático elegante", familia:"Cítrico", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"equilibrado", preco:320, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Hortelã · Limão · Bergamota · Tomilho", coracao:"Alecrim · Lavanda · Jasmim · Flor de Moringa", fundo:"Almíscar · Cedro · Âmbar" },
    accent:"#d8d4c9", foto:"assets/p-maahir-honor.jpg", desc:"Cítricos, hortelã e ervas aromáticas com acabamento limpo de almíscar, cedro e âmbar. Refinado e muito fresco." },

  { nome:"Sabah Al Ward", marca:"Al Wataniah", inspiracao:"floral gourmand com cacau", familia:"Floral", genero:"Feminino", periodo:"Noite",
    ocasiao:"especial", intensidade:"marcante", preco:190, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Pimenta Rosa · Tangerina", coracao:"Cacau · Flor de Laranjeira · Jasmim Sambac", fundo:"Baunilha · Fava Tonka · Patchouli" },
    accent:"#8b2448", foto:"assets/p-sabah-al-ward.jpg", desc:"Jasmim e flor de laranjeira ganham profundidade com cacau, baunilha e tonka. Feminino, doce e marcante." },

  { nome:"Obsidian", marca:"Rayhaan", inspiracao:"íris, couro e madeiras", familia:"Amadeirado", genero:"Masculino", periodo:"Noite",
    ocasiao:"especial", intensidade:"marcante", preco:360, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Íris · Cítricos", coracao:"Couro", fundo:"Sândalo · Ambreta · Cedro · Oud" },
    accent:"#201f21", foto:"assets/p-rayhaan-obsidian.jpg", desc:"Íris elegante e atalcada sobre couro, oud e madeiras cremosas. Sofisticado para encontros e ocasiões especiais." },

  { nome:"Aquatica", marca:"Rayhaan", inspiracao:"lima, coco e rum", familia:"Gourmand", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"equilibrado", preco:380, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Lima · Leite de Coco · Bergamota · Tangerina", coracao:"Cana-de-açúcar · Jasmim · Hibisco · Gardênia", fundo:"Rum · Almíscar · Fava Tonka · Patchouli" },
    accent:"#40aeb6", foto:"assets/p-rayhaan-aquatica.webp", desc:"Lima vibrante e coco cremoso com cana-de-açúcar e rum. Tropical, diferente e feito para dias de sol." },

  { nome:"Azul", marca:"Rayhaan", inspiracao:"cítrico aquático minimalista", familia:"Cítrico", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"suave", preco:360, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Bergamota · Limão", coracao:"Flor de Toranja", fundo:"Calone · Sândalo" },
    accent:"#1d6584", foto:"assets/p-rayhaan-azul.jpg", desc:"Limão e bergamota em uma construção limpa, aquática e amadeirada. Refrescante, direto e perfeito para calor intenso." },

  { nome:"Delilah Blanc", marca:"Maison Alhambra", inspiracao:"floral branco cremoso", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:250, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Bergamota · Laranja · Pêssego", coracao:"Tuberosa · Jasmim · Néroli", fundo:"Baunilha · Almíscar Branco · Sândalo" },
    accent:"#d9d7d0", foto:"assets/p-delilah-blanc.webp", desc:"Floral branco limpo e cremoso, com cítricos suaves e fundo de baunilha, almíscar e sândalo. Elegante e confortável." },

  { nome:"Sabah Al Ward Sugar", marca:"Al Wataniah", inspiracao:"frutas vermelhas e baunilha", familia:"Gourmand", genero:"Feminino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:180, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Morango · Framboesa · Mirtilo · Cassis · Cereja", coracao:"Jasmim · Violeta", fundo:"Almíscar · Pétalas de Rosa · Baunilha · Musgo de Carvalho · Âmbar · Cashmeran · Patchouli" },
    accent:"#d98e9e", foto:"assets/p-sabah-sugar.webp", desc:"Um floral gourmand jovem e feminino, com um coquetel suculento de frutas vermelhas, flores delicadas e fundo cremoso de baunilha e almíscar." },

  { nome:"Atheeri", marca:"Lattafa", inspiracao:"floral orvalhado e cremoso", familia:"Floral", genero:"Feminino", periodo:"Dia",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:430, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Flor de Maracujá · Gotas de Orvalho", coracao:"Orquídea · Jasmim", fundo:"Baunilha · Amberwood" },
    accent:"#c79635", foto:"assets/p-atheeri.webp", desc:"Floral etéreo e luminoso: flores úmidas pelo orvalho encontram orquídea, jasmim e uma base macia de baunilha e madeiras âmbar." },

  { nome:"Tharwah Gold", marca:"Lattafa Pride", inspiracao:"lavanda, flores brancas e baunilha", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:390, tamanho:"100 ml · EDP", selo:"Novo", disponivel:false,
    notas:{ topo:"Lavanda · Bergamota", coracao:"Flor de Laranjeira · Jasmim", fundo:"Baunilha · Vetiver · Âmbar" },
    accent:"#d5a33e", foto:"assets/p-tharwah-gold.jpg", desc:"Doce floral sofisticado, com lavanda e bergamota sobre flores brancas e uma base quente de baunilha, âmbar e vetiver." },

  { nome:"B.A.D Femme", marca:"Maison Alhambra", inspiracao:"café, flores brancas e praliné", familia:"Gourmand", genero:"Feminino", periodo:"Noite",
    ocasiao:"especial", intensidade:"potente", preco:170, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Bergamota · Amêndoa · Café · Limão", coracao:"Tuberosa · Flor de Laranjeira · Jasmim Sambac · Rosa Búlgara · Íris", fundo:"Fava Tonka · Baunilha · Almíscar · Cacau · Praliné · Sândalo · Cashmeran · Âmbar · Patchouli · Cedro · Canela" },
    accent:"#42321f", foto:"assets/p-bad-femme.webp", desc:"Gourmand floral intenso: café e amêndoa abrem caminho para flores brancas, praliné, cacau e baunilha. Sensual e marcante para a noite." },

  { nome:"Pink Eclipse", marca:"Maison Alhambra", inspiracao:"floral frutado ambarado", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:315, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Pera · Bergamota · Tangerina", coracao:"Flor de Laranjeira · Jasmim · Néroli", fundo:"Baunilha · Almíscar · Âmbar · Benjoim" },
    accent:"#da8fa5", foto:"assets/p-pink-eclipse.webp", desc:"Feminino moderno e luminoso, com frutas cítricas, flores brancas e um fundo doce e confortável de baunilha, âmbar e benjoim." },

  { nome:"Hawas for Him", marca:"Rasasi", inspiracao:"aquático frutado e especiado", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"marcante", preco:230, tamanho:"100 ml · EDP", selo:"Novo",
    notas:{ topo:"Maçã · Bergamota · Limão · Canela", coracao:"Notas Aquáticas · Ameixa · Flor de Laranjeira · Cardamomo", fundo:"Ambargris · Almíscar · Madeira Flutuante · Patchouli" },
    accent:"#6f79a4", foto:"assets/p-hawas-for-him.webp", desc:"Ícone aquático masculino, combina cítricos, maçã e canela com ameixa, notas marinhas e madeiras. Fresco, potente e extremamente versátil." }
];

/* =====================================================================
   🔗  WHATSAPP — montador de links
   ===================================================================== */
function waLink(msg){
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
}

const WA_BALAO_ICON = `<svg class="ic-wa-balao" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.1-.5 0a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.4.4 0 000-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 00-.7.3 2.8 2.8 0 00-.9 2.1A5 5 0 009 12.5a11 11 0 004.2 3.7c.6.2 1 .4 1.4.5a3.3 3.3 0 001.5.1c.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1z"/></svg>`;
function waAvisoEstoque(nome){
  return waLink(`Olá, Duna! Gostaria de saber sobre a disponibilidade do ${nome}, avise-me quando o produto voltar ao estoque !`);
}

/* ---- Preço: trata "Sob consulta" quando preco é null/0 ---- */
function temPreco(p){ return typeof p.preco === "number" && p.preco > 0; }
// rótulo para o card/quick-view (com <small>R$</small>)
function precoHTML(p){ return temPreco(p) ? `<small>R$</small> ${p.preco}` : `<span class="preco-consulta">Sob consulta</span>`; }
// texto puro para mensagens do WhatsApp
function precoTxt(p){ return temPreco(p) ? `R$ ${p.preco}` : "valor a combinar"; }
// nome com marca, para mensagens
function nomeCompleto(p){ return p.marca ? `${p.marca} ${p.nome}` : p.nome; }
// estoque: todo produto é considerado disponível, salvo quando tiver disponivel:false
function estaDisponivel(p){ return !!p && p.disponivel !== false; }

/* ícones SVG por categoria olfativa (line-art dourado, sem emoji) */
const IC = {
  citrus:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"/></svg>`,
  fruta:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 8.5C10.6 6.7 7.8 6.8 6.6 8.7 5 11.3 6 17 9 19c1 .7 2 .3 3-.2 1 .5 2 .9 3 .2 3-2 4-7.7 2.4-10.3-1.2-1.9-4-2-5.4-.2z"/><path d="M12 8.5V5.5c0-1 .8-2 2-2"/></svg>`,
  flor:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="7.6" r="3"/><circle cx="12" cy="16.4" r="3"/><circle cx="7.6" cy="12" r="3"/><circle cx="16.4" cy="12" r="3"/></svg>`,
  erva:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M5 19C5 11 11 6 19 6c0 8-6 13-14 13z"/><path d="M5 19c3.5-4.5 7-7 11-8.5"/></svg>`,
  spice:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 3v18M5 6l14 12M19 6 5 18"/></svg>`,
  wood:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/></svg>`,
  doce:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="8.5" ry="5.5"/><path d="M4.5 10.5c3.5 1.8 11.5 1.8 15 3.5"/></svg>`,
  ambar:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3.5c3.8 4.8 5.8 7.8 5.8 10.5a5.8 5.8 0 01-11.6 0c0-2.7 2-5.7 5.8-10.5z"/></svg>`,
  aqua:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>`
};
function notaIcone(nota){
  const N = normaliza(nota), has = (...ks)=>ks.some(k=>N.includes(k));
  if(has("aquat","marinh","salin"))                                                              return IC.aqua;
  if(has("pimenta","cardamomo","gengibre","canela","noz","acafrao","anis","especiar","cravo","elemi")) return IC.spice;
  if(has("rosa","jasmim","peonia","lirio","iris","tuberosa","violeta","flor","laranjeira","magnolia","neroli","gardenia","geranio")) return IC.flor;
  if(has("lavanda","salvia","hortela","menta","alecrim","manjericao"))                            return IC.erva;
  if(has("limao","bergamota","toranja","tangerina","lima","citr"))                                return IC.citrus;
  if(has("abacaxi","maca","pera","lichia","manga","ruibarbo","cassis","fruta","pessego","framboesa","groselha")) return IC.fruta;
  if(has("cedro","sandalo","madeira","amadeirad","patchouli","vetiver","betula","cipreste","oud","musgo")) return IC.wood;
  if(has("baunilha","caramelo","praline","mel","cacau","acucar","tonka","cumarina","uisque","creme","cafe","tiramisu","chocolate")) return IC.doce;
  return IC.ambar; // âmbar, ambroxan, ambargris, labdano, benjoim, almíscar, cashmeran, couro, incenso…
}

/* pirâmide olfativa visual: 3 faixas (topo→coração→fundo) com notas em chips + ícone */
function chipsNotas(str){
  return (str||"").split("·").map(n=>n.trim()).filter(Boolean)
    .map(n=>`<span class="note-chip">${notaIcone(n)}<span>${n}</span></span>`).join("");
}
function piramideHTML(p){
  const tier = (cls,label,notas)=>`
    <div class="pyr-tier ${cls}">
      <span class="pyr-label">${label}</span>
      <span class="pyr-notes">${chipsNotas(notas)}</span>
    </div>`;
  return tier("pyr-top","Topo", p.notas.topo)
       + tier("pyr-heart","Coração", p.notas.coracao)
       + tier("pyr-base","Fundo", p.notas.fundo);
}

function waProduto(p){
  return waLink(`Olá, Duna! Tenho interesse no *${nomeCompleto(p)}* (${p.tamanho}) — ${precoTxt(p)}. Ainda está disponível? 🌙`);
}
// liga os botões fixos de WhatsApp (só os que existirem na página)
["waNav","waHero","waBottom","waFloat","waFoot1","waFoot2","waMobile"].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.href = waLink(CONFIG.msgGeral);
});
const waSpecial = document.getElementById("waSpecial");
if(waSpecial) waSpecial.href = waLink("Olá, Duna! Quero cotar uma encomenda especial. O perfume/marca que procuro é: ");

/* =====================================================================
   🧴  FRASCO — foto do produto ou SVG line-art dourado
   ===================================================================== */
function frascoVisual(p){
  return p.foto
    ? `<img src="${p.foto}" alt="${p.tipo === "skincare" ? "Skincare" : "Perfume"} ${p.nome}" loading="lazy" />`
    : bottleSVG(p.accent);
}
function bottleSVG(accent){
  return `<svg viewBox="0 0 120 200" aria-hidden="true">
    <defs>
      <linearGradient id="g${accent.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${accent}" stop-opacity=".30"/>
        <stop offset="1" stop-color="${accent}" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <path d="M34 70 h52 a6 6 0 0 1 6 6 v96 a18 18 0 0 1 -18 18 h-34 a18 18 0 0 1 -18 -18 v-96 a6 6 0 0 1 6 -6 z" fill="url(#g${accent.replace('#','')})"/>
    <g fill="none" stroke="#B08A3C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M34 70 h52 a6 6 0 0 1 6 6 v96 a18 18 0 0 1 -18 18 h-34 a18 18 0 0 1 -18 -18 v-96 a6 6 0 0 1 6 -6 z"/>
      <path d="M48 70 v-14 h24 v14"/>
      <rect x="50" y="40" width="20" height="16" rx="2"/>
      <path d="M54 40 v-8 h12 v8"/>
    </g>
    <path d="M44 86 q-4 30 0 80" stroke="#CDAB63" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>
    <circle cx="60" cy="132" r="15" fill="none" stroke="#CDAB63" stroke-width="1.5" opacity=".8"/>
    <path d="M60 124 c3 3 3 6 0 8 c-3-2-3-5 0-8z" fill="#B08A3C" opacity=".8"/>
  </svg>`;
}

/* =====================================================================
   ✨  SCROLL REVEAL  (definido cedo: usado pelo renderGrid)
   ===================================================================== */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add("in"); revealObserver.unobserve(en.target); }
  });
}, { threshold:.12, rootMargin:"0px 0px -8% 0px" });
function initReveal(){ document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el)); }

/* =====================================================================
   🗂️  RENDER DA COLEÇÃO + FILTROS
   (funciona na home como PRÉVIA [data-limit] e na página catálogo)
   ===================================================================== */
const grid = document.getElementById("grid");
const filtersWrap = document.getElementById("filters");
const countEl = document.getElementById("catCount"); // contador opcional (página catálogo)

const familiasUnicas = Array.from(new Set(PERFUMES.map(p=>p.familia)));
const GRUPOS = [
  { key:"genero",  label:"Gênero",          opts:["Todos","Masculino","Feminino","Unissex"] },
  { key:"periodo", label:"Ocasião",         opts:["Todas","Dia","Noite","Versátil"] },
  { key:"familia", label:"Família olfativa", opts:["Todas", ...familiasUnicas], secondary:true }
];
const sel = { genero:"Todos", periodo:"Todas", familia:"Todas" };
let busca = "";          // texto da busca (normalizado)
let ordem = "padrao";    // ordenação atual

// normaliza p/ busca sem acento e sem caixa
function normaliza(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); }
function passaBusca(p){
  if(!busca) return true;
  const alvo = normaliza([p.nome, p.marca, p.familia, p.inspiracao, p.notas.topo, p.notas.coracao, p.notas.fundo].join(" "));
  return busca.split(/\s+/).every(t => alvo.includes(t));
}
function ordenar(list){
  const arr = list.slice();
  arr.sort((a,b)=>{
    // Produtos disponíveis sempre aparecem antes dos esgotados.
    const estoque = Number(estaDisponivel(b)) - Number(estaDisponivel(a));
    if(estoque) return estoque;
    if(ordem==="padrao")          return Number(b.selo==="Novo") - Number(a.selo==="Novo");
    if(ordem==="preco-asc")       return (temPreco(a)?a.preco:Infinity) - (temPreco(b)?b.preco:Infinity);
    if(ordem==="preco-desc")      return (temPreco(b)?b.preco:-Infinity) - (temPreco(a)?a.preco:-Infinity);
    if(ordem==="nome")            return nomeCompleto(a).localeCompare(nomeCompleto(b), "pt");
    return 0;
  });
  return arr;
}

if(filtersWrap){
  filtersWrap.innerHTML = GRUPOS.map(g=>`
    <div class="filter-group ${g.secondary?'filter-secondary':''}" data-group="${g.key}">
      <span class="filter-label">${g.label}</span>
      ${g.opts.map((o,i)=>`<button class="chip ${i===0?'active':''}" data-val="${o}">${o}</button>`).join("")}
    </div>`).join("");

  filtersWrap.addEventListener("click", e=>{
    const btn = e.target.closest(".chip");
    if(!btn) return;
    const grupo = btn.closest(".filter-group").dataset.group;
    sel[grupo] = btn.dataset.val;
    btn.closest(".filter-group").querySelectorAll(".chip").forEach(c=>c.classList.toggle("active", c===btn));
    renderGrid();
  });
}

function cardHTML(p,i){
  const disponivel = estaDisponivel(p);
  return `
  <article class="card reveal ${disponivel ? "" : "is-unavailable"}" data-d="${(i%4)+1}" data-nome="${p.nome}" tabindex="0" role="button" aria-label="Ver detalhes de ${p.nome}">
    <div class="card-glare"></div>
    <div class="card-corner"><span></span><span></span><span></span><span></span></div>
    <div class="card-top">
      <span class="card-pill pill-solid">${p.genero}</span>
      <span class="card-pill pill-line">${disponivel ? p.familia : "Esgotado"}</span>
    </div>
    <div class="bottle">${frascoVisual(p)}</div>
    ${p.marca ? `<p class="card-brand">${p.marca}</p>` : ""}
    <h3 class="card-name">${p.nome}</h3>
    <p class="card-fam">${p.inspiracao}</p>
    <span class="card-hint">Ver detalhes</span>
    <div class="card-foot">
      <div class="card-meta">
        <span class="card-size">${p.tamanho}</span>
        <span class="card-price">${disponivel ? precoHTML(p) : (temPreco(p) ? `<small><s>R$</s></small> <s>${p.preco}</s>` : precoHTML(p))}</span>
      </div>
      ${disponivel ? `<button class="card-wa" data-add="${p.nome}">
        <svg class="ic-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
        <span class="lbl">Adicionar</span>
      </button>` : `<a class="card-wa card-notify" href="${waAvisoEstoque(nomeCompleto(p))}" target="_blank" rel="noopener">
        ${WA_BALAO_ICON}<span class="lbl">Avise-me quando voltar</span>
      </a>`}
    </div>
  </article>`;
}

// Versátil aparece tanto em Dia quanto em Noite
function passaFiltros(p){
  const okGenero = sel.genero==="Todos" || p.genero===sel.genero;
  let okPeriodo;
  if(sel.periodo==="Todas")          okPeriodo = true;
  else if(sel.periodo==="Versátil")  okPeriodo = p.periodo==="Versátil";
  else                               okPeriodo = (p.periodo===sel.periodo || p.periodo==="Versátil");
  const okFamilia = sel.familia==="Todas" || p.familia===sel.familia;
  return okGenero && okPeriodo && okFamilia;
}

function renderGrid(){
  if(!grid) return;
  let list = ordenar(PERFUMES.filter(passaFiltros).filter(passaBusca));
  const total = list.length;
  const lim = parseInt(grid.dataset.limit||"0", 10);   // prévia da home
  if(lim>0) list = list.slice(0, lim);

  grid.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<p class="grid-empty">Nenhuma fragrância ${busca ? "para essa busca" : "com esses filtros"}.<button class="grid-reset">limpar tudo</button></p>`;
  grid.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

  if(countEl){
    countEl.textContent = total + (total===1 ? " fragrância" : " fragrâncias");
  }
}

function resetFiltros(){
  sel.genero="Todos"; sel.periodo="Todas"; sel.familia="Todas";
  busca=""; ordem="padrao";
  const bi=document.getElementById("catSearch"); if(bi) bi.value="";
  const os=document.getElementById("catSort"); if(os) os.value="padrao";
  if(filtersWrap) filtersWrap.querySelectorAll(".filter-group").forEach(fg=>
    fg.querySelectorAll(".chip").forEach((c,i)=>c.classList.toggle("active", i===0)));
  renderGrid();
}

/* busca + ordenação (só existem na página de catálogo) */
const buscaInput = document.getElementById("catSearch");
if(buscaInput){
  let _bt;
  buscaInput.addEventListener("input", ()=>{
    clearTimeout(_bt);
    _bt = setTimeout(()=>{ busca = normaliza(buscaInput.value.trim()); renderGrid(); }, 180);
  });
}
const ordemSel = document.getElementById("catSort");
if(ordemSel) ordemSel.addEventListener("change", ()=>{ ordem = ordemSel.value; renderGrid(); });

/* alternância entre departamentos — skincare fica isolado do quiz/filtros de perfume */
const deptBtns = document.querySelectorAll("[data-dept]");
const perfumePanel = document.getElementById("perfumePanel");
const skincarePanel = document.getElementById("skincarePanel");
if(deptBtns.length && perfumePanel && skincarePanel){
  deptBtns.forEach(btn=>btn.addEventListener("click", ()=>{
    const skincare = btn.dataset.dept === "skincare";
    deptBtns.forEach(b=>{
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    perfumePanel.hidden = skincare;
    skincarePanel.hidden = !skincare;
    if(countEl) countEl.textContent = skincare ? "6 produtos de skincare" : `${PERFUMES.length} fragrâncias`;
  }));
}

document.querySelectorAll(".skin-wa[data-product]").forEach(link=>{
  link.href = waAvisoEstoque(link.dataset.product);
  link.target = "_blank";
  link.rel = "noopener";
  link.insertAdjacentHTML("afterbegin", WA_BALAO_ICON);
});

if(grid){
  // botão "limpar filtros" do estado vazio
  grid.addEventListener("click", e=>{ if(e.target.closest(".grid-reset")) resetFiltros(); });
  // adicionar ao pedido a partir dos cards / abrir detalhes
  grid.addEventListener("click", e=>{
    const btn = e.target.closest("[data-add]");
    if(btn){
      addToCart(btn.dataset.add);
      const lbl = btn.querySelector(".lbl");
      if(lbl && !btn.classList.contains("added")){
        const orig = lbl.textContent;
        btn.classList.add("added"); lbl.textContent = "Adicionado ✓";
        setTimeout(()=>{ btn.classList.remove("added"); lbl.textContent = orig; }, 1100);
      }
      return;
    }
    if(e.target.closest(".card-notify")) return;
    const card = e.target.closest(".card[data-nome]");
    if(card) openQuickView(card.dataset.nome);
  });
  // teclado: Enter/Espaço abre os detalhes do card
  grid.addEventListener("keydown", e=>{
    if(e.key!=="Enter" && e.key!==" ") return;
    const card = e.target.closest(".card[data-nome]");
    if(card && e.target===card){ e.preventDefault(); openQuickView(card.dataset.nome); }
  });
}

/* =====================================================================
   🛍️  MEU PEDIDO  (perfumes e skincare → 1 pedido no WhatsApp)
   ===================================================================== */
const cartEl       = document.getElementById("cart");
const cartOverlay  = document.getElementById("cartOverlay");
const cartBody     = document.getElementById("cartBody");
const cartFoot     = document.getElementById("cartFoot");
const cartCountEl  = document.getElementById("cartCount");
const cartTotalEl  = document.getElementById("cartTotal");
const cartFloat    = document.getElementById("cartFloat");
const cartSend     = document.getElementById("cartSend");

let produtosExtras = {};
try{ produtosExtras = JSON.parse(localStorage.getItem("duna_cart_products")||"{}"); }catch(e){ produtosExtras={}; }
const salvarProdutosExtras = ()=>{ try{ localStorage.setItem("duna_cart_products", JSON.stringify(produtosExtras)); }catch(e){} };
const porNome = Object.fromEntries([...PERFUMES, ...Object.values(produtosExtras)].map(p=>[p.nome,p]));

function produtoSkincareDoCard(card){
  if(!card) return null;
  const nome = card.querySelector("h3")?.textContent.trim();
  const marca = card.querySelector(".skin-brand")?.textContent.trim();
  const descricao = card.querySelector("p:not(.skin-brand)")?.textContent.trim() || "";
  const precoTexto = card.querySelector(".skin-price")?.textContent || "";
  const precoEncontrado = precoTexto.match(/R\$\s*(\d+)/);
  const foto = card.querySelector(".skin-photo img")?.getAttribute("src");
  if(!nome || !marca || !precoEncontrado || !foto) return null;
  return {
    nome, marca, preco:Number(precoEncontrado[1]),
    tamanho:descricao.split("·").pop().trim(), foto,
    disponivel:!card.classList.contains("is-soldout"), tipo:"skincare"
  };
}

document.querySelectorAll(".skin-card").forEach(card=>{
  const produto = produtoSkincareDoCard(card);
  if(!produto) return;
  produtosExtras[produto.nome] = produto;
  porNome[produto.nome] = produto;
});
if(document.querySelector(".skin-card")) salvarProdutosExtras();

let cart = {};
try{ cart = JSON.parse(localStorage.getItem("duna_cart")||"{}"); }catch(e){ cart={}; }
const salvarCart = ()=>{ try{ localStorage.setItem("duna_cart", JSON.stringify(cart)); }catch(e){} };
const totalItens = ()=> Object.values(cart).reduce((a,b)=>a+b,0);
const totalPreco = ()=> Object.entries(cart).reduce((s,[n,q])=> s + (porNome[n]&&temPreco(porNome[n]) ? porNome[n].preco*q : 0), 0);
// algum item do pedido está "Sob consulta"?
const cartTemSemPreco = ()=> Object.keys(cart).some(n=> porNome[n] && !temPreco(porNome[n]));

function bumpFloat(){ if(!cartFloat) return; cartFloat.classList.remove("bump"); void cartFloat.offsetWidth; cartFloat.classList.add("bump"); }
function addToCart(nome){ if(!estaDisponivel(porNome[nome])) return; cart[nome]=(cart[nome]||0)+1; salvarCart(); renderCart(); bumpFloat(); showToast(nome); }
document.querySelectorAll("[data-skin-add]").forEach(btn=>btn.addEventListener("click", ()=>{
  const produto = produtoSkincareDoCard(btn.closest(".skin-card"));
  if(produto) addToCart(produto.nome);
}));
function setQty(nome,d){ cart[nome]=(cart[nome]||0)+d; if(cart[nome]<=0) delete cart[nome]; salvarCart(); renderCart(); }
function removeItem(nome){ delete cart[nome]; salvarCart(); renderCart(); }
function abrirCart(){ if(!cartEl) return; cartEl.classList.add("open"); cartOverlay.classList.add("open"); document.body.classList.add("no-scroll"); }
function fecharCart(){ if(!cartEl) return; cartEl.classList.remove("open"); cartOverlay.classList.remove("open"); document.body.classList.remove("no-scroll"); }

function msgPedido(){
  const linhas = Object.entries(cart).filter(([n])=>porNome[n]).map(([n,q])=>{
    const p = porNome[n];
    return `• ${q}x ${nomeCompleto(p)} (${p.tamanho}) — ${precoTxt(p)}${q>1&&temPreco(p)?" cada":""}`;
  });
  const totalLinha = cartTemSemPreco()
    ? "Total: a combinar no atendimento"
    : `Total estimado: R$ ${totalPreco()}`;
  return `Olá, Duna! Quero fazer um pedido: 🌙\n\n${linhas.join("\n")}\n\n${totalLinha}\n\nPode confirmar a disponibilidade e o frete?`;
}

function renderCart(){
  if(!cartEl) return;
  const itens = Object.entries(cart).filter(([n])=>porNome[n]);
  const n = totalItens();
  cartCountEl.textContent = n;
  cartCountEl.classList.toggle("show", n>0);

  if(itens.length===0){
    cartBody.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 7h12l-1 13H7L6 7z" stroke-linejoin="round"/><path d="M9 7a3 3 0 016 0" stroke-linecap="round"/></svg>
      Seu pedido está vazio.<br>Adicione seus produtos favoritos.</div>`;
    cartFoot.classList.add("hidden");
    return;
  }
  cartBody.innerHTML = itens.map(([nome,q])=>{
    const p = porNome[nome];
    return `<div class="cart-item">
      <div class="ci-thumb">${frascoVisual(p)}</div>
      <div class="ci-info">
        <div class="ci-name">${p.marca ? p.marca+" " : ""}${nome}</div>
        <div class="ci-meta">${p.tamanho}</div>
        <div class="ci-price">${precoHTML(p)}</div>
      </div>
      <div class="ci-side">
        <div class="ci-qty">
          <button class="qbtn" data-dec="${nome}" aria-label="Menos um">−</button>
          <span class="qval">${q}</span>
          <button class="qbtn" data-inc="${nome}" aria-label="Mais um">+</button>
        </div>
        <button class="ci-remove" data-rem="${nome}">remover</button>
      </div>
    </div>`;
  }).join("");
  cartFoot.classList.remove("hidden");
  if(cartTemSemPreco()){ cartTotalEl.textContent = "A combinar"; }
  else { animateTotal(cartTotalEl, totalPreco()); }
  cartSend.href = waLink(msgPedido());
}

// contagem animada do total (R$)
function animateTotal(el, to){
  const from = parseInt((el.textContent||"").replace(/\D/g,""),10) || 0;
  if(from===to || reduceMotion){ el.textContent = "R$ " + to; return; }
  const t0 = performance.now(), dur = 380;
  (function step(t){
    const k = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-k,3);
    el.textContent = "R$ " + Math.round(from + (to-from)*e);
    if(k<1) requestAnimationFrame(step);
  })(t0);
}

if(cartEl){
  cartBody.addEventListener("click", e=>{
    const inc=e.target.closest("[data-inc]"), dec=e.target.closest("[data-dec]"), rem=e.target.closest("[data-rem]");
    if(inc) setQty(inc.dataset.inc,1);
    else if(dec) setQty(dec.dataset.dec,-1);
    else if(rem) removeItem(rem.dataset.rem);
  });
  cartFloat.addEventListener("click", abrirCart);
  document.getElementById("cartClose").addEventListener("click", fecharCart);
  document.getElementById("cartContinue").addEventListener("click", fecharCart);
  cartOverlay.addEventListener("click", fecharCart);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && cartEl.classList.contains("open")) fecharCart(); });
  renderCart();
}

/* =====================================================================
   🧭  QUIZ  (só na home)
   ===================================================================== */
const steps = document.querySelectorAll(".quiz-step");
if(steps.length){
  const answers = { gen:null, occ:null, int:null, fam:null };
  let stepIdx = 0;
  const progress = document.querySelectorAll("#quizProgress i");
  const resultBox = document.getElementById("quizResult");
  const quizBack = document.getElementById("quizBack");

  function updateBack(){
    if(quizBack) quizBack.classList.toggle("show", stepIdx>0 && !resultBox.classList.contains("active"));
  }

  document.querySelectorAll(".quiz-opt").forEach(opt=>{
    opt.addEventListener("click", ()=>{
      answers[opt.dataset.key] = opt.dataset.val;
      if(stepIdx < steps.length-1){
        steps[stepIdx].classList.remove("active");
        stepIdx++;
        steps[stepIdx].classList.add("active");
        progress[stepIdx].classList.add("on");
      } else {
        mostrarResultado();
      }
      updateBack();
    });
  });

  if(quizBack) quizBack.addEventListener("click", ()=>{
    if(stepIdx===0) return;
    steps[stepIdx].classList.remove("active");
    progress[stepIdx].classList.remove("on");
    stepIdx--;
    steps[stepIdx].classList.add("active");
    updateBack();
  });

  const ESCALA = ["suave","equilibrado","marcante","potente"];
  function scorePerfume(p){
    let s = 0;
    // 1) gênero — filtro mais forte
    if(answers.gen === "Tanto faz")      s += 2;                 // sem preferência: bônus leve a todos
    else if(p.genero === answers.gen)    s += 6;                 // bate exatamente
    else if(p.genero === "Unissex")      s += 4;                 // unissex serve pra qualquer escolha
    else                                 s -= 5;                 // gênero oposto: penaliza forte (sem zerar)
    // 2) família olfativa
    if(p.familia === answers.fam)        s += 5;
    // 3) intensidade (exata + proximidade)
    const d = Math.abs(ESCALA.indexOf(p.intensidade) - ESCALA.indexOf(answers.int));
    if(d===0) s += 3; else if(d===1) s += 1.5; else if(d===2) s += 0.5;
    // 4) ocasião
    if(p.ocasiao === answers.occ)        s += 2;
    if((answers.occ==="dia" || answers.occ==="trabalho") && p.periodo==="Versátil") s += 0.5;
    return s;
  }

  function mostrarResultado(){
    const ranked = PERFUMES
      .filter(estaDisponivel)
      .map((p,i)=>({ p, s:scorePerfume(p), i }))
      .sort((a,b)=> b.s - a.s || a.i - b.i);   // empate: mantém ordem do catálogo
    const best = ranked[0].p;
    const alts = ranked.slice(1,3).map(r=>r.p);

    steps.forEach(st=>st.classList.remove("active"));
    resultBox.classList.add("active");
    updateBack();

    document.getElementById("rBottle").innerHTML = frascoVisual(best);
    document.getElementById("rFam").textContent = (best.marca ? best.marca + " · " : "") + best.familia + " · " + best.selo;
    document.getElementById("rName").textContent = best.nome;
    document.getElementById("rDesc").textContent = best.desc;
    document.getElementById("rPrice").innerHTML = precoHTML(best) + " · " + best.tamanho;
    document.getElementById("rWa").href = waLink(
      `Olá, Duna! Fiz o teste no site e o resultado foi o *${nomeCompleto(best)}* (${best.tamanho})${temPreco(best) ? " — R$ " + best.preco : ""}. Quero saber mais! 🌙`
    );

    // alternativas que também combinam
    const altBox = document.getElementById("rAlts");
    if(altBox){
      altBox.innerHTML = `<p class="r-alts-title">Você também pode gostar</p>
        <div class="r-alts-grid">` + alts.map(p=>`
          <button class="r-alt" data-qv="${p.nome}" aria-label="Ver ${nomeCompleto(p)}">
            <span class="r-alt-bottle">${frascoVisual(p)}</span>
            <span class="r-alt-info">
              ${p.marca ? `<span class="r-alt-brand">${p.marca}</span>` : ""}
              <span class="r-alt-name">${p.nome}</span>
              <span class="r-alt-price">${precoTxt(p)}</span>
            </span>
          </button>`).join("") + `</div>`;
    }
  }

  // clicar numa alternativa abre os detalhes (quick-view)
  const altBox = document.getElementById("rAlts");
  if(altBox) altBox.addEventListener("click", e=>{
    const b = e.target.closest("[data-qv]");
    if(b && typeof openQuickView === "function") openQuickView(b.dataset.qv);
  });

  const rRestart = document.getElementById("rRestart");
  if(rRestart) rRestart.addEventListener("click", ()=>{
    stepIdx=0; answers.gen=answers.occ=answers.int=answers.fam=null;
    resultBox.classList.remove("active");
    steps.forEach((st,i)=>st.classList.toggle("active", i===0));
    progress.forEach((i,idx)=>i.classList.toggle("on", idx===0));
    updateBack();
  });
}

/* =====================================================================
   🌄  PARALLAX (hero) + NAV scroll
   ===================================================================== */
const nav = document.getElementById("nav");
const heroImg = document.querySelector(".hero-bg video, .hero-bg img");
const dunes = document.querySelectorAll(".dune");
let ticking=false;

function onScroll(){
  const y = window.scrollY;
  if(nav) nav.classList.toggle("scrolled", y>40);
  if(!reduceMotion){
    if(heroImg && y < window.innerHeight){
      heroImg.style.transform = `translateY(${y*0.18}px) scale(1.05)`;
    }
    dunes.forEach(d=>{
      const sp = parseFloat(d.dataset.speed)||0;
      if(y < window.innerHeight*1.2) d.style.transform = `translateY(${y*sp}px)`;
    });
  }
  // barra de progresso de leitura
  if(progressBar){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max>0 ? Math.min(1, y/max) : 0})`;
  }
  // botão voltar ao topo
  if(toTopBtn) toTopBtn.classList.toggle("show", y > 700);
  ticking=false;
}
window.addEventListener("scroll", ()=>{
  if(!ticking){ requestAnimationFrame(onScroll); ticking=true; }
}, { passive:true });

/* =====================================================================
   📱  MENU MOBILE (gaveta deslizante)
   ===================================================================== */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mmOverlay = document.getElementById("mmOverlay");
if(burger && mobileMenu && mmOverlay){
  const openMenu = ()=>{
    burger.classList.add("open"); burger.setAttribute("aria-expanded","true");
    mobileMenu.classList.add("open"); mobileMenu.setAttribute("aria-hidden","false");
    mmOverlay.classList.add("open"); document.body.classList.add("no-scroll");
  };
  const closeMenu = ()=>{
    burger.classList.remove("open"); burger.setAttribute("aria-expanded","false");
    mobileMenu.classList.remove("open"); mobileMenu.setAttribute("aria-hidden","true");
    mmOverlay.classList.remove("open"); document.body.classList.remove("no-scroll");
  };
  burger.addEventListener("click", ()=>{ mobileMenu.classList.contains("open") ? closeMenu() : openMenu(); });
  mmOverlay.addEventListener("click", closeMenu);
  document.querySelectorAll("[data-mm]").forEach(a=>a.addEventListener("click", closeMenu));
  const waM = document.getElementById("waMobile"); if(waM) waM.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeMenu(); });
}

/* =====================================================================
   ♾️  MARQUEE — duplica o conteúdo p/ loop infinito
   ===================================================================== */
const mq = document.getElementById("marquee");
if(mq) mq.innerHTML += mq.innerHTML;

// carrossel de depoimentos: duplica os cards p/ loop contínuo
const proofTrack = document.getElementById("proofTrack");
if(proofTrack) proofTrack.innerHTML += proofTrack.innerHTML;

/* =====================================================================
   🔔  TOAST — confirmação ao adicionar ao pedido
   ===================================================================== */
const toast = document.createElement("div");
toast.className = "toast"; toast.setAttribute("role","status"); toast.setAttribute("aria-live","polite");
document.body.appendChild(toast);
let toastTimer = null;
function showToast(nome){
  toast.innerHTML = `
    <span class="t-check"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M4 12.5l5 5L20 6.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <span><b>${nome}</b> foi para o seu pedido</span>
    <button class="t-view">Ver pedido</button>`;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"), 3200);
}
toast.addEventListener("click", e=>{
  if(e.target.closest(".t-view")){ toast.classList.remove("show"); abrirCart(); }
});

/* =====================================================================
   🔍  QUICK VIEW — modal de detalhes do perfume
   ===================================================================== */
const qvWrap = document.createElement("div");
qvWrap.innerHTML = `
  <div class="qv-overlay" id="qvOverlay"></div>
  <div class="qv" id="qv" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="qv-card">
      <button class="qv-close" id="qvClose" aria-label="Fechar detalhes">&times;</button>
      <div class="qv-left">
        <span class="card-pill pill-solid qv-pill" id="qvSelo"></span>
        <div class="frame-corners"><span></span><span></span><span></span><span></span></div>
        <div class="qv-bottle" id="qvBottle"></div>
      </div>
      <div class="qv-right">
        <p class="eyebrow" id="qvFam"></p>
        <h3 class="qv-name" id="qvName"></h3>
        <p class="qv-insp" id="qvInsp"></p>
        <p class="qv-desc" id="qvDesc"></p>
        <details class="qv-notes-help" id="qvNotesHelp">
          <summary>O que significam essas notas?</summary>
          <div class="qv-notes-help-content">
            <p><strong>Topo</strong><span>A primeira impressão, sentida logo após aplicar.</span></p>
            <p><strong>Coração</strong><span>Aparece em seguida e revela a personalidade do perfume.</span></p>
            <p><strong>Fundo</strong><span>Permanece por mais tempo e dá profundidade à fragrância.</span></p>
          </div>
        </details>
        <div class="qv-pyramid" id="qvNotes" aria-label="Pirâmide olfativa"></div>
        <div class="qv-meta">
          <span class="card-size" id="qvSize"></span>
          <span class="card-price" id="qvPrice"></span>
        </div>
        <div class="qv-actions">
          <button class="btn btn-gold" id="qvAdd">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
            Adicionar ao pedido
          </button>
          <a class="btn btn-line-dark" id="qvWa" href="#" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm4.4 12c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.1-.5 0a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.4.4 0 000-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 00-.7.3 2.8 2.8 0 00-.9 2.1A5 5 0 009 12.5a11 11 0 004.2 3.7c1.6.6 1.9.5 2.3.5s1.4-.6 1.6-1.1.2-1 .1-1.1z"/></svg>
            Pedir agora
          </a>
        </div>
      </div>
    </div>
  </div>`;
document.body.appendChild(qvWrap);

const qvEl = document.getElementById("qv");
const qvOverlay = document.getElementById("qvOverlay");
let qvNome = null, qvLastFocus = null;

function openQuickView(nome){
  const p = porNome[nome];
  if(!p) return;
  const disponivel = estaDisponivel(p);
  qvNome = nome;
  qvLastFocus = document.activeElement;
  document.getElementById("qvSelo").textContent = disponivel ? p.selo : "Esgotado";
  document.getElementById("qvBottle").innerHTML = frascoVisual(p);
  document.getElementById("qvFam").textContent = `${p.marca ? p.marca + " · " : ""}${p.familia} · ${p.genero} · ${p.periodo}`;
  document.getElementById("qvName").textContent = p.nome;
  document.getElementById("qvInsp").textContent = p.inspiracao;
  document.getElementById("qvDesc").textContent = p.desc;
  document.getElementById("qvNotesHelp").open = false;
  document.getElementById("qvNotes").innerHTML = piramideHTML(p);
  document.getElementById("qvSize").textContent = p.tamanho;
  document.getElementById("qvPrice").innerHTML = disponivel ? precoHTML(p) : (temPreco(p) ? `<small><s>R$</s></small> <s>${p.preco}</s>` : precoHTML(p));
  const qvAdd = document.getElementById("qvAdd");
  qvAdd.disabled = !disponivel;
  qvAdd.setAttribute("aria-disabled", String(!disponivel));
  qvAdd.lastChild.textContent = disponivel ? " Adicionar ao pedido" : " Esgotado no momento";
  const qvWa = document.getElementById("qvWa");
  qvWa.href = disponivel ? waProduto(p) : waAvisoEstoque(nomeCompleto(p));
  qvWa.lastChild.textContent = disponivel ? " Pedir agora" : " Avise-me quando voltar";
  qvEl.setAttribute("aria-label", `Detalhes de ${p.nome}`);
  qvEl.classList.add("open"); qvOverlay.classList.add("open");
  qvEl.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
  document.getElementById("qvClose").focus();
}
function closeQuickView(){
  qvEl.classList.remove("open"); qvOverlay.classList.remove("open");
  qvEl.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
  if(qvLastFocus && qvLastFocus.focus) qvLastFocus.focus();
}
document.getElementById("qvClose").addEventListener("click", closeQuickView);
qvOverlay.addEventListener("click", closeQuickView);
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && qvEl.classList.contains("open")) closeQuickView(); });
document.getElementById("qvAdd").addEventListener("click", ()=>{
  if(qvNome){ addToCart(qvNome); closeQuickView(); }
});

/* =====================================================================
   🧴  GUIA DE SKINCARE — explicação simples ao clicar no produto
   ===================================================================== */
const SKINCARE_GUIDE = {
  "345 Relief Cream": {
    serve:"Hidrata e ajuda a acalmar a pele sensibilizada, além de cuidar da aparência de marcas e do ressecamento.",
    indicado:"Para quem busca conforto, hidratação e uma rotina suave, inclusive em peles sensíveis ou com tendência a acne.",
    quando:"Dia e noite",
    ordem:"Depois do tônico e dos séruns, como último ou penúltimo passo da rotina.",
    cuidado:"De manhã, finalize sempre com protetor solar."
  },
  "Retinal Shot Tightening Booster": {
    serve:"Tratamento com retinal que ajuda a suavizar a aparência de linhas, textura irregular e poros, deixando a pele com aspecto mais firme.",
    indicado:"Para quem quer começar um cuidado mais intenso com sinais de idade, textura ou poros aparentes.",
    quando:"Somente à noite",
    ordem:"Com a pele limpa, aplique uma pequena quantidade nas áreas desejadas e depois use hidratante.",
    cuidado:"Se for iniciante, use em noites alternadas nas primeiras 2 semanas. Reduza a frequência se irritar e use protetor solar todos os dias."
  },
  "Deep Vita C Capsule Cream": {
    serve:"Creme hidratante com vitamina C que ajuda a dar luminosidade e a deixar o tom da pele com aparência mais uniforme.",
    indicado:"Para pele opaca, com tom desigual ou que precisa de mais viço e hidratação.",
    quando:"Dia e noite",
    ordem:"Misture as cápsulas com o gel, aplique depois do sérum no rosto e no pescoço.",
    cuidado:"Na rotina da manhã, finalize com protetor solar."
  },
  "Zero Pore Pad": {
    serve:"Discos que fazem uma esfoliação suave para retirar células mortas e excesso de oleosidade, ajudando na aparência de poros, cravos e textura.",
    indicado:"Para quem sente a pele áspera, oleosa ou com poros e cravos aparentes.",
    quando:"Dia ou noite",
    ordem:"Depois da limpeza: passe primeiro o lado texturizado, depois o lado liso e dê leves batidinhas. Não precisa enxaguar.",
    cuidado:"Se a pele for sensível, comece poucas vezes por semana e sem esfregar. Durante o dia, use protetor solar."
  },
  "PDRN Pink Peptide Serum": {
    serve:"Sérum hidratante que ajuda no viço, na aparência de firmeza e no tom irregular, deixando a pele com aspecto mais macio e luminoso.",
    indicado:"Para pele seca, opaca ou com perda de firmeza e elasticidade.",
    quando:"Dia e noite",
    ordem:"Com a pele limpa e seca, aplique no rosto e pescoço antes do hidratante.",
    cuidado:"De manhã, aplique o protetor solar depois do hidratante."
  },
  "No.9 NAD Bio Lifting Essence": {
    serve:"Essência voltada para firmeza e elasticidade, ajudando a suavizar a aparência de linhas finas e a deixar a pele mais preenchida.",
    indicado:"Para quem percebe perda de firmeza, linhas finas ou quer um cuidado de hidratação com foco em elasticidade.",
    quando:"Dia e noite",
    ordem:"Depois da limpeza e do tônico, antes do hidratante. Massageie suavemente até absorver.",
    cuidado:"Pode reaplicar uma pequena quantidade nas áreas com mais linhas. De manhã, finalize com protetor solar."
  }
};

const skinQvWrap = document.createElement("div");
skinQvWrap.innerHTML = `
  <div class="skin-qv-overlay" id="skinQvOverlay"></div>
  <div class="skin-qv" id="skinQv" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="skin-qv-card">
      <button class="qv-close" id="skinQvClose" aria-label="Fechar explicação">&times;</button>
      <div class="skin-qv-left">
        <span class="skin-qv-badge" id="skinQvStock"></span>
        <div class="skin-qv-photo"><img id="skinQvPhoto" src="" alt="" /></div>
      </div>
      <div class="skin-qv-right">
        <p class="eyebrow" id="skinQvBrand"></p>
        <h3 class="qv-name" id="skinQvName"></h3>
        <span class="skin-qv-time" id="skinQvTime"></span>
        <div class="skin-qv-explain">
          <section><span>Para que serve</span><p id="skinQvServe"></p></section>
          <section><span>Quando é indicado</span><p id="skinQvIndicado"></p></section>
          <section><span>Como usar na rotina</span><p id="skinQvOrdem"></p></section>
          <section class="skin-qv-care"><span>Atenção simples</span><p id="skinQvCuidado"></p></section>
        </div>
        <div class="skin-qv-meta">
          <span id="skinQvSize"></span><strong id="skinQvPrice"></strong>
        </div>
        <button class="btn btn-gold skin-qv-action" id="skinQvAdd" type="button">+ Adicionar ao pedido</button>
        <a class="btn btn-gold skin-qv-action" id="skinQvNotify" href="#" target="_blank" rel="noopener">${WA_BALAO_ICON}<span>Avise-me quando voltar</span></a>
        <p class="skin-qv-note">Guia prático de uso. Em caso de sensibilidade ou tratamento dermatológico, procure orientação profissional.</p>
      </div>
    </div>
  </div>`;
document.body.appendChild(skinQvWrap);

const skinQvEl = document.getElementById("skinQv");
const skinQvOverlay = document.getElementById("skinQvOverlay");
let skinQvNome = null, skinQvLastFocus = null;

function openSkinQuickView(card){
  const produto = produtoSkincareDoCard(card);
  const guia = produto && SKINCARE_GUIDE[produto.nome];
  if(!produto || !guia) return;
  skinQvNome = produto.nome;
  skinQvLastFocus = document.activeElement;
  const disponivel = produto.disponivel;
  const descricao = card.querySelector("p:not(.skin-brand)")?.textContent.trim() || "";
  const preco = card.querySelector(".skin-price")?.innerHTML || "";
  const notify = card.querySelector(".skin-wa[data-product]");
  document.getElementById("skinQvStock").textContent = disponivel ? "Disponível" : "Esgotado";
  document.getElementById("skinQvStock").classList.toggle("is-soldout", !disponivel);
  const photo = document.getElementById("skinQvPhoto");
  photo.src = produto.foto;
  photo.alt = `${produto.marca} ${produto.nome}`;
  document.getElementById("skinQvBrand").textContent = produto.marca;
  document.getElementById("skinQvName").textContent = produto.nome;
  document.getElementById("skinQvTime").textContent = guia.quando;
  document.getElementById("skinQvServe").textContent = guia.serve;
  document.getElementById("skinQvIndicado").textContent = guia.indicado;
  document.getElementById("skinQvOrdem").textContent = guia.ordem;
  document.getElementById("skinQvCuidado").textContent = guia.cuidado;
  document.getElementById("skinQvSize").textContent = descricao.split("·").pop().trim();
  document.getElementById("skinQvPrice").innerHTML = preco;
  document.getElementById("skinQvAdd").hidden = !disponivel;
  const notifyAction = document.getElementById("skinQvNotify");
  notifyAction.hidden = disponivel;
  if(notify) notifyAction.href = notify.href;
  skinQvEl.setAttribute("aria-label", `Como usar ${produto.marca} ${produto.nome}`);
  skinQvEl.classList.add("open");
  skinQvOverlay.classList.add("open");
  skinQvEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.getElementById("skinQvClose").focus();
}

function closeSkinQuickView(){
  skinQvEl.classList.remove("open");
  skinQvOverlay.classList.remove("open");
  skinQvEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if(skinQvLastFocus && skinQvLastFocus.focus) skinQvLastFocus.focus();
}

document.querySelectorAll(".skin-card").forEach(card=>{
  const produto = produtoSkincareDoCard(card);
  if(!produto || !SKINCARE_GUIDE[produto.nome]) return;
  card.addEventListener("click", e=>{
    if(e.target.closest(".skin-wa")) return;
    openSkinQuickView(card);
  });
});

document.getElementById("skinQvClose").addEventListener("click", closeSkinQuickView);
skinQvOverlay.addEventListener("click", closeSkinQuickView);
document.addEventListener("keydown", e=>{
  if(e.key === "Escape" && skinQvEl.classList.contains("open")) closeSkinQuickView();
});
document.getElementById("skinQvAdd").addEventListener("click", ()=>{
  if(skinQvNome){ addToCart(skinQvNome); closeSkinQuickView(); }
});

/* =====================================================================
   🃏  TILT 3D nos cards (desktop, ponteiro fino, sem reduced-motion)
   ===================================================================== */
(function initTilt(){
  if(reduceMotion || !grid) return;
  if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  let cur = null;
  const reset = c => { if(c) c.style.transform = ""; };
  grid.addEventListener("pointermove", e=>{
    const card = e.target.closest(".card");
    if(card !== cur){ reset(cur); cur = card; }
    if(!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform =
      `translateY(-8px) perspective(900px) rotateX(${((py-.5)*-7).toFixed(2)}deg) rotateY(${((px-.5)*7).toFixed(2)}deg)`;
    card.style.setProperty("--gx", (px*100).toFixed(1)+"%");
    card.style.setProperty("--gy", (py*100).toFixed(1)+"%");
  });
  grid.addEventListener("pointerleave", ()=>{ reset(cur); cur = null; });
})();

/* =====================================================================
   ✨  POEIRA DE OURO — canvas de partículas (hero e topo do catálogo)
   ===================================================================== */
function dustCanvas(host, {alpha=.65, dark=false, density=16}={}){
  const cv = document.createElement("canvas");
  cv.className = "fx-dust";
  host.appendChild(cv);
  const ctx = cv.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio||1);
  let w=0, h=0, parts=[], raf=null, visible=false;

  function size(){
    w = host.clientWidth; h = host.clientHeight;
    cv.width = w*dpr; cv.height = h*dpr;
    cv.style.width = w+"px"; cv.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.round(Math.min(90, w/density));
    parts = Array.from({length:n}, ()=>spawn(true));
  }
  function spawn(anyY){
    return {
      x: Math.random()*w,
      y: anyY ? Math.random()*h : h+8,
      r: .6 + Math.random()*1.7,
      vy: .12 + Math.random()*.4,
      amp: 14 + Math.random()*26,
      ph: Math.random()*Math.PI*2,
      tw: .4 + Math.random()*.9
    };
  }
  function tick(t){
    ctx.clearRect(0,0,w,h);
    const base = dark ? "133,102,41" : "230,200,140";
    parts.forEach((p,i)=>{
      p.y -= p.vy;
      const x = p.x + Math.sin(t*.0006 + p.ph)*p.amp*.08;
      const a = alpha * (.3 + .7*Math.abs(Math.sin(t*.001*p.tw + p.ph)));
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${base},${a.toFixed(3)})`;
      ctx.fill();
      if(p.y < -8) parts[i] = spawn(false);
    });
    raf = requestAnimationFrame(tick);
  }
  function play(){ if(!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); }
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }

  new IntersectionObserver(en=>{ visible = en[0].isIntersecting; visible ? play() : stop(); }).observe(host);
  document.addEventListener("visibilitychange", ()=>{ document.hidden ? stop() : play(); });
  window.addEventListener("resize", ()=>{ size(); }, { passive:true });
  size();
}
if(!reduceMotion){
  const heroHost = document.querySelector(".hero");
  const catHost  = document.querySelector(".cat-header");
  if(heroHost) dustCanvas(heroHost, { alpha:.7, dark:false, density:16 });
  if(catHost)  dustCanvas(catHost,  { alpha:.4, dark:true,  density:26 });
}

/* =====================================================================
   ⬆️  VOLTAR AO TOPO + BARRA DE PROGRESSO
   ===================================================================== */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

const toTopBtn = document.createElement("button");
toTopBtn.className = "to-top";
toTopBtn.setAttribute("aria-label","Voltar ao topo");
toTopBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
document.body.appendChild(toTopBtn);
toTopBtn.addEventListener("click", ()=>window.scrollTo({ top:0, behavior: reduceMotion ? "auto" : "smooth" }));

/* =====================================================================
   🚀  INIT
   ===================================================================== */
renderGrid();
initReveal();
onScroll();

// pré-loader: aparece só na primeira página da sessão; nas demais, entra direto
const _pre = document.getElementById("preloader");
let _preSeen = false;
try{ _preSeen = sessionStorage.getItem("duna_pre")==="1"; }catch(e){}
if(_pre && _preSeen){
  _pre.classList.add("done");
}else if(_pre){
  document.body.classList.add("no-scroll");
  let _preDone = false;
  const hidePre = ()=>{
    if(_preDone) return; _preDone = true;
    _pre.classList.add("done");
    document.body.classList.remove("no-scroll");
    try{ sessionStorage.setItem("duna_pre","1"); }catch(e){}
  };
  // mostra a marca por ~1,1s e sai — NÃO espera o vídeo/imagens (evita travar em conexão lenta)
  setTimeout(hidePre, 1100);
  // rede de segurança: se algo travar, garante a saída de qualquer forma
  setTimeout(hidePre, 4000);
}
