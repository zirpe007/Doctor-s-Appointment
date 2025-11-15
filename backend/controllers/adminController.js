import validator from "validator"
import  bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
// Api for the additg the doctor

const addDoctor = async (req,res)=> {
    try {

        const { name ,email,password,speciality,degree,experience,about,fees ,address} = req.body
         const imageFile= req.file

        // check if file exists
        if (!imageFile) {
          return res.json({success:false, message:"Image file is required"})
      }

         // checking for the all data to add doctor 
          if (!name || !email|| !password || !speciality || !degree || !experience || !about|| !fees || !address){

            return res.json({success:false,message:"Missing Details"})

          }
          // validating the email format
          if  (!validator.isEmail(email)){
            return res.json({success:false,message:"please Enter the Valid Email"})

          }
           /// validating Strong password 
          if (password.length<8){

            return res.json({success:false,message:"please Enter Strong Password"})

          }

        
           //  hashing doctor password 
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password ,salt)

           // upload image to cloudunary 
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name ,
            email,
            image: imageUrl,
            password : hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date: Date.now()
        }

        const newDoctor =new doctorModel(doctorData)

        await newDoctor.save()

        res.json({success:true,message:"Doctor added"})

        } catch (error) {
        
            console.log(error)
            res.json({success:false,message:error.message})   
    }

}

// API  FOR THE ADMIN  LOGIN

const loginAdmin = async (req,res) => {

  try {
              const {email,password}=req.body

              if (email=== process.env.ADMIN_EMAIL  && password === process.env.ADMIN_PASSWORD){
                      //  const token =jwt.sign(email+password, process.env.JWT_SECRET)
                      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" })


                       res.json({success:true ,token})
              }  else {

                res.json({success:false,message:"Invalid credentials"})
              }
    
  } catch (error) {
     
    console.log(error)
    res.json({success:false,message:error.message})   
  }
}


// API to get all docotr list 
const allDoctors = async(req,res) => {
try {

  const doctors =await doctorModel.find({}).select('-password')

  res.json({success:true,doctors})
  
} catch (error) {
  console.log(error)
  res.json({success:false,message:error.message}) 
  
}

}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
      const appointments = await appointmentModel.find({})
      res.json({success:true,appointments})
  } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
  }
}



const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId} = req.body

    const userId = req.user.userId 

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointment user
    // if (appointmentData.userId !== userId) {
    //   return res.json({success:false,message:'Unauthorized action'})
    // }

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success:false, message:'Unauthorized action' })
    }
    

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

    const {docId, slotDate, slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)
    
    let slots_booked = doctorData.slots_booked
    
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    
    await doctorModel.findByIdAndUpdate(docId, {slots_booked})
    
    res.json({success:true, message:'Appointment Cancelled'})
    


  } 
  catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}




 

export{addDoctor,loginAdmin,allDoctors,appointmentsAdmin}


