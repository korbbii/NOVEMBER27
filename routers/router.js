const express = require("express");
const path = require("path");
const { login } = require("../controllers/authController");
const { saveSection, getSection } = require("../controllers/studentController");
const { User } = require('../models');
const db = require("../models");
const bcrypt = require("bcrypt");
const { Student,Instructor } = require("../models");
const { Subject, Section} = require("../models");

const routes = express.Router();

// Serve index.ejs at the /login route
routes.get("/login", (req, res) => {
  res.render("index"); // No need for file extension if you're using EJS
});

routes.get('/api/getCounts', async (req, res) => {
  try {
    const studentsCount = await Student.count();
    const instructorsCount = await Instructor.count();
    res.json({ studentsCount, instructorsCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching counts' });
  }
});

// Serve dashboard.ejs after successful login
routes.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

routes.get("/history", (req, res) => {
  res.render("history");
});

routes.get("/questionnaire", (req, res) => {
  res.render("questionnaire");
});

// Serve evaluate.ejs at the /evaluate route
routes.get("/evaluate", (req, res) => {
  res.render("evaluate");
});

// Update section by ID
routes.put("/section/:id", async (req, res) => {
  const sectionId = req.params.id; // Get ID from the request parameters
  const { section_name, section_block, section_yearLevel} = req.body; // Get updated data from request body

  try {
    const section = await db.Section.findByPk(sectionId); // Find the section
    if (!section) {
      return res.status(404).json({ message: 'Section not found.' }); // Handle not found case
    }

    // Update the section
    section.section_name = section_name;
    section.section_block = section_block;
    section.section_yearLevel = section.yearLevel;
    await section.save(); // Save changes to the database

    res.json(section); // Respond with the updated section
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Include error message in response
  }
});

// Serve students.ejs at the /students route
routes.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll(); // Fetch all students from the database
    res.render("students", { students }); // Pass students to the view
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send('Internal Server Error'); // Handle error properly
  }
});

// Add a new student
routes.post("/students", async (req, res) => {
  try {
    console.log(req.body); // Log the entire request body

    const { studentId, fname, yearLevel, block, password, subjects } = req.body; // Destructure the incoming data

    console.log("Name:", fname); // Log the name to ensure it's being captured

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student in the database
    await Student.create({
      studentId,
      fname,
      yearLevel,
      block,
      password: hashedPassword,
      subjects
    });
    // Redirect to /students to see the updated list
    res.redirect("/students");
  } catch (error) {
    console.error("Error adding student:", error);
    return res.status(500).send('Internal Server Error'); // Return to prevent further code execution
  }
});

// Update a student's information
routes.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, fname, yearLevel, block, password, subjects } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Optionally hash password if updating
    const updatedStudent = await Student.update(
      {
        studentId,
        fname,
        yearLevel,
        block,
        password: hashedPassword,
        subjects,
      },
      { where: { id } }
    );

    res.redirect("/students");
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send('Internal Server Error');
  }
});

routes.get("/instructors", async (req, res) => {
  try {
    const instructors = await Instructor.findAll(); // Fetch all instructors from the database
    res.render("instructors", { instructors }); // Pass instructors to the view
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).send('Internal Server Error'); // Handle error properly
  }
});

// Add a new instructors
routes.post("/instructors", async (req, res) => {
  try {
    console.log(req.body); // Log the entire request body

    const { instructorId, funame, password, subjects } = req.body; // Destructure the incoming data
    console.log("Name:", funame); // Log the name to ensure it's being captured
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new instructor in the database
    await Instructor.create({
      instructorId,
      funame,
      password: hashedPassword,
      subjects
    });

    // Redirect to /instructors to see the updated list
    res.redirect("/instructors");
  } catch (error) {
    console.error("Error adding instructor:", error);
    return res.status(500).send('Internal Server Error'); // Return to prevent further code execution
  }
});

