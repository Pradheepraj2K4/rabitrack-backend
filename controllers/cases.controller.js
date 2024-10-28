import { v4 as uuidv4 } from 'uuid';
import { fetchFullCaseDetailsById, fetchCaseDetailsByDoctorId, getLastCaseNumber} from "../database-services/GetCases.database.js";
import { addNewAttacker, addNewVictim, addCase, addNewVictimOwner, addDosesGiven } from "../database-services/AddCases.database.js";
import { deleteCaseFromDB } from '../database-services/deleteCases.database.js'
import { authorize,getSpeciesCode } from '../utils.js';

//return only the list of attackerId,attacker-species,victim-species,attack date
export const getAbstractCaseDetails = async (req, res) => {
    const doctorId = req.params.doctorId;
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if (isAuth) {
            const cases = await fetchCaseDetailsByDoctorId(doctorId); //returns false if error fetching from DB
            if (cases.length > 0)
                res.send(cases);
            else
                res.status(404).send({ error: "No cases were found" });
        }
        else
            return res.status(401).send({ Success: false, error: "User doesn't have the permission" })
    }
    catch (error) {
        console.error("Error occured while getting case details - from cases.controller : " + error);
        res.send({ Success: false, error: "Error occured, Please try again!" })
    }
}

export const registerNewCase = async (req, res) => {
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if (isAuth) {
            const attackerId = uuidv4();
            const victimId = uuidv4();
            await addNewAttacker(attackerId, req.body.attacker);
            await addNewVictim(victimId, req.body.victim);
            await addNewVictimOwner(victimId,req.body.victimOwner)

            //to generate case ID
            const currentYear = new Date().getFullYear().toString().substring(2,4); //return only last two digits of current year
            const lastCaseNumber = await getLastCaseNumber() 
            let caseId = getSpeciesCode(req.body.victim.species) + currentYear + lastCaseNumber.toString().padStart(5,'0');

            //reqister a new case with the generated attackerId and victimId
            await addCase(caseId,req.body.doctorId, attackerId, victimId, req.body.district,req.body.area,req.body.attackDate) //returns false if any error occurs at DB
            await addDosesGiven(caseId,req.body.dose,req.body.doseDate)
            return res.send({ Success: true });
        }
        else
            return res.status(401).send({ Success: false, error: "User doesn't have the permission" })

    } catch (error) {
        console.log(error)
        res.status(500).send({ Success: false, error: "Failed to add cases!" });
    }
}

export const getFullCaseDetails = async (req, res) => {
    const caseId = req.params.caseId;
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if (isAuth) {
            const caseDetails = await fetchFullCaseDetailsById(caseId) //returns false if no cases found on that case ID
            if (caseDetails)
                res.send(caseDetails);
            else
                res.status(404).send({ error: "No case were found on the given case-ID" });
        }
        else
            return res.status(401).send({ Success: false, error: "User doesn't have the permission" })
    }
    catch (err) {
        console.log("Error occured while getting case details" + err);
        res.status(400).send({ Success: false,error: "Error occured while getting case details!" })
    }
}

export const deleteCase = async (req, res) => {
    const caseId = req.params.caseId;
    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if (isAuth) {
            const successStatus = await deleteCaseFromDB(caseId)
            if (successStatus === true)
                return res.send({ Success: true });
            else //is no case exist on the given case ID
                return res.status(404).send({ Success: false, error: "No cases were found on the given case ID" });
        }
        else
            return res.status(401).send({ Success: false, error: "User doesn't have the permission" })
    }
    catch (e) {
        console.log("Error occured in deleting the case : " + e);
        return res.status(500).send({ Success: false, error: "Error occured in deleting the case" })
    }
}


//update dose details
export const updateDoseDetails = async (req,res) => {
    const caseId = req.params.caseId;
    const {dose,doseDate} = req.body;

    try {
        const isAuth = authorize(req.cookies.jwttoken)
        if(isAuth){
            await addDosesGiven(caseId,dose,doseDate);
            res.send({Success : true})
        }
        else
            return res.status(401).send({ Success: false, error: "User doesn't have the permission" })
    } catch (error) {
        console.log("Error occured in updating doseDetails! : " + error)
        return res.status(500).send({ Success: false, error: "Error occured in updating the doses details!" })
    }
}