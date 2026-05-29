// =========================================================
// SELEÇÃO DE ELEMENTOS
// =========================================================
const botaoDarkMode = document.getElementById('botao-dark');
const linkAcessibilidade = document.getElementById('link-acessibilidade');
const painelAcessibilidade = document.getElementById('acessibilidade');
const btnFecharAcessibilidade = document.getElementById('fechar-acessibilidade');
const btnAumentarFonte = document.getElementById('aumentar-fonte');
const btnDiminuirFonte = document.getElementById('diminuir-fonte');
const btnAtivarLeitura = document.getElementById('ativar-leitura');
const indicadorPorcentagem = document.getElementById('porcentagem-fonte');

// =========================================================
// VARIÁVEIS GLOBAIS
// =========================================================
let tamanhoFonteAtual = 100;
let leituraVozAtiva = false;
const sinteseVoz = window.speechSynthesis;

// Variáveis dos jogos
let pontuacaoQuiz = 0;
let pontuacaoClicker = 0;
let pontuacaoMemoria = 0;
let melhorScoreQuiz = 0;
let melhorScoreClicker = 0;
let melhorScoreMemoria = 0;

// Variáveis de controle do Quiz
let indicePerguntaAtual = 0;
let tempoRestanteQuiz = 60;
let intervaloQuiz = null;
let jogoQuizAtivo = false;

// =========================================================
// 1. CARREGAR PREFERÊNCIAS DO USUÁRIO (localStorage)
// =========================================================
function carregarPreferencias() {
    const fonteSalva = localStorage.getItem('tamanhoFonte');
    if (fonteSalva) {
        tamanhoFonteAtual = parseInt(fonteSalva);
        document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
        if (indicadorPorcentagem) {
            indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`;
        }
    }
}
carregarPreferencias();

// =========================================================
// 2. MODO ESCURO COM PERSISTÊNCIA
// =========================================================
if (botaoDarkMode) {
    botaoDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const estaEscuro = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', estaEscuro);
        botaoDarkMode.textContent = estaEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    });
}

// =========================================================
// 3. PAINEL DE ACESSIBILIDADE
// =========================================================
if (linkAcessibilidade && painelAcessibilidade) {
    linkAcessibilidade.addEventListener('click', (evento) => {
        evento.preventDefault();
        painelAcessibilidade.classList.toggle('secao-escondida');
    });
}
if (btnFecharAcessibilidade && painelAcessibilidade) {
    btnFecharAcessibilidade.addEventListener('click', (evento) => {
        evento.preventDefault();
        painelAcessibilidade.classList.add('secao-escondida');
    });
}

// =========================================================
// 4. CONTROLE DE FONTE
// =========================================================
if (btnAumentarFonte && indicadorPorcentagem) {
    btnAumentarFonte.addEventListener('click', () => {
        if (tamanhoFonteAtual < 130) {
            tamanhoFonteAtual += 10;
            document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
            indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`;
            localStorage.setItem('tamanhoFonte', tamanhoFonteAtual);
        }
    });
}
if (btnDiminuirFonte && indicadorPorcentagem) {
    btnDiminuirFonte.addEventListener('click', () => {
        if (tamanhoFonteAtual > 90) {
            tamanhoFonteAtual -= 10;
            document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
            indicadorPorcentagem.textContent = `Tamanho atual: ${tamanhoFonteAtual}%`;
            localStorage.setItem('tamanhoFonte', tamanhoFonteAtual);
        }
    });
}

// =========================================================
// 5. LEITURA EM VOZ ALTA
// =========================================================
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