routes.get("/1subjects", async (req, res) => {
  try {
    const subjects = await Subject.findAll(); // Fetch all subjects from the database
    res.render("1subjects", { subjects }); // Pass subjects to the view
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send('Internal Server Error'); // Handle error properly
  }
});

// Add a new subjects
routes.post("/1subjects", async (req, res) => {
  try {
    console.log(req.body); // Log the entire request body

    const { subjectId, sname, unit, time, type } = req.body; // Destructure the incoming data
    console.log("Name:", sname); // Log the name to ensure it's being captured

    // Create a new subject in the database
    await Subject.create({
      subjectId,
      sname,
      unit,
      time,
      type
    });

    // Redirect to /subjects to see the updated list
    res.redirect("/1subjects");
  } catch (error) {
    console.error("Error adding subject:", error);
    return res.status(500).send('Internal Server Error'); // Return to prevent further code execution
  }
});

routes.get("/2subjects", async (req, res) => {
  try {
    const subjects = await Subject.findAll(); // Fetch all subjects from the database
    res.render("2subjects", { subjects }); // Pass subjects to the view
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send('Internal Server Error'); // Handle error properly
  }
});

routes.get("/3subjects", async (req, res) => {
  try {
    const subjects = await Subject.findAll(); // Fetch all subjects from the database
    res.render("3subjects", { subjects }); // Pass subjects to the view
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send('Internal Server Error'); // Handle error properly
  }
});

routes.get("/4subjects", async (req, res) => {
  try {
    const subjects = await Subject.findAll(); // Fetch all subjects from the database
    res.render("4subjects", { subjects }); // Pass subjects to the view
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send('Internal Server Error'); // Handle error properly
  }
});
// Handle form submission for saving section
routes.post("/1section", saveSection);
routes.post("/2section", saveSection);
routes.post("/3section", saveSection);
routes.post("/4section", saveSection);

routes.get('/student', (req, res) => {
    console.log('req.user:', req.user);
    const fname = req.user ? req.user.fname : 'Student';
    res.render('student', { fname });
});

routes.get("/report", (req, res) => {
  res.render("report");
});

routes.get("/statistics", (req, res) => {
  res.render("statistics");
});

routes.get("/summary", (req, res) => {
  res.render("summary");
});

routes.get('/instructor', (req, res) => {
  console.log('req.user:', req.user);
  const funame = req.user ? req.user.funame : '';
  res.render('instructor', { funame });
});

// Serve user.ejs at the /users route
routes.get("/users", (req, res) => {
  res.render("user");
});

// Serve subjects.ejs at the /subjects route
routes.get("/1subjects", (req, res) => {
  res.render("1subjects");
});

// Login route
routes.post("/login", login);

//USER MANAGEMENT
// Get all users (for display)
routes.get('/users/list', async (req, res) => {
  const users = await User.findAll();
  res.json(users); // Return the users as JSON
});

// Update a specific user by ID
routes.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, username, password } = req.body;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user with new data
    user.name = name;
    user.username = username;

    // Only update the password if it is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      user.password = hashedPassword;
    }


    await user.save();
    res.json(user); // Return the updated user
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Get a specific user by ID
routes.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE user by ID
routes.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});

// Add a new user
routes.post('/users', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = await User.create({ name, username, password: hashedPassword });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Fetch user by ID for editing
routes.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { studentId, yearLevel, block, fname, password, subjects } = req.body;

  try {
      const student = await Student.findOne({ where: { studentId: id } });
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      // Update student fields
      student.studentId = studentId;
      student.yearLevel = yearLevel;
      student.block = block;
      student.fname = fname;
      student.subjects = subjects;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with salt rounds of 10
        student.password = hashedPassword; // Save the hashed password
    }

      await student.save(); // Save the updated student

      res.status(200).json(student);
  } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Failed to update student" });
  }
});

// Add a new student in the /api/students route (also hashed)
routes.post("/api/students", async (req, res) => {
  try {
    const { studentId, yearLevel, block, fname, password, subjects } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
      studentId,
      yearLevel,
      block,
      fname,
      password: hashedPassword,
      subjects,
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Failed to create student" });
  }
});

