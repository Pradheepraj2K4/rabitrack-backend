import {fetchCasesByPincode, fetchRecentCasesByDistrict, fetchReport, fetchCaseCount } from "../database-services/report.database.js";

export const getCaseCount = async (req,res) => {
    try {
        const records = await fetchCaseCount();
        return res.send(records)
    } catch (error) {
        console.log(error);
        return res.status(500).send({Success : false, error : "Unable to fetch case count"})
    }
}

export const getReport = async (req,res) => {
    try {
        const records = await fetchReport(); // returns false in case of error
        if(records)
            res.send(records)
        else
            res.send({Succcess : false,error : "Unexpected error occured during fetching the report"})
    } catch (error) {
        console.log(error)
    }
}

export const getRecentCasesByDistrict = async(req,res) => {
    const district = req.params.district
    try {
        const records = await fetchRecentCasesByDistrict(district);
        if(records.length > 0)
            res.send(records)
        else
            res.status(404).send({Success : false, error : "No cases were found with the district : " + district});
    } catch (error) {
        console.log("error in fetching cases by district : " + error);
        res.send({Success : false,error : "Unexpected error occured during fetching the data"});
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