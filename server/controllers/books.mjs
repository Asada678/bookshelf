import { validationResult } from "express-validator"
import Book from '../models/book.mjs'

const getAllBooks = async (req, res) => {
  const books = await Book.find().sort({ updatedAt: -1 })
  res.json(books)
}

const getBookById = async (req, res) => {
  const _id = req.params.id
  // const books = await Book.findOne({_id : _id})
  const book = await Book.findById(_id)

  if (book === null) {
    return res.status(404).json({ msg: 'book not found' })
  }
  res.json(book)
}

const registerBook = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errs = errors.array()
    return res.status(400).json(errs)
  }

  const book = new Book(req.body)
  const newBook = await book.save()
  res.status(201).json(newBook)
}

const updateBook = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errs = errors.array()
    return res.status(400).json(errs)
  }
  const { title, description, comment, rating } = req.body
  const _id = req.params.id
  const book = await Book.findById(_id)

  if (book === null) {
    return res.status(404).json({ msg: 'book not found' })
  }

  if (title !== undefined) book.title = req.body.title
  if (description !== undefined) book.description = req.body.description
  if (comment !== undefined) book.comment = req.body.comment
  if (rating !== undefined) book.rating = req.body.rating

  const updatedBook = await book.save()
  res.json(updatedBook)
}

const deleteBook = async (req, res) => {
  try {
    const _id = req.params.id
    const { deletedCount } = await Book.deleteOne({ _id })
    if (deletedCount === 0) {
      return res.status(404).json({ msg: 'target book not found' })
    }
    res.json({ msg: "Delete success!" })

  } catch (err) {
    console.log('err:', err)
    res.status(500).json({ msg: 'invalid error occurred!' })
  }
}

export { getAllBooks, getBookById, registerBook, updateBook, deleteBook }