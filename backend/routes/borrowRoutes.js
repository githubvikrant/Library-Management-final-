import express from "express";
import {
 
  borrowedBooks,
  getBorrowedBooksForAdmin,
  recordBorrowedBook,
  returnBorrowedBooks,
 
} from "../controllers/borrowController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/record-borrowed-book/:id", isAuthenticated, isAuthorized("admin"),recordBorrowedBook);
router.get("/borrowed-books-by-all-users", isAuthenticated, isAuthorized("admin"),getBorrowedBooksForAdmin);
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);
router.put("/return-borrowed-book/:bookId",isAuthenticated,isAuthorized("admin"),returnBorrowedBooks);  

export default router;