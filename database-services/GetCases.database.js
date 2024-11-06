import { db } from "./db.js"
import { getDoctorDetails } from "./doctor.database.js";

export const fetchCaseDetailsByDoctorId = async(doctorId) => {

    //this query only retrives date and doctor_id from case table and retrieves species from attacker and victim table
    const SQL = `SELECT 
    DATE_FORMAT(cases.attack_date,'%d-%m-%Y') as attack_date,
    cases.case_id,
    attacker.species AS attacker_species,
    victim.species AS victim_species,
    owner.name as victim_owner
    FROM 
    cases 
    INNER JOIN 
    attackers AS attacker ON attacker.attacker_id = cases.attacker_id 
    INNER JOIN 
    victims AS victim ON victim.victim_id = cases.victim_id
    INNER JOIN
    victim_owners As owner ON owner.victim_id = cases.victim_id
    WHERE cases.registered_by = ?
    ORDER BY cases.attack_date DESC`

    try{
        const [records] = await db.query(SQL,[doctorId]);
        return records
    }catch(e){
        throw new Error("DB query failed in fetching caseDetails by doctorId " + e);
    }
}

export async function fetchFullCaseDetailsById(caseId){
    const SQL = `SELECT 
    case_id,attacker_id,victim_id,registered_by as doctor_id,district,area
    from cases
    WHERE cases.case_id = ?`

    try {
        const [[record]] = await db.query(SQL,[caseId]);
        //if no record on that case id - just return false
        if(!record)
            return false
        
        const attackerDetails = await getAttackerDetails(record.attacker_id);
        const victimDetails = await getVictimDetails(record.victim_id);
        const doctorDetails = await getDoctorDetails(record.doctor_id)
        const ownerDetails = await getVictimOwner(record.victim_id)
        const doseDetails = await getDoseDetails(caseId)

        return {
            attacker : attackerDetails,
            victim : victimDetails,
            owner : ownerDetails,
            doctor : doctorDetails,
            doseDetails : doseDetails,
            district : record.district,
            area : record.area
        }
    } catch (error) {
            throw new Error("error in retrieving full case details : " + error.message)
        }
    }

export async function getAttackerDetails(attackerId) {
    const SQL = `SELECT attacker_id,species,age,breed,is_pet,vaccination_status,DATE_FORMAT(last_vaccinated_on,'%d-%m-%y') AS last_vaccinated_on,attacker_status
    FROM attackers as attacker where attacker_id = ?`
    try {
        const [[attacker]] = await db.query(SQL,[attackerId])
        return attacker
    } catch (error) {
        throw new Error("DB query failed in retieving victim info" + error.message)
    }
}

export async function getVictimDetails(attackerId) {
    const SQL = `SELECT victim_id,species,age,breed,vaccination_status,DATE_FORMAT(last_vaccinated_on,'%d-%m-%y') AS last_vaccinated_on,site_of_bite,wound_category,wound_severity
    FROM victims as victim where victim_id = ?`
    try {
        const [[victim]] = await db.query(SQL,[attackerId])
        return victim
    } catch (error) {
        throw new Error("DB query failed in retrieving attacker info" + error.message)
    }
}


export async function getVictimOwner(victimId) {
    const SQL = `SELECT name,address,mobile_no as mobile from victim_owners where victim_id = ?`
    try {
        const [[owner]] = await db.query(SQL,[victimId])
        return owner
    } catch (error) {
        throw new Error("DB query failed in retrieving owner info" + error.message)
    }
}

export async function getDoseDetails(caseId){
    const SQL = `SELECT dose,DATE_FORMAT(dose_date,'%d-%m-%Y') as dose_date from doses_given
    WHERE case_id = ?`

    try {
        const [records] = await db.query(SQL,[caseId])
        return records
    } catch (error) {
        throw new Error("Database query failed in fetching dose details : "+ error.message)
    }
}

//returns total no. of rows in the case table
export async function getLastCaseNumber(){
    const SQL = `SELECT last_case_number from case_counter`
    try {
        const [[{last_case_number}]] = await db.query(SQL)
        return last_case_number
    } catch (error) {
        throw new Error("error retrieving case count" + error.message)
    }
}


