import { v4 as uuidv4 } from 'uuid';
import { getFullCaseDetailsByCaseId,getCaseDetailsByDoctorId } from "../database-services/GetCases.database.js";
import { addNewAttacker,addNewVictim,addCase } from "../database-services/AddCases.database.js";

export const getAbstractCaseDetails = async(req,res) => {
    const doctorId = req.params.doctorId;
    try{
        const cases = await getCaseDetailsByDoctorId(doctorId);
        if(cases.length>0)
            res.send(cases);
        else
            res.status(404).send({Success : false});
    }
    catch(error){
        console.log("Error occured while getting case details - from cases.controller file : " + error);
        res.send({Success: false})
    }
}

export const registerNewCase = async(req,res) => {
        try {
            const attackerId = uuidv4();
            const victimId = uuidv4();
            await addNewAttacker(attackerId,req.body.attacker);
            await addNewVictim(victimId,req.body.victim);

            //reqister a new case with the generated attackerId and victimId
            await addCase(req.body.doctorId,attackerId,victimId,req.body.pincode,req.body.district,req.body.attackDate);
            res.send({Success : true});

        } catch (error) {
            console.log(error)
            res.send({Success : false});
        }
}

export const getFullCaseDetails = async(req,res) => {
    const caseId = req.params.caseId;
    try{
        const caseDetails = await getFullCaseDetailsByCaseId(caseId)
        if(caseDetails)
            res.send(caseDetails);
        else
            res.status(404).end();
    }
    catch{
        console.log("Error occured while getting case details" + e);
        res.send({Success:false})
    }
}