// Scroll Suave
const linkJogos = document.getElementById('link-jogos');
if (linkJogos) {
    linkJogos.addEventListener('click', (evento) => {
        evento.preventDefault();
        const secaoJogos = document.getElementById('secao-jogos');
        if (secaoJogos) {
            secaoJogos.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// =========================================================
// 6. QUIZ AGRINHO RÁPIDO (UMA PERGUNTA POR VEZ + CRONÔMETRO 2 MIN)
// =========================================================
const perguntas = [
    {
        pergunta: "O que é plantio direto?",
        opcoes: ["Plantar sem arar o solo", "Arar muito a terra", "Usar só máquinas pesadas", "Desflorestar áreas"],
        correta: 0,
        dica: "Plantio direto reduz erosão e economiza água! 💧"
    },
    {
        pergunta: "Qual prática aumenta a sustentabilidade?",
        opcoes: ["Monocultura intensiva", "Rotação de culturas", "Uso excessivo de pesticidas", "Queimada de resíduos"],
        correta: 1,
        dica: "A rotação de culturas protege o solo e evita pragas! 🌱"
    },
    {
        pergunta: "Como a tecnologia ajuda o agro?",
        opcoes: ["Aumentando poluição", "Prevendo clima e identificando pragas", "Destruindo florestas", "Reduzindo emprego"],
        correta: 1,
        dica: "Apps como Agritempo e Plantix ajudam muito! 📱"
    },
    {
        pergunta: "O Brasil é referência em qual área do agro?",
        opcoes: ["Uso de pesticidas", "Produção sustentável e pesquisa", "Desmatamento", "Irrigação manual"],
        correta: 1,
        dica: "Brasil alimenta o mundo de forma responsável! 🌍"
    },
    {
        pergunta: "Qual é o tema do Agrinho 2026?",
        opcoes: ["Agro Fraco, Futuro Incerto", "Agro Forte, Futuro Sustentável", "Agro Antigo, Futuro Lento", "Agro Perdido"],
        correta: 1,
        dica: "Equilíbrio entre produção e meio ambiente! 🌾"
    }
];

function iniciarQuiz() {
    pontuacaoQuiz = 0;
    indicePerguntaAtual = 0;
    tempoRestanteQuiz = 120;
    jogoQuizAtivo = true;

    clearInterval(intervaloQuiz);

    // Inicia o cronômetro regressivo de 2 minuto real
    intervaloQuiz = setInterval(() => {
        if (tempoRestanteQuiz > 0 && jogoQuizAtivo) {
            tempoRestanteQuiz--;
            const txtTempo = document.getElementById('tempo-quiz-display');
            if (txtTempo) txtTempo.textContent = tempoRestanteQuiz;
        } else if (tempoRestanteQuiz === 0) {
            clearInterval(intervaloQuiz);
            jogoQuizAtivo = false;
            finalizarQuiz();
        }
    }, 1000);

    mostrarPerguntaQuiz();
}

function mostrarPerguntaQuiz() {
    const containerQuiz = document.getElementById('container-quiz');
    if (!containerQuiz) return;

    containerQuiz.innerHTML = '';

    // Painel superior de informações dentro do card
    const divHeader = document.createElement('div');
    divHeader.style.display = 'flex';
    divHeader.style.justify = 'space-between';
    divHeader.style.marginBottom = '1.2rem';
    divHeader.style.fontWeight = 'bold';
    divHeader.style.color = 'var(--verde-escuro)';
    divHeader.innerHTML = `
        <span>⏱️ Tempo: <strong id="tempo-quiz-display">${tempoRestanteQuiz}</strong>s</span>
        <span>⭐ Pontos: ${pontuacaoQuiz}/100</span>
    `;
    containerQuiz.appendChild(divHeader);

    const perguntaAtual = perguntas[indicePerguntaAtual];

    const divPergunta = document.createElement('div');
    divPergunta.className = 'pergunta-quiz';
    divPergunta.innerHTML = `
        <h3>Pergunta ${indicePerguntaAtual + 1}/5: ${perguntaAtual.pergunta}</h3>
        <div class="opcoes-quiz">
            ${perguntaAtual.opcoes.map((opcao, i) => `
                <button class="opcao-quiz" data-opcao="${i}">
                    ${String.fromCharCode(65 + i)}) ${opcao}
                </button>
            `).join('')}
        </div>
        <div id="espaco-dica-quiz"></div>
    `;
    containerQuiz.appendChild(divPergunta);

    const botoesOpcoes = divPergunta.querySelectorAll('.opcao-quiz');
    botoesOpcoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const escolha = parseInt(e.target.dataset.opcao);

            botoesOpcoes.forEach(btn => btn.disabled = true);

            const espacoDica = document.getElementById('espaco-dica-quiz');

            if (escolha === perguntaAtual.correta) {
                pontuacaoQuiz += 20;
                e.target.style.backgroundColor = '#28a745';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#28a745';
            } else {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#dc3545';

                botoesOpcoes[perguntaAtual.correta].style.backgroundColor = '#28a745';
                botoesOpcoes[perguntaAtual.correta].style.color = 'white';
                botoesOpcoes[perguntaAtual.correta].style.borderColor = '#28a745';
            }

            document.getElementById('score-quiz').textContent = pontuacaoQuiz;

            const divDica = document.createElement('div');
            divDica.className = 'dica-quiz ler';
            divDica.textContent = perguntaAtual.dica;
            espacoDica.appendChild(divDica);

            const btnProxima = document.createElement('button');
            btnProxima.className = 'btn-finalizar-quiz';
            btnProxima.style.marginTop = '1rem';
            btnProxima.textContent = indicePerguntaAtual < perguntas.length - 1 ? 'Próxima Pergunta ➡️' : 'Finalizar Quiz 🏁';
            
            btnProxima.addEventListener('click', () => {
                if (indicePerguntaAtual < perguntas.length - 1) {
                    indicePerguntaAtual++;
                    mostrarPerguntaQuiz();
                } else {
                    clearInterval(intervaloQuiz);
                    jogoQuizAtivo = false;
                    finalizarQuiz();
                }
            });
            espacoDica.appendChild(btnProxima);
        });
    });
}

