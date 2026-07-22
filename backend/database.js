// Importa o sqlite3
const sqlite3 = require("sqlite3").verbose();

// Cria ou abre o banco banco.db
const db = new sqlite3.Database("banco.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Banco conectado com sucesso!");
    }
});

console.log("Banco conectado com sucesso!");

db.serialize(() => {
    
    // TABELA CONFIRMAÇÃO DE PRESENÇA
    db.run(`
        CREATE TABLE IF NOT EXISTS confirmacoes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            comparecer INTEGER NOT NULL,
            acompanhantes INTEGER NOT NULL DEFAULT 0,
            mensagem TEXT,
            data_confirmacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


    // TABELA PRESENTES
    db.run(`
        CREATE TABLE IF NOT EXISTS presentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            categoria TEXT NOT NULL,
            descricao TEXT,
            quantidade_total INTEGER NOT NULL,
            quantidade_disponivel INTEGER NOT NULL,
            possui_mimo INTEGER DEFAULT 0
        )
    `);


    // TABELA RESERVAS
    db.run(`
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            presente_id INTEGER NOT NULL,
            nome_convidado TEXT NOT NULL,
            telefone TEXT,
            comparecer INTEGER NOT NULL DEFAULT 1,
            acompanhantes INTEGER NOT NULL DEFAULT 0,
            mimo TEXT,
            data_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (presente_id) REFERENCES presentes(id)
        )
    `);


    // INSERE PRESENTES SE A TABELA ESTIVER VAZIA
    db.get(
        "SELECT COUNT(*) AS total FROM presentes",
        (err, resultado) => {

            if (err) {
                console.log(err);
                return;
            }

            if (resultado.total === 0) {

                const inserir = db.prepare(`
                    INSERT INTO presentes
                    (
                        nome,
                        categoria,
                        descricao,
                        quantidade_total,
                        quantidade_disponivel,
                        possui_mimo
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `);


                const presentes = [
                    ["Fralda RN", "Fraldas", "Pampers ou Huggies", 3, 3, 1],
                    ["Fralda P", "Fraldas", "Pampers ou Huggies", 8, 8, 1],
                    ["Fralda M", "Fraldas", "Pampers ou Huggies", 15, 15, 1],
                    ["Fralda G", "Fraldas", "Pampers ou Huggies", 12, 12, 1],
                    ["Fralda GG", "Fraldas", "Pampers ou Huggies", 8, 8, 1],

                    ["Cesto de Roupa Suja", "Especial", "", 1, 1, 0],
                    ["Cesto de Fralda Suja", "Especial", "", 1, 1, 0],
                    ["Kit Baldes ou Bacias", "Especial", "", 1, 1, 0],
                    ["Lençóis de Berço", "Especial", "", 3, 3, 0],
                    ["Fraldas de Pano", "Especial", "", 5, 5, 0],
                    ["Roupinhas", "Especial", "", 6, 6, 0],
                    ["Sapatinhos", "Especial", "", 5, 5, 0],
                    ["Ninho Redutor de Berço", "Especial", "", 1, 1, 0]
                ];


                presentes.forEach((presente) => {
                    inserir.run(presente);
                });


                inserir.finalize();

                console.log("Presentes cadastrados!");

            }

        }
    );

});

module.exports = db;