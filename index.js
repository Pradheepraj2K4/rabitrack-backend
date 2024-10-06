import express from 'express';
import { configDotenv } from 'dotenv';
configDotenv();
const app = express();
import {getAbstractCaseDetails, getFullCaseDetails, registerNewCase} from './controllers/cases.controller.js';
import { getAllCaseDetails, getCaseCount, getRecentCasesByDistrict, getReport } from './controllers/report.controller.js';
app.use(express.json());

//CASES
app.post('/addNewCase',registerNewCase);
app.get('/getCasesByDoctorId/:doctorId',getAbstractCaseDetails);
app.get('/getCaseDetailsByCaseId/:caseId',getFullCaseDetails);

//REPORTS
app.get('/getCaseCount',getCaseCount);
app.get('/getAllCaseReport',getReport);
app.get('/getCasesByDistrict/:district',getRecentCasesByDistrict);

app.listen(process.env.PORT,() => console.log("Server is running at PORT : " + process.env.PORT))