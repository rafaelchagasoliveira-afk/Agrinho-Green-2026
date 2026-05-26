const botaoDarkMode = document.getElementById('botao-dark');
const linkAcessibilidade = document.getElementById('link-acessibilidade');
const painelAcessibilidade = document.getElementById('acessibilidade');
const btnFecharAcessibilidade = document.getElementById('fechar-acessibilidade');

const btnAumentarFonte = document.getElementById('aumentar-fonte');
const btnDiminuirFonte = document.getElementById('diminuir-fonte');
const btnAtivarLeitura = document.getElementById('ativar-leitura');
const indicadorPorcentagem = document.getElementById('porcentagem-fonte');

let tamanhoFonteAtual = 100;
let leituraVozAtiva = false;
const sinteseVoz = window.speechSynthesis;

// 1. Lógica do Modo Escuro
if (botaoDarkMode) {
    botaoDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            botaoDarkMode.textContent = '☀️ Modo Claro';
        } else {
            botaoDarkMode.textContent = '🌙 Modo Escuro';
        }
    });
}

// 2. Lógica do Painel de Acessibilidade (Abrir/Fechar no link)
if (linkAcessibilidade && painelAcessibilidade) {
    linkAcessibilidade.addEventListener('click', (evento) => {
        evento.preventDefault();
        painelAcessibilidade.classList.toggle('secao-escondida');
    });
}

// Lógica dedicada para fechar o painel no botão X
if (btnFecharAcessibilidade && painelAcessibilidade) {
    btnFecharAcessibilidade.addEventListener('click', (evento) => {
        evento.preventDefault();
        painelAcessibilidade.classList.add('secao-escondida');
    });
}

// 3. Lógica de Aumentar Fonte
if (btnAumentarFonte && indicadorPorcentagem) {
    btnAumentarFonte.addEventListener('click', () => {
        if (tamanhoFonteAtual < 130) {
            tamanhoFonteAtual += 10;
            document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
            indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`;
        }
    });
}

// 4. Lógica de Diminuir Fonte
if (btnDiminuirFonte && indicadorPorcentagem) {
    btnDiminuirFonte.addEventListener('click', () => {
        if (tamanhoFonteAtual > 90) {
            tamanhoFonteAtual -= 10;
            document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
            indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`;
        }
    });
}

// 5. Lógica de Ouvir Texto
if (btnAtivarLeitura) {
    btnAtivarLeitura.addEventListener('click', () => {
        const blocosTexto = document.querySelectorAll('.ler');

        if (!leituraVozAtiva) {
            leituraVozAtiva = true;
            btnAtivarLeitura.textContent = '🛑 Parar Leitura';
            btnAtivarLeitura.style.backgroundColor = '#b22222';

            blocosTexto.forEach(bloco => {
                bloco.classList.add('foco-leitura');
                bloco.addEventListener('click', ejecutarLeituraDoBloco);
            });
        } else {
            desativarLeituraCompleta(blocosTexto);
        }
    });
}

function ejecutarLeituraDoBloco(evento) {
    sinteseVoz.cancel(); 
    const textoParaLer = evento.currentTarget.textContent;
    const fala = new SpeechSynthesisUtterance(textoParaLer);
    fala.lang = 'pt-BR';
    sinteseVoz.speak(fala);
}

function desativarLeituraCompleta(blocos) {
    leituraVozAtiva = false;
    sinteseVoz.cancel();
    btnAtivarLeitura.textContent = '🔊 Ouvir Texto';
    btnAtivarLeitura.style.backgroundColor = 'var(--verde)';

    blocos.forEach(bloco => {
        bloco.classList.remove('foco-leitura');
        bloco.removeEventListener('click', ejecutarLeituraDoBloco);
    });
}
