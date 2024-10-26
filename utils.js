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

//returns a character that represents species 
export function getSpeciesCode(species){

    switch(species.toLowerCase()){
        case "dog" : 
                return 'D';
        case "cat" :
                return 'C';
        case "goat" :
                return 'G';
        case "sheep" :
                return 'S';
        case "cattle " :
                return 'B';
        default :
                return 'O';
    }
}
