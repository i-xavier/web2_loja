import express from 'express';
import { pool } from './db.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Slide 16: Listar produtos 
app.get('/produtos', async (req, res) => {

  const {busca} = req.query;

  //filtro ?
  if (busca) {
    const [rows] = await pool.execute(
      'SELECT id, nome, preco, estoque FROM produto WHERE nome LIKE ? ORDER BY id', [`%${busca}%`]
    );

    return res.json(rows)
  }

  const [rows] = await pool.execute(
    'SELECT id, nome, preco, estoque FROM produto ORDER BY id'
  );

  res.json(rows);
});

// Slide 16: Buscar produto por ID
app.get('/produtos/:id', async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM produto WHERE id = ?',
    [req.params.id]
  );
  if (rows.length === 0)
    return res.status(404).json({ erro: 'Não encontrado' });
  res.json(rows[0]);
});

// Slide 17 e 21: Incluir produto com tratamento de erro
app.post('/produtos', async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO produto (nome, preco, estoque) VALUES (?, ?, ?)',
      [nome, preco, estoque ?? 0]
    );
    res.status(201).json({ id: result.insertId, nome, preco });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Dados inválidos' });
  }
});

// Slide 18: Atualizar produto
app.put('/produtos/:id', async (req, res) => {
  const { nome, preco, estoque } = req.body;
  const [result] = await pool.execute(
    'UPDATE produto SET nome = ?, preco = ?, estoque = ? WHERE id = ?',
    [nome, preco, estoque, req.params.id]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ erro: 'Não encontrado' });
  res.json({ mensagem: 'Atualizado' });
});

// Slide 18: Excluir produto
app.delete('/produtos/:id', async (req, res) => {
  const [result] = await pool.execute(
    'DELETE FROM produto WHERE id = ?',
    [req.params.id]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ erro: 'Não encontrado' });
  res.status(204).end();
});

app.get('/categorias', async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT id, nome FROM categoria ORDER BY id'
  );
  res.json(rows);
});

app.post('/categorias', async (req, res) => {
  try {
    const { nome } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO categoria (nome) VALUES (?)', [nome]
    );

    res.status(201).json({ id: result.insertId, nome });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Dados inválidos' });
  }
});

// Slide 21: Tratando erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno' });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});