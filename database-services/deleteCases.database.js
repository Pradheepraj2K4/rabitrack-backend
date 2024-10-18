import { db } from "./db.js"


export async function deleteCaseFromDB(caseId) {
    const SQL_DELETE = `DELETE FROM cases WHERE case_id = ?`
    const SQL_VERIFY = `SELECT * FROM cases WHERE case_id = ?`
    try {
        const [records] = await db.query(SQL_VERIFY,[caseId]) //check whether a case exist with the given case ID
        if(records.length > 0){ //if exists then delete
            await db.query(SQL_DELETE,[caseId])
            return true         
        }
        else
            return false // return false if a case doesn't exist on the given case ID
    } catch (error) {
        console.log("error deleting case from DB" + error)
    }
}


//Used only if there is error in inserting into case table but attacker/victims details are successfully inserted
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