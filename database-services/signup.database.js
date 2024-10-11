import { db } from "./database.js";

export const insertDoctor = async(doctorId,doctorName,workingIn,district,area) => {
    const SQL  = `INSERT INTO doctors
    VALUES(?,?,?,?,?)`

    try {
        await db.query(SQL,[doctorId,doctorName,workingIn,district,area])
        return true;
    } catch (error) {
        console.log(error)
        console.log("Error in inserting doctor into DB");
        return false;
    }
}

export const getDoctorDetails = async(doctorId) => {
    const SQL = `SELECT * FROM doctors
    WHERE doctor_id = ?`
    try {
        const records = db.query(SQL,[doctorId]);
        return records;
    } catch (error) {
        console.log("Error in fetching doctor details - db")
        console.log(error)
        return false
    }
}