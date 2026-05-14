import catchAsyncError from "../middlewares/catchAsyncError.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";


export const addBook = catchAsyncError(async (req, res, next) => {

    const { title, author, price, description,  quantity, image, publisher } = req.body;
    if(!title || !author || !price || !description || !quantity || !image || !publisher ){
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const book = await Book.create({
        title,
        author,
        price,
        quantity,
        description,
        image,
        publisher,
    });
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book
    });
});
export const deleteBook = catchAsyncError(async(req, res, next)=> {

  const {id} = req.params;
  const book = await Book.findById(id); 
    if(!book){
        return next(new ErrorHandler("Book not found", 404));
    }   
    await book.deleteOne(); 
    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });

});

// Allows admin to add more copies of an existing book
export const restockBook = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new ErrorHandler("Please provide a valid quantity to add", 400));
  }

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  book.quantity += Number(quantity);
  book.availability = book.quantity > 0;
  await book.save();

  res.status(200).json({
    success: true,
    message: `Added ${quantity} copies. "${book.title}" now has ${book.quantity} copies in stock.`,
    book,
  });
});
export const getAllBook = catchAsyncError(async (req, res, next)=> {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books
    });
});

// Update any book fields — admin only
export const updateBook = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, author, price, description, image, publisher } = req.body;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (price !== undefined) book.price = Number(price);
  if (description !== undefined) book.description = description;
  if (image !== undefined && image !== "") book.image = image;
  if (publisher !== undefined) book.publisher = publisher;

  await book.save();

  res.status(200).json({
    success: true,
    message: `"${book.title}" has been updated successfully.`,
    book,
  });
});