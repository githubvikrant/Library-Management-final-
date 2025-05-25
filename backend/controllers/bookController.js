import catchAsyncError from "../middlewares/catchAsyncError.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";


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
export const getAllBook = catchAsyncError(async (req, res, next)=> {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books
    });
});