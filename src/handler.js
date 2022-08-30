const books = require('./books');
const { nanoid } = require('nanoid');

const addBooks = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage;

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
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const nameFail = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    nameFail.code(400);
    return nameFail;
  } else if (readPage > pageCount) {
    const readFail = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    readFail.code(400);
    return readFail;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooks = () => ({
  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  },
});

const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
  } else {
    const idFail = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    idFail.code(404);
    return idFail;
  }

  if (name === undefined) {
    const nameFail = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    nameFail.code(400);
    return nameFail;
  } else if (readPage > pageCount) {
    const readFail = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    readFail.code(400);
    return readFail;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getBookByQuery = (request, h) => {
  const { name } = request.query.name;

  const book = books.filter((book) => book.name === name);

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooks,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
