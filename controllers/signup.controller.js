import jwt from "jsonwebtoken";
import { getDoctorDetails, insertDoctor } from "../database-services/doctor.database.js";

export const registerDoctor = async(req,res) => {
    const {doctorId,doctorName,workingIn,district,area,DOB} = req.body;

    //returns if any of the input fields are undefined
    if(!(doctorId && doctorName && workingIn && district && area && DOB))
        return res.status(400).send({Success : false, error : "Missing fields - invalid data"})

    try {
        //check if doctor is already registered
        const doctorDetails = await getDoctorDetails(doctorId);
        if(doctorDetails) //doctor already registed
            return res.status(409).send({Success : false, error : "doctor with the given ID is already registered"})
        if(await insertDoctor(doctorId,doctorName,DOB,workingIn,district,area))
            return res.send({Success : true})
    } catch (error) {
        console.log("Error in registering doctor");
        console.log(error);
        return res.send({Success : false})
    }
}

export const login = async(req,res) => {
    try {
        const doctor = await getDoctorDetails(req.body.doctorId);
        if(!doctor)
            return res.status(401).send({isAuth : false}).end()
        if(doctor.DOB === req.body.DOB){
            const token = jwt.sign(req.body.doctorId, process.env.ACCESS_TOKEN_KEY);
            return  res.cookie("jwttoken ", token).send({isAuth : true, ...doctor}).end()
        }
        else
            return res.status(401).send({isAuth : false}).end()
    } catch (error) {
            console.log(error)
            console.log("error loggin in")
            
            return res.status(500).send({isAuth : false,Success : false, error : "Error loggin in!"}).end()
    }
}