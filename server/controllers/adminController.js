import User from '../models/User.js'; // Correct import

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    console.log("Users fetched:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};


// Admin: Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameter
    await User.findByIdAndDelete(id); // Delete the user from the database
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user' });
  }
};
