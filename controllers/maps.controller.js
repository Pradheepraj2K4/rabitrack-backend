import { fetchCaseCountWithLocation } from "../database-services/report.database.js"

export const getLocation = async(req,res) => {
    try {
        const cases = await fetchCaseCountWithLocation()
        return res.send(cases)
    } catch (error) {
        console.log(error)
        return res.send({Succcess : false, error : "Unexpected error occured"})
    }
}