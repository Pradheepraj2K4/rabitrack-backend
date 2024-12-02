import {fetchCasesByPincode, fetchTotalCaseCount, fetchCaseCountByMonth, fetchCases, fetchFullReport } from "../database-services/report.database.js";
import { authorize } from '../utils.js';


export const getTotalCaseCount = async (req,res) => {
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if(!isAuth)
            return res.status(401).send({Success : false, error : "User doesn't have the permission"})

        const records = await fetchTotalCaseCount();
        return res.send(records)

    } catch (error) {
        console.log(error);
        return res.status(500).send({Success : false, error : "Unable to fetch case count"})
    }
}

export const getCaseCountbyMonth = async (req,res) => {
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if(!isAuth)
            return res.status(401).send({Success : false, error : "User doesn't have the permission"})

        const records = await fetchCaseCountByMonth(2024);
        return res.send(records)

    } catch (error) {
        console.log(error);
        return res.status(500).send({Success : false, error : "Unable to fetch case count"})
    }
}


export const getReport = async (req,res) => {
    const district = req.params?.district
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if(!isAuth)
            return res.status(401).send({Success : false, error : "User doesn't have the permission"})
        
        const records = await fetchReport(district); // returns false in case of error
        if(records)
            res.send(records)
        else
            res.send({Succcess : false,error : "Unexpected error occured during fetching the report"})
    } catch (error) {
        console.log(error)
        res.senn
    }
}


export const getCasesByPincode = async(req,res) => {
    const pincode = req.params.pincode;
    try {
        const cases = await fetchCasesByPincode(pincode);
        if(cases.length>0)
            return res.send(cases)
        else
            return res.status(404).send({error : "No cases were found on the given pincode"})
    } catch (error) {
        console.log(error)
        return res.send({Succcess : false, error : "Unexpected error occured"})
    }
}


export const getCases = async(req,res) => {

    const LIMIT = 15
    const pageNo = req.query.page
    //filters
    const district = req.query?.district
    const year = req.query?.year
    const month = req.query?.month
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if(!isAuth)
            return res.status(401).send({Success : false, error : "User doesn't have the permission"})

        const records = await fetchCases(district,year,month,Number(LIMIT),Number((pageNo-1)*LIMIT));
        if(records.length > 0)
            res.send(records)
        else
            res.status(404).send({Success : false, error : "No cases were found with the district : " + district});

    } catch (error) {
        console.log("error in fetching cases by district : " + error);
        res.status(500).send({Success : false,error : "Unexpected error occured during fetching the cases"});
    }
}

export const getFullReport = async (req,res) => {
    //filters
    const district = req.query?.district
    const year = req.query?.year
    const month = req.query?.month
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if(!isAuth)
            return res.status(401).send({Success : false, error : "User doesn't have the permission"})
        
        const records = await fetchFullReport(district,year,month); // returns false in case of error
        if(records)
            res.send(records)
        else
            res.send({Succcess : false,error : "Unexpected error occured during fetching the report"})
    } catch (error) {
        console.log(error)
        return res.send({Succcess : false, error : "Unexpected error occured during fetching the report"})
    }
}