import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import User from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import { calculateFine } from "../utils/calculateFine.js";

export const recordBorrowedBook = catchAsyncError(async (req, res, next) => {

  const { id } = req.params;
  const { email } = req.body;
  const book = await Book.findById(id);


  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (book.quantity < 1) {
    return next(new ErrorHandler("Book not available", 404));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId?.toString() === id && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed", 400));
  }

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedAt: new Date(),
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await user.save();
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    price: book.price,
    quantity: 1,
    bookId: book._id,
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  res.status(200).json({
    success: true,
    message: "borrowed book recorded successfully",
  });
});

export const borrowedBooks = catchAsyncError(async (req, res) => {
    const {borrowedBooks} = req.user;
    res.status(200).json({
        succes:true,
        borrowedBooks
    });
});

export const getBorrowedBooksForAdmin = catchAsyncError(async (req, res) => {
    const borrowedBooks = await Borrow.find();
    res.status(200).json({
        succes:true,
        borrowedBooks
    });
});

export const returnBorrowedBooks = catchAsyncError(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  const book = await Book.findById(bookId);
  // console.log(book);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }
  const user = await User.findOne({ email, accountVerified: true });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const borrowedbooks = user.borrowedBooks.find(
    (b) => b.bookId?.toString() === bookId && b.returned === false
  );
 
  if (!borrowedbooks) {
    return next(new ErrorHandler("Book not borrowed hello", 400));
  }

  borrowedbooks.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    bookId: bookId,
    "user.email": email,
    returnedAt: null,
  });
  if (!borrow) {
    return next(new ErrorHandler("Book not borrowed hi", 400));
  }
  borrow.returnedAt = new Date();
  const fine = calculateFine(borrow.returnedAt);
  borrow.fine = fine;
  await borrow.save();
  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `Book returned successfully with a fine of ₹${fine + book.price}`
        : `Book returned successfully, total charges ₹${book.price}`,
  });
});
