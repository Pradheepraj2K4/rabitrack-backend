import { getDoctorDetails, insertDoctor } from "../database-services/signup.database.js";

export const registerDoctor = async(req,res) => {
    const {doctorId,doctorName,workingIn,district,area} = req.body;
    try {
        if(await insertDoctor(doctorId,doctorName,workingIn,district,area))
            res.send({Success : true})
    } catch (error) {
        console.log("Error in registering doctor");
        console.log(error);
        res.send({Success : false})
    }
}

export const login = async(req,res) => {
    try {
        const [[doctor]] = await getDoctorDetails(req.body.doctorId);
        if(doctor)
            res.send({isAuth : true, ...doctor})
        else
            res.status(401).send({isAuth : false})
    } catch (error) {
            console.log(error)
            console.log("error loggin in")
            res.send({isAuth : false,Success : false})
    }
}