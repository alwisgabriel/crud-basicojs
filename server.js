const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let tasks = [];
let idAtual = 1;

/* ======================
   LISTAR
====================== */
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

/* ======================
   CRIAR
====================== */
app.post("/tasks", (req, res) => {
    const { texto } = req.body;

    const agora = new Date();
    const hora = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const novaTarefa = {
        id: idAtual++,
        texto,
        hora,
        status: "pendente"
    };

    tasks.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

/* ======================
   ATUALIZAR
====================== */
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const tarefa = tasks.find(t => t.id === id);
    if (!tarefa) return res.sendStatus(404);

    if (req.body.texto !== undefined)
        tarefa.texto = req.body.texto;

    if (req.body.status !== undefined)
        tarefa.status = req.body.status;

    res.json(tarefa);
});

/* ======================
   DELETAR
====================== */
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.sendStatus(204);
});

/* ======================
   START
====================== */
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
