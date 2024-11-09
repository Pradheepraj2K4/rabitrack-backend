import express from 'express';
import { configDotenv } from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import {deleteCase, getAbstractCaseDetails, getFullCaseDetails, registerNewCase, updateDoseDetails} from './controllers/cases.controller.js';
import {getAllCases, getTotalCaseCount, getCasesByPincode, getCasesByDistrict, getReport, getCaseCountbyMonth } from './controllers/report.controller.js';
import { adminLogin, login, logout, registerDoctor } from './controllers/signup.controller.js';
configDotenv();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    //setting origin dynamically (by not using '*')
  origin: (origin, callback) => {
    // Reflect the request origin to allow requests from any origin
    callback(null, origin); 
  },
  credentials: true, // Allows cookies and credentials
}));

//Login
app.post('/signup',registerDoctor)
app.post('/login',login)
app.post('/admin-login',adminLogin)
app.post('/logout',logout)

//CASES
app.post('/addNewCase',registerNewCase);
app.get('/getCasesByDoctorId/:doctorId',getAbstractCaseDetails);
app.get('/getCaseDetailsByCaseId/:caseId',getFullCaseDetails);
app.delete('/deleteCase/:caseId',deleteCase)
app.put('/updateDoses/:caseId',updateDoseDetails)

//REPORTS
app.get('/getCaseCount',getTotalCaseCount);
app.get('/getCaseCountByMonth',getCaseCountbyMonth);
app.get('/getCases',getAllCases);
app.get('/getAllCaseReport',getReport);
app.get('/getCasesByDistrict/:district',getCasesByDistrict);
app.get('/getCasesByPincode/:pincode',getCasesByPincode)//


app.listen(process.env.PORT,() => console.log("Server is running at PORT : " + process.env.PORT))