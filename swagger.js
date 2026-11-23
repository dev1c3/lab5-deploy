const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Books REST API (Лабораторна робота №3)',
    version: '1.0.0',
    description: 'REST API для керування каталогом книг на Node.js, Express та MongoDB',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Локальний сервер розробки',
    },
  ],
  components: {
    schemas: {
      Book: {
        type: 'object',
        required: ['title', 'author'],
        properties: {
          _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
          title: { type: 'string', example: 'Кобзар' },
          author: { type: 'string', example: 'Тарас Шевченко' },
          year: { type: 'integer', example: 1840 },
        },
      },
      BookInput: {
        type: 'object',
        required: ['title', 'author'],
        properties: {
          title: { type: 'string', example: 'Тіні забутих предків' },
          author: { type: 'string', example: 'Михайло Коцюбинський' },
          year: { type: 'integer', example: 1911 },
        },
      },
    },
  },
  paths: {
    '/api/books': {
      get: {
        summary: 'Отримати список усіх книг',
        responses: {
          200: {
            description: 'Успішна відповідь зі списком книг',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Додати нову книгу',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BookInput' },
            },
          },
        },
        responses: {
          201: { description: 'Книгу успішно створено' },
          400: { description: 'Помилка валідації даних' },
        },
      },
    },
    '/api/books/{id}': {
      get: {
        summary: 'Отримати книгу за ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Дані книги' },
          404: { description: 'Книгу не знайдено' },
        },
      },
      put: {
        summary: 'Оновити книгу за ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BookInput' },
            },
          },
        },
        responses: {
          200: { description: 'Книгу оновлено' },
          404: { description: 'Книгу не знайдено' },
        },
      },
      delete: {
        summary: 'Видалити книгу за ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          204: { description: 'Книгу видалено' },
          404: { description: 'Книгу не знайдено' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;