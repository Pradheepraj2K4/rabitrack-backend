import { db } from "./db.js";

export const insertDoctor = async(doctorId,doctorName,DOB,workingIn,district,area,mobile) => {
    const SQL  = `INSERT INTO doctors
    VALUES(?,?,?,?,?,?,?)`

    try {
        await db.query(SQL,[doctorId,doctorName,DOB,workingIn,district,area,mobile])
    } catch (error) {
        throw new Error("DB query failed in inserting doctor into DB " + error.message);
    }
}

export const getDoctorDetails = async(doctorId) => {
    const SQL = `SELECT doctor_id,doctor_name,working_in,district,area,mobile_no,DATE_FORMAT(DOB,'%Y-%m-%d') as DOB FROM doctors
    WHERE doctor_id = ?`
    try {
        const [[records]] = await db.query(SQL,[doctorId]);
        return records;
    } catch (error) {
        throw new Error("DB query failed in fetching doctor details " + error.message)
    }
}