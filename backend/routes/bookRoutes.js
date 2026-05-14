import { isAuthenticated , isAuthorized} from "../middlewares/authMiddleware.js";
import {
    addBook,
    deleteBook,
    getAllBook,
    restockBook,
    updateBook,
} from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("admin"), addBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("admin"), updateBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("admin"), deleteBook);
router.patch("/restock/:id", isAuthenticated, isAuthorized("admin"), restockBook);
router.get("/all", isAuthenticated, getAllBook);

export default router;