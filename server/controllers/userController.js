import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, mobile_number, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, mobile_number, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Payload with user ID (used for generating the token)
    const payload = {
      user: { id: user._id, role:user.role }  // Use _id for consistency
    };

    // Sign the JWT token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT sign error:', err.message);
        return res.status(500).json({ msg: 'Server error' });
      }

      // Send token and user details in the response
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // Optionally include role if needed
        }
      });
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};


// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists in the database
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }
//     // console.log(user);
//     // Check if the password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Payload with user ID (used for generating the token)
//     const payload = {
//       user: { id: user._id }  // Use _id for consistency
//     };
//     console.log(user._id);
//     // Sign the JWT token
//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;

//       // Send token and user details in the response
//       res.json({
//         token,
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role, // Optionally include role if needed
//         }
//       });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };


export const getCurrentUser = async (req, res) => {
  try {
    // Ensure Authorization header exists
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details using decoded ID (ensure 'id' is correct)
    const user = await User.findById(decoded.user.id).select('-password'); // Assuming decoded.user contains the user info

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send back user details
    res.json(user);
  } catch (err) {
    console.error('Error in getCurrentUser:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get User Profile
// export const getUserDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log('Received ID:', id); // Log the ID
//     const user = await User.findById(id).select('-password');
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     console.log('User details:', user); // Log user details
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Middleware to check if the user is an admin
// export const isAdmin = (req, res, next) => {
//   const token = req.headers['authorization'];

//   if (!token) return res.status(403).json({ msg: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(500).json({ msg: "Failed to authenticate token" });

//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ msg: "Access denied" });
//     }

//     req.userId = decoded.id; // Store the user ID if needed later
//     next();
//   });
// };

// // Admin: Get all users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll(); // Fetch all users
//     // res.json(users);
//     console.log(users);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Admin: Delete a user
// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params; // Get the user ID from the URL parameter
//     await User.findByIdAndDelete(id); // Delete the user from the database
//     res.json({ msg: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Error deleting user' });
//   }
// };

// // Get user profile for current user
// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: 'Error fetching user profile' });
//   }
// };
