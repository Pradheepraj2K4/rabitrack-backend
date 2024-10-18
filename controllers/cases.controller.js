import { v4 as uuidv4 } from 'uuid';
import { fetchFullCaseDetailsById,fetchCaseDetailsByDoctorId } from "../database-services/GetCases.database.js";
import { addNewAttacker,addNewVictim,addCase} from "../database-services/AddCases.database.js";
import { deleteAttacker, deleteVictim,deleteCaseFromDB } from '../database-services/deleteCases.database.js'

//return only the list of attackerId,attacker-species,victim-species,attack date
export const getAbstractCaseDetails = async(req,res) => {
    const doctorId = req.params.doctorId;
    try{
        const cases = await fetchCaseDetailsByDoctorId(doctorId); //returns false if error fetching from DB
        if(cases === false){
            console.error("Error connecting DB - fetchCaseDetailsByDoctorId")
            return res.send({Success: false, error : "Error occured, Please try again!"})
        }
        else if(cases.length>0)
            res.send(cases);
        else
            res.status(404).send({error : "No cases were found"});
    }
    catch(error){
        console.error("Error occured while getting case details - from cases.controller : " + error);
        res.send({Success: false, error : "Error occured, Please try again!"})
    }
}

export const registerNewCase = async(req,res) => {
        try {
            const attackerId = uuidv4();
            const victimId = uuidv4();
            await addNewAttacker(attackerId,req.body.attacker);
            await addNewVictim(victimId,req.body.victim);

            //reqister a new case with the generated attackerId and victimId
            if(await addCase(req.body.doctorId,attackerId,victimId,req.body.pincode,req.body.district,req.body.attackDate)) //returns false if any error occurs at DB
                return res.send({Success : true});
            else{
                //delete the attacker and victim if it is already inserted and the issue is only with the case table
                await deleteAttacker(attackerId);
                await deleteVictim(victimId);
                return res.status(400).send({Success : false,error : "Failed to add cases"});
            }    

        } catch (error) {
            console.log(error)
            res.send({Success : false,error : "unexpected error occured!"});
        }
}

export const getFullCaseDetails = async(req,res) => {
    const caseId = req.params.caseId;
    try{
        const caseDetails = await fetchFullCaseDetailsById(caseId) //returns false if no cases found on that case ID
        if(caseDetails)
            res.send(caseDetails);
        else
            res.status(404).send({error : "No case were found on the given case-ID"});
    }
    catch(e){
        console.log("Error occured while getting case details" + e);
        res.send({Success:false})
    }
}

export const deleteCase = async(req,res) => {
    const caseId = req.params.caseId;
    try{
        const successStatus = await deleteCaseFromDB(caseId)
        if(successStatus === true)
            return res.send({Success : true});
        if(successStatus === false) //is no case exist on the given case ID
            return res.status(404).send({Success : false,error : "No case found on the given case ID"});

        //Error occured in the database
        return res.status(500).send({Success:false,error : "Error occured in deleting the case"}) 
    }
    catch(e){
        console.log("Error occured in deleting the case : " + e);
        return res.status(500).send({Success:false,error : "Error occured in deleting the case"})
    }
}