import Employee from '../models/Employee.js';

// @desc    Get all employees
// @route   GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search employees
// @route   GET /api/employees/search
export const searchEmployees = async (req, res) => {
  try {
    const { name, department, skills, performanceScore } = req.query;
    let query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    if (performanceScore) {
      query.performanceScore = { $gte: Number(performanceScore) };
    }

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience, bio } = req.body;

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
      bio
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience, bio } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.department = department || employee.department;
      employee.skills = skills || employee.skills;
      employee.performanceScore = performanceScore !== undefined ? performanceScore : employee.performanceScore;
      employee.experience = experience !== undefined ? experience : employee.experience;
      employee.bio = bio || employee.bio;

      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await employee.deleteOne();
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
