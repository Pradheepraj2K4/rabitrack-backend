import { fetchAllCases, fetchRecentCasesByDistrict, fetchReport, getCasesCountfromDB } from "../database-services/report.database.js";

export const getCaseCount = async (req,res) => {
    try {
        const records = await getCasesCountfromDB();
        res.send(records)
    } catch (error) {
        console.log(error);
        res.send({Success : false})
    }
}

//Not used
export const getAllCaseDetails = async(req,res) => {
    try {
        const [attackers,victims,caseDetails] = await fetchAllCases();
        let result = []
        caseDetails.forEach((ele,index) => {
            result = [
                ...result,
                {
                    caseId : caseDetails[index].case_id,
                    registeredDate : caseDetails[index].date,
                    attackDate :  caseDetails[index].attack_date, 
                    registered_by :  caseDetails[index].registered_by, 
                    district :  caseDetails[index].district, 
                    attacker : attackers[index],
                    victim : victims[index]
                }
            ]
        });
        res.send(result)
    } catch (error) {
        console.log(error);
        res.send({Succcess : false})
    }
}

export const getReport = async (req,res) => {
    try {
        const records = await fetchReport();
        if(records)
            res.send(records)
        else
            res.send({Succcess : false})
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
            res.send({Success : false});
    } catch (error) {
        console.log("error in fetching cases by district : " + error);
        res.send({Success : false});
    }
}