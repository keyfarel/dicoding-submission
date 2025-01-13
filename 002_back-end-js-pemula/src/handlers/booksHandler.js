const books = require('../data/books');

const {nanoid} = require('nanoid');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (readPage < 0) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih kecil dari 0',
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const timestamp = new Date().toISOString();

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt: timestamp,
    updatedAt: timestamp,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

module.exports = {addBookHandler};


const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let filteredBooks = books;

  if (name) {
    const nameLowerCase = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(nameLowerCase));
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const bookSummaries = filteredBooks.map(({id, name, publisher}) => ({
    id,
    name,
    publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: bookSummaries,
    },
  }).code(200);
};


const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }
  return {
    status: 'success',
    data: {
      book,
    },
  };
};

const updateBookHandler = (request, h) => {
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  if (readPage < 0) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih kecil dari 0',
    }).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200);
};

const deleteBookHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }

  books.splice(index, 1);

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};