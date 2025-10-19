const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/books.json");

// Baca data dari file JSON
const readBooks = () => {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// Simpan data ke file JSON
const writeBooks = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET semua buku
router.get("/", (req, res) => {
  const books = readBooks();
  res.json(books);
});

// POST tambah buku baru
router.post("/", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Title dan author wajib diisi" });
  }

  const books = readBooks();
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
  };
  books.push(newBook);
  writeBooks(books);

  res.status(201).json(newBook);
});

// PUT update buku berdasarkan ID
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "Title dan author wajib diisi" });
  }

  const books = readBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Buku tidak ditemukan" });
  }

  books[index] = { id, title, author };
  writeBooks(books);
  res.json(books[index]);
});

// DELETE hapus buku berdasarkan ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const books = readBooks();
  const newBooks = books.filter((b) => b.id !== id);

  if (books.length === newBooks.length) {
    return res.status(404).json({ error: "Buku tidak ditemukan" });
  }

  writeBooks(newBooks);
  res.json({ message: "Buku berhasil dihapus" });
});

module.exports = router;
