import { db } from "./db.js";

export const fetchCaseCount = async() => {
    const SQL = `SELECT district,count(case_id)
     as count 
     FROM cases 
     GROUP BY district`
    try {
        const [records] = await db.query(SQL);
        return records;
    } catch (error) {
        console.log(error)
        throw new Error("DB query failed in fetching case count " + error.message)
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
        throw new Error("DB query failed in fetching recent cases" + error.message)
    }
}


export const fetchReport = async() => {
    const SQL = `SELECT 
    cases.case_id,DATE_FORMAT(cases.attack_date,'%d-%m-%Y') as attack_date,doctors.doctor_name,cases.district,
    attackers.species AS attacker_species, attackers.age as attacker_age, attackers.breed AS attacker_breed,attackers.is_pet,attackers.vaccination_status AS attackers_vaccination_status,attackers.last_vaccinated_on,attackers.attacker_status,
    victims.species AS victims_species, victims.age AS victims_age,victims.breed AS victims_breed,site_of_bite,wound_category,victims.vaccination_status as victim_vaccination_status,victims.vaccination_dose,first_aid_given
    FROM cases
    INNER JOIN attackers ON cases.attacker_id = attackers.attacker_id
    INNER JOIN victims ON cases.victim_id = victims.victim_id
    INNER JOIN doctors ON cases.registered_by = doctors.doctor_id
    ORDER BY cases.attack_date DESC`

    try {
        const [records] = await db.query(SQL);
        return records
    } catch (error) {
        throw new Error("DB query failed in fetching report " + error.message)
    }
}

export const fetchCasesByPincode = async(pincode) => {
    const SQL = `SELECT 
    cases.case_id,DATE_FORMAT(cases.attack_date,'%d-%m-%Y') as attack_date,doctors.doctor_name,cases.district,cases.pincode,
    attackers.species AS attacker_species, attackers.age as attacker_age, attackers.breed AS attacker_breed,attackers.vaccination_status AS attackers_vaccination_status,
    victims.species AS victims_species, victims.age AS victims_age,victims.breed AS victims_breed,site_of_bite,wound_category,victims.vaccination_status as victim_vaccination_status,victims.vaccination_dose,first_aid_given
    FROM cases
    INNER JOIN attackers ON cases.attacker_id = attackers.attacker_id
    INNER JOIN victims ON cases.victim_id = victims.victim_id
    INNER JOIN doctors ON cases.registered_by = doctors.doctor_id
    WHERE cases.pincode = ?`
    try {
        const [records] = await db.query(SQL,[pincode]);
        return records
    } catch (error) {
        throw new Error("DB query failed in fetching cases " + error.message)
    }
}