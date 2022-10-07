import mongoose from 'mongoose'


const dbConnect =async (DATABASE_URL,DB_NAME)=>{
    try{
        const DB_OPTIONS ={
            dbName:DB_NAME
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('Connected')
    }catch{
        console.log('Something Went Wrong')
    }
}

export default dbConnect