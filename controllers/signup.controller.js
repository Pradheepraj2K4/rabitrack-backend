import jwt from "jsonwebtoken";
import { getDoctorDetails, insertDoctor } from "../database-services/doctor.database.js";

export const registerDoctor = async(req,res) => {
    const {doctorId,doctorName,workingIn,district,area,DOB,mobile} = req.body;

    //returns if any of the input fields are undefined
    if(!(doctorId && doctorName && workingIn && district && area && DOB && mobile))
        return res.status(400).send({Success : false, error : "Missing fields - invalid data"})

    try {
        //check if doctor is already registered
        const doctorDetails = await getDoctorDetails(doctorId);
        if(doctorDetails) //doctor already registed
            return res.status(409).send({Success : false, error : "doctor with the given ID is already registered"})

        await insertDoctor(doctorId,doctorName,DOB,workingIn,district,area,mobile)
        return res.send({Success : true})
    } catch (error) {
        console.log("Error in registering doctor " + error);
        return res.status(500).send({Success : false})
    }
}

export const login = async(req,res) => {
    try {
        const doctor = await getDoctorDetails(req.body.doctorId);
        if(!doctor)
            return res.status(401).send({isAuth : false})
        if(doctor.DOB === req.body.DOB){
            const token = jwt.sign(req.body.doctorId, process.env.ACCESS_TOKEN_KEY);
            return  res.cookie("jwttoken ", token).send({isAuth : true, ...doctor})
        }
        else
            return res.status(401).send({isAuth : false})
    } catch (error) {
            console.log("error logging in " + error)
            return res.status(500).send({isAuth : false,Success : false, error : "Error logging in!"})
    }
}


export const adminLogin = async (req,res) => {
    try {
        const token = jwt.sign("admin",process.env.ACCESS_TOKEN_KEY);
        return res.cookie(res.cookie('jwttoken', token, {
            httpOnly: true,          // Set to false if you need client-side access
            secure: process.env.NODE_ENV === 'production', // Set true for HTTPS
            sameSite: 'None',         // Required for cross-origin
        })).send({isAuth : true});
    } catch (error) {
        console.log(error)
        res.status(500).send({Success : false})
    }
}