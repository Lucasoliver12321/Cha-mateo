// =========================
// MENU HAMBÚRGUER
// =========================
const API = "http://localhost:3000";


const menu = document.querySelector('.menu-hamburguer');
const links = document.querySelector('.links');

if (menu && links) {
    menu.addEventListener('click', () => {

        if (links.style.display === 'flex') {
            links.style.display = 'none';
        } else {
            links.style.display = 'flex';
        }

    });
}

// =========================
// CONTADOR
// =========================

const dataEvento = new Date("2026-08-23T14:30:00");

function atualizarContador() {

    // Se a página não possui o contador, não faz nada
    if (
        !document.getElementById("dias") ||
        !document.getElementById("horas") ||
        !document.getElementById("minutos") ||
        !document.getElementById("segundos")
    ) {
        return;
    }

    const agora = new Date();
    const diferenca = dataEvento - agora;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    document.getElementById("dias").textContent = dias;
    document.getElementById("horas").textContent = horas;
    document.getElementById("minutos").textContent = minutos;
    document.getElementById("segundos").textContent = segundos;
}

// Só inicia o contador se os elementos existirem
if (document.getElementById("dias")) {
    atualizarContador();
    setInterval(atualizarContador, 1000);
}

// =========================
// FORMULÁRIO
// =========================

const formulario = document.getElementById('formConfirmacao');

if (formulario) {

    formulario.addEventListener('submit', async function(event){
    event.preventDefault();

    const dados = {
    nome: formulario.nome.value,
    comparecer: document.querySelector('input[name="comparecer"]:checked')?.value || 0,
    acompanhantes: formulario.acompanhantes.value,
    mensagem: formulario.mensagem.value
};

localStorage.setItem("nomeConvidado", formulario.nome.value);

    console.log("Enviando...");
    console.log(dados);

    try {
        const resposta = await fetch(`${API}/confirmar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();
        alert(resultado.mensagem);

        window.location.href = "presentinho.html";

    } catch (erro) {
        alert("Erro ao enviar confirmação.");
    }
    });
}

// ======================================
// ELEMENTOS
// ======================================

const btnFraldas = document.querySelectorAll(".btn-fralda");

const modalMimo = document.getElementById("modalMimo");
const nomePresente = document.getElementById("nomePresente");

const btnFechar = document.querySelector(".fechar-modal");
const btnCancelar = document.getElementById("cancelarModal");
const btnConfirmarMimo = document.getElementById("confirmarMimo");

const mimos = document.querySelectorAll(".mimo-card");

const btnPresentes = document.querySelectorAll("#presentes-especiais .btn-presente");

const modalFinal = document.getElementById("modalFinal");
const resumoEscolha = document.getElementById("resumoEscolha");
const btnVoltar = document.getElementById("voltarEscolha");
const btnConfirmar = document.getElementById("confirmarEscolha");

const btnFinal = document.getElementById("btnConfirmarFinal");


// ======================================
// VARIÁVEIS GLOBAIS
// ======================================

let presenteSelecionado = "";
let mimoSelecionado = "";


// ======================================
// FRALDAS
// ======================================

btnFraldas.forEach(btn => {
    btn.addEventListener("click", () => {

        presenteSelecionado = btn.dataset.id || "";

        nomePresente.textContent =
            btn.closest(".card")?.querySelector("h2")?.innerText || "";

        modalMimo.style.display = "flex";
    });
});


// ======================================
// MIMOS
// ======================================

mimos.forEach(card => {
    card.addEventListener("click", () => {

        mimos.forEach(i => i.classList.remove("ativo"));
        card.classList.add("ativo");

        mimoSelecionado = card.dataset.mimo || "";

        btnConfirmarMimo.disabled = false;

        console.log("MIMO:", mimoSelecionado);
    });
});


// ======================================
// CONFIRMAR MIMO
// ======================================

if (btnConfirmarMimo) {

    btnConfirmarMimo.addEventListener("click", () => {

        if (!mimoSelecionado) {
            alert("Escolha um mimo primeiro");
            return;
        }

        modalMimo.style.display = "none";

        resumoEscolha.textContent =
            presenteSelecionado + " + " + mimoSelecionado;

        modalFinal.style.display = "flex";
    });
}


// ======================================
// FECHAR MODAL MIMO
// ======================================

function fecharModalMimo() {
    modalMimo.style.display = "none";
    mimos.forEach(i => i.classList.remove("ativo"));
    mimoSelecionado = "";
}

btnFechar?.addEventListener("click", fecharModalMimo);
btnCancelar?.addEventListener("click", fecharModalMimo);

window.addEventListener("click", (e) => {
    if (e.target === modalMimo) fecharModalMimo();
});


// ======================================
// PRESENTES ESPECIAIS
// ======================================

btnPresentes.forEach(btn => {

    btn.addEventListener("click", function () {

        presenteSelecionado = this.dataset.id;

        resumoEscolha.textContent =
            this.closest(".card")
            .querySelector("h2")
            .innerText;

        mimoSelecionado = "";

        modalFinal.style.display = "flex";

    });

});


// ======================================
// FECHAR MODAL FINAL
// ======================================

btnVoltar?.addEventListener("click", () => {
    modalFinal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modalFinal) {
        modalFinal.style.display = "none";
    }
});


// =====================
// CONFIRMAR ESCOLHA 
// =====================


if (btnConfirmar) {

    btnConfirmar.addEventListener("click", async () => {

        console.log("ENVIANDO:");
        console.log("presente:", presenteSelecionado);
        console.log("mimo:", mimoSelecionado);

        if (!presenteSelecionado) {
            alert("Nenhum presente selecionado");
            return;
        }

        try {

                const resposta = await fetch(`${API}/reservar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    presente_id: presenteSelecionado,
                    nome: localStorage.getItem("nomeConvidado") || "Convidado",
                    comparecer: 1,
                    acompanhantes: 0,
                    telefone: "",
                    mimo: mimoSelecionado || ""
                })
            });


            const resultado = await resposta.json();

            console.log("RESPOSTA:", resultado);

            alert(resultado.mensagem);

            modalFinal.style.display = "none";

        } catch (erro) {

            console.error("ERRO:", erro);
            alert("Erro ao salvar presente.");

        }

    });

}