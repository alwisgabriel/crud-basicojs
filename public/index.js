const inputEntrada = document.getElementById("entrada");

let listaDeTarefas = [];

/* ======================
   CARREGAR TAREFAS
====================== */
function carregarTarefas() {
    fetch("/tasks")
        .then(res => res.json())
        .then(tarefas => {
            listaDeTarefas = tarefas;
            mostrar();
        });
}

document.addEventListener("DOMContentLoaded", carregarTarefas);

/* ======================
   SALVAR
====================== */
function salvarDados() {
    const valor = inputEntrada.value.trim();
    if (!valor) return;

    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: valor })
    }).then(() => {
        inputEntrada.value = "";
        carregarTarefas();
    });
}

/* ======================
   MOSTRAR
====================== */
function mostrar() {
    const ul = document.getElementById("resultados");
    ul.innerHTML = "";

    listaDeTarefas.forEach(tarefa => {
        ul.innerHTML += `
            <li class="tarefa ${tarefa.status === "concluida" ? "concluida" : ""}">
                <input type="checkbox"
                    ${tarefa.status === "concluida" ? "checked" : ""}
                    onchange="alternarStatus(${tarefa.id})">

                <span>
                    ${tarefa.texto}
                    <small>(${tarefa.hora})</small>
                </span>

                <div>
                    <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                    <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                </div>
            </li>
        `;
    });

    atualizarContador();
}

/* ======================
   CONTADOR
====================== */
function atualizarContador() {
    const contador = document.getElementById("contadorConcluidas");
    const concluidas = listaDeTarefas.filter(t => t.status === "concluida");
    contador.innerText = concluidas.length
        ? `Tarefas concluídas: ${concluidas.length}`
        : "";
}

/* ======================
   STATUS
====================== */
function alternarStatus(id) {
    const tarefa = listaDeTarefas.find(t => t.id === id);

    fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: tarefa.status === "pendente" ? "concluida" : "pendente"
        })
    }).then(carregarTarefas);
}

/* ======================
   EDITAR
====================== */
function editarTarefa(id) {
    const tarefa = listaDeTarefas.find(t => t.id === id);
    const novoTexto = prompt("Editar tarefa:", tarefa.texto);
    if (!novoTexto) return;

    fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoTexto })
    }).then(carregarTarefas);
}

/* ======================
   EXCLUIR
====================== */
function excluirTarefa(id) {
    if (!confirm("Excluir tarefa?")) return;

    fetch(`/tasks/${id}`, { method: "DELETE" })
        .then(carregarTarefas);
}
