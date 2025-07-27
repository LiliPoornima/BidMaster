const Report = require("../Model/ReportModel");

//data display
const getAllReports = async (req, res, next) => {
    let reports;  
    //get all reports
    try {
        reports = await Report.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });  
    }
    //not found
    if (!reports) {
        return res.status(404).json({ message: "Report not found" }); 
    }
    //Display all reports
    return res.status(200).json({ reports }); 
};

//data insert
const addReports= async(req,res, next)=>{

    const{ReportName,ReportReason,Date} = req.body;

    let reports;

    try{
        reports = new Report({ReportName,ReportReason,Date});
        await reports.save();
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    //not insert users
    if(!reports){
        return res.status(404).json({message:"unable to add reports"});
    }
    return res.status(200).json({ reports});
};
//get by id
const getById = async (req,res,next) => {

    const id = req.params.id;

    let report;

    try{
        report = await Report.findById(id);
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    //not available users
    if(!report){
        return res.status(404).json({message:"Report not found"});
    }
    return res.status(200).json({ report });
};

//update user details
const updateReport = async(req,res,next) =>{
    const id = req.params.id;
    const{ReportName,ReportReason,Date} = req.body;

    let reports;

    try{
        reports = await Report.findByIdAndUpdate(id,
            {ReportName: ReportName, ReportReason: ReportReason, Date: Date});
            reports = await reports.save();
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if(!reports){
        return res.status(404).json({message:"Unable to Updte Report Details"});
    }
    return res.status(200).json({ reports });
};
//delete user details
const deleteReport = async (req, res, next) => {
    const id = req.params.id;
  
    let report;
  
    try {
      report = await Report.findByIdAndDelete(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      return res.status(200).json({ message: "Report deleted successfully", report });
    } catch (err) {
      console.error("Error deleting report:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };


exports.getAllReports = getAllReports;
exports.addReports = addReports;
exports.getById = getById;
exports.updateReport = updateReport; 
exports.deleteReport = deleteReport;