function finalizarQuiz() {
    clearInterval(intervaloQuiz);
    jogoQuizAtivo = false;

    if (pontuacaoQuiz > melhorScoreQuiz) {
        melhorScoreQuiz = pontuacaoQuiz;
        atualizarRankingVisual();
    }

    const porcentagemAcertos = (pontuacaoQuiz / 100) * 100;
    const containerQuiz = document.getElementById('container-quiz');
    
    containerQuiz.innerHTML = `
        <div class="resultado-jogo ler">
            <h2>Parabéns! 🎉</h2>
            <p class="pontuacao-final">Você acertou <strong>${porcentagemAcertos.toFixed(0)}%</strong>!</p>
            <p class="melhor-score ler">Seu Recorde: <strong>${melhorScoreQuiz} pontos</strong></p>
            <button class="btn-jogar-novamente ler" onclick="iniciarQuiz()">Jogar Novamente</button>
        </div>
    `;
}

// =========================================================
// 7. JOGO DA MEMÓRIA SUSTENTÁVEL
// =========================================================
const cartasMemoria = [
    { emoji: '🌾' }, { emoji: '💧' }, { emoji: '🌱' },
    { emoji: '🤖' }, { emoji: '🌍' }, { emoji: '☀️' }
];
let cartasEmbaralhadas = [];
let cartasFlipped = [];
let pairsEncontrados = 0;

function iniciarMemoria() {
    const containerMemoria = document.getElementById('container-memoria');
    if (!containerMemoria) return;

    pontuacaoMemoria = 0;
    pairsEncontrados = 0;
    cartasFlipped = [];
    containerMemoria.innerHTML = '';

    cartasEmbaralhadas = [...cartasMemoria, ...cartasMemoria].sort(() => Math.random() - 0.5);

    const gridCartas = document.createElement('div');
    gridCartas.className = 'grid-memoria';

    cartasEmbaralhadas.forEach((carta, index) => {
        const divCarta = document.createElement('div');
        divCarta.className = 'carta-memoria';
        divCarta.innerHTML = '?';
        divCarta.dataset.index = index;
        divCarta.dataset.emoji = carta.emoji;
        divCarta.addEventListener('click', () => virarCarta(divCarta));
        gridCartas.appendChild(divCarta);
    });

    containerMemoria.appendChild(gridCartas);
}

