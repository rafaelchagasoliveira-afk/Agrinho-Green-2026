const botaoDarkMode = document.getElementById('botao-dark');
const linkAcessibilidade = document.getElementById('link-acessibilidade');
const painelAcessibilidade = document.getElementById('acessibilidade');

const btnAumentarFonte = document.getElementById('aumentar-fonte');
const btnDiminuirFonte = document.getElementById('diminuir-fonte');
const btnAtivarLeitura = document.getElementById('ativar-leitura');
const indicadorPorcentagem = document.getElementById('porcentagem-fonte'); // Captura o indicador de texto

let tamanhoFonteAtual = 100;
let leituraVozAtiva = false;
const sinteseVoz = window.speechSynthesis;

// Modo Escuro
botaoDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        botaoDarkMode.textContent = '☀️ Modo Claro';
    } else {
        botaoDarkMode.textContent = '🌙 Modo Escuro';
    }
});

// Painel Lateral de Acessibilidade
linkAcessibilidade.addEventListener('click', (evento) => {
    evento.preventDefault();
    painelAcessibilidade.classList.toggle('secao-escondida');
});

// Aumentar Texto
btnAumentarFonte.addEventListener('click', () => {
    if (tamanhoFonteAtual < 130) {
        tamanhoFonteAtual += 10;
        document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
        indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`; // Atualiza na tela
    }
});

// Diminuir Texto
btnDiminuirFonte.addEventListener('click', () => {
    if (tamanhoFonteAtual > 90) {
        tamanhoFonteAtual -= 10;
        document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
        indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`; // Atualiza na tela
    }
});

// Ouvir Texto
btnAtivarLeitura.addEventListener('click', () => {
    const blocosTexto = document.querySelectorAll('.ler');

    if (!leituraVozAtiva) {
        leituraVozAtiva = true;
        btnAtivarLeitura.textContent = '🛑 Parar Leitura';
        btnAtivarLeitura.style.backgroundColor = '#b22222';

        blocosTexto.forEach(bloco => {
            bloco.classList.add('foco-leitura');
            bloco.addEventListener('click', executarLeituraDoBloco);
        });
    } else {
        desativarLeituraCompleta(blocosTexto);
    }
});

function executarLeituraDoBloco(evento) {
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
        bloco.removeEventListener('click', executarLeituraDoBloco);
    });
}