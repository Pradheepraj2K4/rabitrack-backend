import { db } from "./db.js";

export const insertDoctor = async(doctorId,doctorName,DOB,workingIn,district,area) => {
    const SQL  = `INSERT INTO doctors
    VALUES(?,?,?,?,?,?)`

    try {
        await db.query(SQL,[doctorId,doctorName,DOB,workingIn,district,area])
        return true;
    } catch (error) {
        console.log(error)
        console.log("Error in inserting doctor into DB");
        return false;
    }
}

export const getDoctorDetails = async(doctorId) => {
    const SQL = `SELECT doctor_id,doctor_name,working_in,district,area,DATE_FORMAT(DOB,'%Y-%m-%d') as DOB FROM doctors
    WHERE doctor_id = ?`
    try {
        const [[records]] = await db.query(SQL,[doctorId]);
        return records;
    } catch (error) {
        console.log("Error in fetching doctor details - db")
        console.log(error)
        return false
    }
}