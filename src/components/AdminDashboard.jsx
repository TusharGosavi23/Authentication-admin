import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/users', {  // Ensure this URL is correct
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Users fetched:', response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
  
    fetchUsers();
  }, []);
  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in');
        return;
      }

      await axios.delete(`http://localhost:5000/api/users/${id}`, { // Correct API URL
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter(user => user._id !== id)); // Remove the deleted user from state
      alert('User deleted');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email} 
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
