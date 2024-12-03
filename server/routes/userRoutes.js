import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser} from '../controllers/userController.js';
import { isLoggedin,isAdmin } from '../middlewares/isLoggedin.js';
  // Correct import for isLoggedin middleware

const router = Router();

// Register Route
router.post('/signup', registerUser);

// Login Route
router.post('/login', loginUser);

router.get('/me', isLoggedin, getCurrentUser);













// User Routes
// router.get('/profile', isLoggedin, getUserProfile); // Get profile for logged-in user


// router.get('/profile/:id',isLoggedin,  getUserProfile );













// router.post('/profile/upload/:userId', isLoggedIn, upload.single('avatar'), uploadProfilePicture);

// Route to delete profile picture
// router.delete('/profile/delete/:userId', isLoggedIn, deleteProfilePicture);

// router.put('/profile/update/:userId', isLoggedIn, updateProfile);

//Route to change the password
// router.put('/profile/updatepassword/:userId', isLoggedIn,  updatePassword );



export default router;
