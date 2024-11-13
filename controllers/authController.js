const bcrypt = require('bcrypt');
const db = require('../models'); // Import the models

const login = async (req, res) => {
  const { identifier, password } = req.body; // Use a common identifier field

  try {
    // First, try to find a user by username (Admin)
    let user = await db.User.findOne({ where: { username: identifier } });

    // If user not found, check if it's a student
    if (!user) {
      user = await db.Student.findOne({ where: { studentId: identifier } });
    }

    // If still not found, check if it's an instructor
    if (!user) {
      user = await db.Instructor.findOne({ where: { instructorId: identifier } });
    }

    // Log the found user
    console.log("User found:", user);

    if (!user) {
      return res.status(400).send('Invalid username, student ID, or password');
    }

    // Verify the password
    const validPassword = bcrypt.compareSync(password, user.password);
    console.log("Password valid:", validPassword);

    if (!validPassword) {
      return res.status(400).send('Invalid username, student ID, or password');
    }

    // Redirect based on the type of user
    if (user instanceof db.Student) { // Student login
      return res.render('student', { fname: user.fname }); // Pass fname to the view
    } else if (user instanceof db.Instructor) { // Instructor login
      return res.render('instructor', { funame: user.funame }); // Render instructor view
    } else if (user instanceof db.User) { // Admin login
      return res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  login
};
