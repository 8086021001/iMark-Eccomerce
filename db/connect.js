
const mongoose =require('mongoose')

const connectDB = (url)=>{
    mongoose.set('strictQuery', true);
    return mongoose.connect(url);
}
exports.connectDb = () => mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
module.exports = connectDB