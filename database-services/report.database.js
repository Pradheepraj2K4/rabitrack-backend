import { db } from "./database.js";

export const getCasesCountfromDB = async() => {
    const SQL = `SELECT district,count(case_id)
     as count 
     FROM cases 
     GROUP BY district`
    try {
        const [records] = await db.query(SQL);
        return records;
    } catch (error) {
        console.log(error)
        console.log("error fetching case count")
        return false;
    }
}

//Not Used
export const fetchAllCases = async() => {
    const SQL_TO_FETCH_ATTACKERS = `SELECT attacker.* FROM cases
    INNER JOIN attackers AS attacker ON attacker.attacker_id = cases.attacker_id`
    
    const SQL_TO_FETCH_VICTIMS = `SELECT victim.* FROM cases
    INNER JOIN victims AS victim ON victim.victim_id = cases.victim_id`

    const SQL_TO_FETCH_CASE_DETAILS = `SELECT case_id,DATE_FORMAT(attack_date,'%d-%m-%Y') AS attack_date,registered_by,district,pincode FROM cases`

    const SQL_TO_FETCH_DOCTOR_DETAILS = `SELECT doctors.* FROM cases
    INNER JOIN doctors ON doctors.doctor_id = cases.doctor_id`

    // const SQL = `SELECT * FROM cases 
    // INNER JOIN attackers ON attackers.attacker_id = cases.attacker_id
    // INNER JOIN victims ON victims.victim_id = cases.victim_id`

    try {
        const [attackers] = await db.query(SQL_TO_FETCH_ATTACKERS);
        const [victims] = await db.query(SQL_TO_FETCH_VICTIMS);    
        const [caseDetails] = await db.query(SQL_TO_FETCH_CASE_DETAILS);    
        return [attackers,victims,caseDetails];
    } catch (error) {
        console.log(error);
        return false
    }
   
}


export const fetchRecentCasesByDistrict = async(district) => {
    const SQL = `SELECT 
    cases.case_id,DATE_FORMAT(cases.attack_date,'%d-%m-%Y') as attack_date,doctors.doctor_name,
    attackers.species AS attacker_species, attackers.age as attacker_age, attackers.breed AS attacker_breed,
    victims.species AS victims_species, victims.age AS victims_age,victims.breed AS victims_breed
    FROM cases
    INNER JOIN attackers ON cases.attacker_id = attackers.attacker_id
    INNER JOIN victims ON cases.victim_id = victims.victim_id
    INNER JOIN doctors ON cases.registered_by = doctors.doctor_id
    WHERE cases.district = ?
    ORDER BY cases.attack_date DESC
    LIMIT 10`
    try {
        const [records] = await db.query(SQL,[district]);
        return records;
    } catch (error) {
        console.log("error fetching cases by district from DB : " + error);
    }
}


export const fetchReport = async() => {
    const SQL = `SELECT 
    cases.case_id,DATE_FORMAT(cases.attack_date,'%d-%m-%Y') as attack_date,doctors.doctor_name,cases.district,cases.pincode,
    attackers.species AS attacker_species, attackers.age as attacker_age, attackers.breed AS attacker_breed,attackers.vaccination_status AS attackers_vaccination_status,
    victims.species AS victims_species, victims.age AS victims_age,victims.breed AS victims_breed,site_of_bite,wound_category,victims.vaccination_status as victim_vaccination_status,victims.vaccination_dose,first_aid_status
    FROM cases
    INNER JOIN attackers ON cases.attacker_id = attackers.attacker_id
    INNER JOIN victims ON cases.victim_id = victims.victim_id
    INNER JOIN doctors ON cases.registered_by = doctors.doctor_id`

    try {
        const [records] = await db.query(SQL);
        return records
    } catch (error) {
        console.log(error)
        return false
    }
}