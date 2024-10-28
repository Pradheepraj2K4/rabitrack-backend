import { getSpeciesCode } from "../utils.js"
import { db } from "./db.js"

//create a new entry in the  victim table
export async function addNewVictim(victimId,victim) {
    const SQL = `INSERT INTO victims 
    VALUES(?,?,?,?,?,?,?,?,?,?);`
    try {
        await db.query(SQL,[victimId,victim.species,victim.age,victim.sex,victim.breed,victim.vaccinationStatus,victim.lastVaccinatedOn,victim.biteSite,victim.woundCategory,victim.woundSeverity])
    } catch (error) {
        throw new Error("DB query failed in inserting into victim table " + error.message)
    }
}

//create a new entry in the attackers table
export async function addNewAttacker(attackerId,attacker) {
    const SQL = `INSERT INTO attackers 
    VALUES(?,?,?,?,?,?,?,?,?);`
    try {
        await db.query(SQL,[attackerId,attacker.species,attacker.age,attacker.sex,attacker.breed,attacker.isPet,attacker.vaccinationStatus,attacker.lastVaccinatedOn,attacker.status])
    } catch (error) {
        throw new Error("error inserting attacker details onto attackers table : " + error.message)
    }
}

//create a new entry in the victim_owners table
export async function addNewVictimOwner(victimId,owner) {
    const SQL = `INSERT INTO victim_owners 
    VALUES(?,?,?,?);`
    try {
        await db.query(SQL,[victimId,owner.name,owner.address,owner.mobile])
    } catch (error) {
        throw new Error("DB query failed in inserting victim owner details" + error.message)
    }
}

export async function addDosesGiven(caseId,dose,date){
    const SQL = `INSERT INTO doses_given
    VALUES(?,?,?)`
    try {
        await db.query(SQL,[caseId,dose,date])
    } catch (error) {
        throw new Error("Database query failed in adding dose details : " + error.message)
    }
}


//create a new entry in the case table with the attacker id and victim id
export async function addCase(caseId,doctorId,attackerId,victimId,district,area,attackDate){
    const SQL = `INSERT INTO cases
    VALUES(?,DATE_FORMAT(CURDATE(),'%d-%m-%Y'),?,?,?,?,?,?)`
    const SQL_INC_COUNTER = `UPDATE case_counter 
    SET last_case_number = last_case_number+1`
    try {
        await db.query(SQL,[caseId,attackDate,doctorId,attackerId,victimId,district,area])
        await db.query(SQL_INC_COUNTER)
    } catch (error) {
        throw new Error("DB query failed in inserting caseDetails onto case table " + error.message)
    }
}