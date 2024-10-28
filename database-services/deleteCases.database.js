import { db } from "./db.js"


export async function deleteCaseFromDB(caseId) {
    const SQL_DELETE = `DELETE FROM cases WHERE case_id = ?`
    const SQL_VERIFY = `SELECT * FROM cases WHERE case_id = ?`
    try {
        const [records] = await db.query(SQL_VERIFY,[caseId]) //check whether a case exist with the given case ID
        if(records.length > 0){ //if exists then delete
            await db.query(SQL_DELETE,[caseId])//delete entry from case table
            await deleteAttacker(records[0].attacker_id)//delete from attacker table
            await deleteAttacker(records[0].victim_id)//delete from victim table
            await deleteVictimOwner(records[0].victim_id)
            await deleteDosesGiven(caseId);
            return true         
        }
        else
            return false // return false if a case doesn't exist on the given case ID
    } catch (error) {
        throw new Error("DB query failed in deleting case" + error.message)
    }
}

//Used only if there is error in inserting into case table but attacker/victims details are successfully inserted
export async function deleteAttacker(attackerId){
    const SQL = `DELETE FROM attackers
    WHERE attacker_id = ?`
    try {
        await db.query(SQL,[attackerId]);
    } catch (error) {
        throw new Error("DB query failed in deleting attacker" + error.message)
    }
}
export async function deleteVictim(victimId){
    const SQL = `DELETE FROM victims
    WHERE victim_id = ?`
    try {
        await db.query(SQL,[victimId]);
    } catch (error) {
        throw new Error("DB query failed in deleting victim" + error.message)
    }
}

export async function deleteVictimOwner(victimId){
    const SQL = `DELETE FROM victim_owners
    WHERE victim_id = ?`
    try {
        await db.query(SQL,[victimId]);
    } catch (error) {
        throw new Error("DB query failed in deleting victim owner" + error.message)
    }
}

export async function deleteDosesGiven(caseId){
    const SQL = `DELETE FROM doses_given
    WHERE case_id = ?`
    try {
        await db.query(SQL,[caseId]);
    } catch (error) {
        throw new Error("DB query failed in deleting doseDetails" + error.message)
    }
}