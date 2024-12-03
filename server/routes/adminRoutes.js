import { Router } from 'express';
import { isAdmin, verifyToken } from '../middlewares/isLoggedin.js'; // Import isAdmin middleware
import { getAllUsers, deleteUser } from '../controllers/adminController.js'; // Import admin controller

const router = Router();

// Admin routes
router.get('/users', verifyToken, isAdmin, getAllUsers); // Admin can see all users
router.delete('/users/:id', isAdmin, deleteUser); // Admin can delete users

export default router;
