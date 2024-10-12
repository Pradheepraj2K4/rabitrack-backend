import { getDoctorDetails, insertDoctor } from "../database-services/signup.database.js";

export const registerDoctor = async(req,res) => {
    const {doctorId,doctorName,workingIn,district,area} = req.body;
    try {
        //check if doctor is already registered
        const doctorDetails = await getDoctorDetails(doctorId);
        if(doctorDetails.length>0) //doctor already registed
            return res.send({Success : false, error : "doctor with the given ID is already registered"})
        if(await insertDoctor(doctorId,doctorName,workingIn,district,area))
            return res.send({Success : true})
    } catch (error) {
        console.log("Error in registering doctor");
        console.log(error);
        return res.send({Success : false})
    }
}

export const login = async(req,res) => {
    try {
        const [[doctor]] = await getDoctorDetails(req.body.doctorId);
        if(doctor)
            return res.send({isAuth : true, ...doctor}).end()
        else
            return res.status(401).send({isAuth : false}).end()
    } catch (error) {
            console.log(error)
            console.log("error loggin in")
            return res.send({isAuth : false,Success : false}).end()
    }
}