import { db } from "./database.js"

//create a new entry in the  victim table
export async function addNewVictim(victimId,victim) {
    const SQL = `INSERT INTO victims 
    VALUES(?,?,?,?,?,?,?,?,?,?);`
    try {
        await db.query(SQL,[victimId,victim.species,victim.age,victim.sex,victim.breed,victim.vaccinationStatus,victim.vaccinationDose,victim.biteSite,victim.woundCategory,victim.firstAidStatus])
    } catch (error) {
        console.log("error inserting attacker details onto victim table " + error)
    }
}

//create a new entry in the attackers table
export async function addNewAttacker(attackerId,attacker) {
    const SQL = `INSERT INTO attackers 
    VALUES(?,?,?,?,?,?,?);`
    try {
        await db.query(SQL,[attackerId,attacker.species,attacker.age,attacker.sex,attacker.breed,attacker.vaccinationStatus,attacker.condition])
    } catch (error) {
        console.log("error inserting attacker details onto attackers table " + error)
    }
}

export async function deleteAttacker(attackerId){
    const SQL = `DELETE FROM attackers
    WHERE attacker_id = ?`
    try {
        await db.query(SQL,[attackerId]);
    } catch (error) {
        console.log(error)
    }
}
export async function deleteVictim(victimId){
    const SQL = `DELETE FROM victims
    WHERE victim_id = ?`
    try {
        await db.query(SQL,[victimId]);
    } catch (error) {
        console.log(error)
    }
}

//create a new entry in the case table with the attacker id and victim id
export async function addCase(doctorId,attackerId,victimId,pincode,district,attackDate){
    const SQL = `INSERT INTO cases
    VALUES(get_case_id(),DATE_FORMAT(CURDATE(),'%d-%m-%Y'),?,?,?,?,?,?)`
    try {
        await db.query(SQL,[attackDate,doctorId,attackerId,victimId,district,pincode])
        return true
    } catch (error) {
        console.log("error inserting caseDetails onto case table " + error)
        return false
    }
}