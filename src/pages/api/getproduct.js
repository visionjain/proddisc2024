import Product from "../../../model/productschema";
import connectDb from "../../../lib/mongodb";

const handler = async(req,res)=> {
    let product = await Product.find()
    res.status(200).json({ product })
}

export default connectDb(handler);