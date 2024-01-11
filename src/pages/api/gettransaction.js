import Transaction from "../../../model/transactionSchema";
import connectDb from "../../../lib/mongodb";

const handler = async(req,res)=> {
    let transaction = await Transaction.find()
    res.status(200).json({ transaction })
}

export default connectDb(handler);