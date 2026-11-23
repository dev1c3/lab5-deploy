const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const Book = require('./models/Book');
const swaggerDocument = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/openapi.json', (req, res) => res.json(swaggerDocument));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Підключено до MongoDB'))
  .catch((err) => console.error('Помилка підключення до MongoDB:', err));

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Книгу не знайдено' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: 'Некоректний формат ID' });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Книгу не знайдено' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Книгу не знайдено' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Некоректний формат ID' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
  console.log(`Документація OpenAPI (Swagger): http://localhost:${PORT}/api-docs`);
});

// Логування часу виконання кожного запиту
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Ендпоїнт для перевірки стану сервісу
app.get('/health', (req, res) => {
  const memoryMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
  res.status(200).json({
    status: 'OK',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Number(memoryMB),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});