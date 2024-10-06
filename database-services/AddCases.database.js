import { db } from "./database.js"

//create a new entry in the animals table of type victim
export async function addNewVictim(victimId,victim) {
    const SQL = `INSERT INTO victims 
    VALUES(?,?,?,?,?,?,?,?,?,?);`
    try {
        await db.query(SQL,[victimId,victim.species,victim.age,victim.sex,victim.breed,victim.vaccinationStatus,victim.vaccinationDose,victim.biteSite,victim.woundCategory,victim.firstAidStatus])
    } catch (error) {
        console.log("error inserting attacker details onto animals table " + error)
    }
}

//create a new entry in the animals table of type attacker
export async function addNewAttacker(attackerId,attacker) {
    const SQL = `INSERT INTO attackers 
    VALUES(?,?,?,?,?,?,?);`
    try {
        await db.query(SQL,[attackerId,attacker.species,attacker.age,attacker.sex,attacker.breed,attacker.vaccinationStatus,attacker.condition])
    } catch (error) {
        console.log("error inserting attacker details onto animals table " + error)
    }
}

//create a new entry in the case table with the attacker id and victim id
export async function addCase(doctorId,attackerId,victimId,pincode,district,attackDate){
    const SQL = `INSERT INTO cases
    VALUES(get_case_id(),DATE_FORMAT(CURDATE(),'%d-%m-%Y'),?,?,?,?,?,?)`
    try {
        await db.query(SQL,[attackDate,doctorId,attackerId,victimId,district,pincode])
    } catch (error) {
        console.log("error inserting caseDetails onto case table " + error)
    }
}