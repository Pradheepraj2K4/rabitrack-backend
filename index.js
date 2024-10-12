import express from 'express';
import { configDotenv } from 'dotenv';
import cors from "cors";
import {getAbstractCaseDetails, getFullCaseDetails, registerNewCase} from './controllers/cases.controller.js';
import {getCaseCount, getRecentCasesByDistrict, getReport } from './controllers/report.controller.js';
import { login, registerDoctor } from './controllers/signup.controller.js';
configDotenv();
const app = express();
app.use(express.json());
app.use(cors());

//Login
app.post('/signup',registerDoctor)
app.get('/login',login)

//CASES
app.post('/addNewCase',registerNewCase);
app.get('/getCasesByDoctorId/:doctorId',getAbstractCaseDetails);
app.get('/getCaseDetailsByCaseId/:caseId',getFullCaseDetails);

//REPORTS
app.get('/getCaseCount',getCaseCount);
app.get('/getAllCaseReport',getReport);
app.get('/getCasesByDistrict/:district',getRecentCasesByDistrict);

app.listen(process.env.PORT,() => console.log("Server is running at PORT : " + process.env.PORT))