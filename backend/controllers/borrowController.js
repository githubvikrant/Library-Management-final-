import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import User from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import { calculateFine } from "../utils/calculateFine.js";

export const recordBorrowedBook = catchAsyncError(async (req, res, next) => {

  const { id } = req.params;
  // If admin provides an email in the body, use that user.
  // Otherwise (regular user borrowing for themselves), use req.user directly.
  const { email } = req.body;
  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Find borrower: admin can specify any user's email; regular user borrows for themselves
  const borrower = email
    ? await User.findOne({ email })
    : req.user;

  if (!borrower) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (book.quantity < 1) {
    return next(new ErrorHandler("Book is not available", 404));
  }

  const isAlreadyBorrowed = borrower.borrowedBooks.find(
    (b) => b.bookId?.toString() === id && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed by this user", 400));
  }

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  borrower.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedAt: new Date(),
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await borrower.save();
  await Borrow.create({
    user: {
      id: borrower._id,
      name: borrower.name,
      email: borrower.email,
    },
    price: book.price,
    quantity: 1,
    bookId: book._id,
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    success: true,
    message: `"${book.title}" borrowed successfully!`,
  });
});

export const borrowedBooks = catchAsyncError(async (req, res) => {
  // Query the Borrow collection as the single source of truth,
  // preventing mismatch with the embedded array.
  const borrowedBooks = await Borrow.find({ "user.id": req.user._id }).populate(
    "bookId",
    "title price"
  );
  res.status(200).json({
    success: true,
    borrowedBooks
  });
});

export const getBorrowedBooksForAdmin = catchAsyncError(async (req, res) => {
  const borrowedBooks = await Borrow.find().populate("bookId", "title price");
  res.status(200).json({
    success: true,
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
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Use Borrow collection as the single source of truth
  const borrow = await Borrow.findOne({
    bookId: bookId,
    "user.email": email,
    returnedAt: null,
  });

  if (!borrow) {
    return next(new ErrorHandler("Active borrow record not found for this book and user.", 400));
  }

  // Mark Borrow document as returned
  borrow.returnedAt = new Date();
  // BUG FIX: Pass the due date (returnDate) to calculateFine, not the current return time (returnedAt)
  const fine = calculateFine(borrow.returnDate);
  borrow.fine = fine;
  await borrow.save();

  // Update Book inventory
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Maintain backward compatibility with the embedded array if it exists
  const embeddedBorrow = user.borrowedBooks.find(
    (b) => b.bookId?.toString() === bookId && b.returned === false
  );
  if (embeddedBorrow) {
    embeddedBorrow.returned = true;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `Book returned successfully with a fine of ₹${fine + book.price}`
        : `Book returned successfully, total charges ₹${book.price}`,
  });
});

// Admin: update the due date of a borrow record
export const updateReturnDate = catchAsyncError(async (req, res, next) => {
  const { borrowId } = req.params;
  const { returnDate } = req.body;

  if (!returnDate) {
    return next(new ErrorHandler("Please provide a new return date", 400));
  }

  const newDate = new Date(returnDate);
  if (isNaN(newDate.getTime())) {
    return next(new ErrorHandler("Invalid date format", 400));
  }

  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  if (borrow.returnedAt) {
    return next(new ErrorHandler("This book has already been returned", 400));
  }

  borrow.returnDate = newDate;
  await borrow.save();

  res.status(200).json({
    success: true,
    message: "Return date updated successfully.",
    borrow,
  });
});