function virarCarta(carta) {
    if (cartasFlipped.length >= 2 || carta.classList.contains('flipped')) return;

    carta.textContent = carta.dataset.emoji;
    carta.classList.add('flipped');
    cartasFlipped.push(carta);

    if (cartasFlipped.length === 2) {
        const [carta1, carta2] = cartasFlipped;
        
        if (carta1.dataset.emoji === carta2.dataset.emoji) {
            pontuacaoMemoria += 20;
            pairsEncontrados++;
            document.getElementById('score-memoria').textContent = pontuacaoMemoria;
            cartasFlipped = [];

            if (pairsEncontrados === cartasMemoria.length) {
                setTimeout(finalizarMemoria, 500);
            }
        } else {
            setTimeout(() => {
                carta1.textContent = '?';
                carta2.textContent = '?';
                carta1.classList.remove('flipped');
                carta2.classList.remove('flipped');
                cartasFlipped = [];
            }, 800);
        }
    }
}

function finalizarMemoria() {
    const containerMemoria = document.getElementById('container-memoria');
    if (pontuacaoMemoria > melhorScoreMemoria) {
        melhorScoreMemoria = pontuacaoMemoria;
        atualizarRankingVisual();
    }
    containerMemoria.innerHTML = `
        <div class="resultado-jogo ler">
            <h2>Excelente! 🎉</h2>
            <p class="pontuacao-final">Memória concluída com sucesso!</p>
            <button class="btn-jogar-novamente ler" onclick="iniciarMemoria()">Jogar Novamente</button>
        </div>
    `;
}

// =========================================================
// 8. CLICKER DA PRODUÇÃO
// =========================================================
let clicksClicker = 0;
let tempoRestante = 60;
let jogoClickerAtivo = false;

function iniciarClicker() {
    const containerClicker = document.getElementById('container-clicker');
    if (!containerClicker) return;

    clicksClicker = 0;
    tempoRestante = 60;
    jogoClickerAtivo = true;

    containerClicker.innerHTML = `
        <div class="area-clicker">
            <h2>Clique no Campo! 🌾</h2>
            <p class="tempo-clicker">Tempo: <strong id="tempo-display">60</strong>s</p>
            <p class="clicks-clicker">Cliques: <strong id="clicks-display">0</strong></p>
            <button class="btn-campo" id="btn-clicar">CLIQUE AQUI! 🌾</button>
        </div>
    `;

    document.getElementById('btn-clicar').addEventListener('click', () => {
        if (jogoClickerAtivo) {
            clicksClicker++;
            document.getElementById('clicks-display').textContent = clicksClicker;
            document.getElementById('score-clicker').textContent = clicksClicker * 10;
        }
    });

    const intervalo = setInterval(() => {
        if (tempoRestante > 0 && jogoClickerAtivo) {
            tempoRestante--;
            document.getElementById('tempo-display').textContent = tempoRestante;
        } else {
            clearInterval(intervalo);
            jogoClickerAtivo = false;
            finalizarClicker();
        }
    }, 1000);
}

function finalizarClicker() {
    const containerClicker = document.getElementById('container-clicker');
    pontuacaoClicker = clicksClicker * 10;

    if (pontuacaoClicker > melhorScoreClicker) {
        melhorScoreClicker = pontuacaoClicker;
        atualizarRankingVisual();
    }

    containerClicker.innerHTML = `
        <div class="resultado-jogo">
            <h2>Tempo Esgotado! ⏰</h2>
            <p class="pontuacao-final">Sua pontuação: <strong>${pontuacaoClicker} pontos</strong></p>
            <button class="btn-jogar-novamente" onclick="iniciarClicker()">Jogar Novamente</button>
        </div>
    `;
}

function atualizarRankingVisual() {
    if(document.getElementById('ranking-quiz')) document.getElementById('ranking-quiz').textContent = `${melhorScoreQuiz} pontos`;
    if(document.getElementById('ranking-memoria')) document.getElementById('ranking-memoria').textContent = `${melhorScoreMemoria} pontos`;
    if(document.getElementById('ranking-clicker')) document.getElementById('ranking-clicker').textContent = `${melhorScoreClicker} pontos`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-iniciar-quiz')?.addEventListener('click', iniciarQuiz);
    document.getElementById('btn-iniciar-memoria')?.addEventListener('click', iniciarMemoria);
    document.getElementById('btn-iniciar-clicker')?.addEventListener('click', iniciarClicker);
    atualizarRankingVisual();
});