routes.put("/api/students/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { studentId, yearLevel, block, fname, password, subjects } = req.body;

      // Find the student by primary key
      const student = await Student.findByPk(id);
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      // Update student data
      await student.update({ studentId, yearLevel, block, fname, password, subjects });
      res.status(200).json(student); // Return updated student data
  } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Failed to update student" });
  }
});

// Add a route to retrieve a student's current data for editing
routes.get("/api/students/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const student = await Student.findByPk(id);
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student); // Return student data
  } catch (error) {
      console.error("Error retrieving student:", error);
      res.status(500).json({ message: "Failed to retrieve student" });
  }
});

// Delete a user
routes.delete('/api/students/:id', async (req, res) => {
  try {
      const studentId = req.params.id; // Get the student ID from the URL parameter
      const result = await Student.destroy({
          where: { studentId: studentId } // Assuming 'studentId' is the primary key
      });

      if (result === 0) {
          // No rows were deleted, maybe the ID doesn't exist
          return res.status(404).json({ message: "Student not found." });
      }

      res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

routes.get('/1section', async (req, res) => {
  const yearLevel = '1st Year'; 
  try {
    // Fetch sections and students for the 1st year
    const sections = await Section.findAll();
    const students = await Student.findAll({ where: { yearLevel } });
    
    console.log("Sections fetched:", sections);
    console.log("Students fetched:", students);
    
    // Pass both sections, students, and yearLevel to the template
    res.render('1section', { sections, students, yearLevel });
  } catch (error) {
    console.error("Error retrieving sections or students:", error);
    res.status(500).send("Error retrieving sections or students.");
  }
});

routes.get('/2section', async (req, res) => {
  const yearLevel = '2nd Year'; 
  try {
    // Fetch sections and students for the 1st year
    const sections = await Section.findAll();
    const students = await Student.findAll({ where: { yearLevel } });
    
    console.log("Sections fetched:", sections);
    console.log("Students fetched:", students);
    
    // Pass both sections, students, and yearLevel to the template
    res.render('2section', { sections, students, yearLevel });
  } catch (error) {
    console.error("Error retrieving sections or students:", error);
    res.status(500).send("Error retrieving sections or students.");
  }
});

routes.get('/3section', async (req, res) => {
  const yearLevel = '3rd Year'; 
  try {
    // Fetch sections and students for the 1st year
    const sections = await Section.findAll();
    const students = await Student.findAll({ where: { yearLevel } });
    
    console.log("Sections fetched:", sections);
    console.log("Students fetched:", students);
    
    // Pass both sections, students, and yearLevel to the template
    res.render('3section', { sections, students, yearLevel });
  } catch (error) {
    console.error("Error retrieving sections or students:", error);
    res.status(500).send("Error retrieving sections or students.");
  }
});

routes.get('/4section', async (req, res) => {
  const yearLevel = '4th Year'; 
  try {
    // Fetch sections and students for the 1st year
    const sections = await Section.findAll();
    const students = await Student.findAll({ where: { yearLevel } });
    
    console.log("Sections fetched:", sections);
    console.log("Students fetched:", students);
    
    // Pass both sections, students, and yearLevel to the template
    res.render('4section', { sections, students, yearLevel });
  } catch (error) {
    console.error("Error retrieving sections or students:", error);
    res.status(500).send("Error retrieving sections or students.");
  }
});

routes.post('/section/add', async (req, res) => {
  const { sectionBlock, sectionYearLevel } = req.body;

  // Validate input: Block should be a single uppercase letter
  if (!/^[A-Z]$/.test(sectionBlock)) {
    return res.status(400).send("Block must be a single uppercase letter.");
  }

  try {
    // Save the block with the associated year level to the Sections table
    await Section.create({ block: sectionBlock, yearLevel: sectionYearLevel });
    res.redirect("/1section");
  } catch (error) {
    console.error("Error adding block:", error);
    res.status(500).send("Failed to add block.");
  }
});

module.exports = routes;
