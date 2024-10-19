import jwt from "jsonwebtoken"

export function authorize(token){
    let isAuth = false
        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_KEY,(err, doctorId) => {
                if(err) 
                    isAuth = false
                else
                    isAuth = true;
            });
        }
        else
           return false

        return isAuth
}