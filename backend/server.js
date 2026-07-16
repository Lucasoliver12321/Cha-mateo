const cors = require('cors');
const db = require('./database');
const express = require('express');

const app = express();

app.use(express.json());
app.use(cors());


// suas rotas aqui...


const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res)=>{
    res.send('servidor rodando!');
});

// Rota para confirmar presença
app.post('/confirmar', (req, res) => {

    console.log("CONFIRMAÇÃO RECEBIDA:");
    console.log(req.body);

    const { nome, comparecer, acompanhantes, mensagem } = req.body;

    db.run(
        `INSERT INTO confirmacoes
        (nome, comparecer, acompanhantes, mensagem)
        VALUES (?, ?, ?, ?)`,
        [nome, comparecer, acompanhantes, mensagem],
        function(err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.status(201).json({
                mensagem: 'Confirmação salva com sucesso!',
                id: this.lastID
            });

        }
    );

});

app.get('/presentes', (req, res) => {
    db.all(
        'SELECT * FROM presentes',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }
            res.json(rows);
        }
    );
});

// Rota para reservar um presente
app.post('/reservar', (req, res) => {

    console.log("RESERVA RECEBIDA:");
    console.log(req.body);

    const { 
        presente_id,
        nome,
        telefone,
        comparecer,
        acompanhantes,
        mimo
    } = req.body;

    // Verifica se o presente ainda está disponível
    db.get(
        `SELECT quantidade_disponivel
         FROM presentes
         WHERE id = ?`,
        [presente_id],
        (err, presente) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!presente) {
                return res.status(404).json({
                    mensagem: 'Presente não encontrado.'
                });
            }

            if (presente.quantidade_disponivel <= 0) {
                return res.status(400).json({
                    mensagem: 'Este presente não está mais disponível.'
                });
            }

            // Atualiza a quantidade disponível
            db.run(
                `UPDATE presentes
                 SET quantidade_disponivel = quantidade_disponivel - 1
                 WHERE id = ?`,
                [presente_id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            erro: err.message
                        });
                    }

                 db.run(
    `
    INSERT INTO reservas
    (
        presente_id,
        nome_convidado,
        telefone,
        comparecer,
        acompanhantes,
        mimo
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
        presente_id,
        nome,
        telefone,
        comparecer,
        acompanhantes,
        mimo
    ],
    function(err) {

        if (err) {
            console.log("ERRO DO SQLITE:");
            console.log(err.message);

            return res.status(500).json({
                erro: err.message
            });
        }

        console.log("SALVO COM ID:", this.lastID);

        res.json({
            mensagem: "Presente reservado!",
            id: this.lastID
                           });

                       }
                    );
                }
            );

        }
    );

});



