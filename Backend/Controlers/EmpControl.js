const Employee = require("../Model/EmpModel");
const Payroll = require("../Model/PayrollModel");

const path = require('path');
const fs = require('fs');

// Add a new employee
const addEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json({ message: "Employee added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding employee", error });
    }
};

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error });
    }
};


///get by id
const getEmployeeById = async (req,res,next) =>{
    const id = req.params.id;

    let employee;
    
    try{
        employee = await Employee.findById(id);
    }catch(err){
        console.log(err);

    }

    //not insert users
    if(!employee){
        return res.status(404).json({message:"user not found"});

    }

    return res.status(200).json({employee});
};



// Update employee details
const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee updated successfully", updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error });
    }
};


//delete employee details

const deleteEmpDetails = async(req,res,next)=>{

    const id = req.params.id;

    //create variable
    let employee;

    try{
        employee = await Employee.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }

    if(!employee){
        return res.status(404).json({message:"unable to delete "});

    }

    return res.status(200).json({employee});

};



// Image upload handler
const uploadImage = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;  // Construct the image URL

  try {
    // Update employee with the new image URL
    const updatedEmployee = await Employee.findByIdAndUpdate(id, { image: imageUrl }, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Image uploaded successfully", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
};


const getEmployeeCount = async (req, res) => {
    try {
      const count = await Employee.countDocuments();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };


module.exports = { addEmployee,getAllEmployees,getEmployeeById, updateEmployee,deleteEmpDetails,uploadImage,getEmployeeCount};


