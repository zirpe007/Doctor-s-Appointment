// // import validator from 'validator'
// // import bcrypt from 'bcrypt'
// // import userModel from '../models/userModel.js'
// // import jwt from 'jsonwebtoken'

// // import {v2 as cloudinary} from 'cloudinary'
// // import doctorModel from '../models/doctorModel.js'
// // import appointmentModel from '../models/appointmentModel.js'






// // //api to register user 


// // const registerUser = async (req,res) => {


// //     try {


// //         const {name, email, password} =req.body 
 
// //            if (!name || !password || !email){

// //             return res.json({success:false,message:"missing details"})

// //            }
// //                       // validating email format 
// //            if (!validator.isEmail(email)){
 
// //             return res.json({success:false,message:"Enter A valid Email"})


// //            }

// //                      // validating string password 
// //            if (password.length <8){
 
// //             return res.json({success:false,message:"Enter A Strong password"})

// //            }

// //            // hashing user password 
 
// //               const salt =await bcrypt.genSalt(10)

// //               const hashedpassword = await bcrypt.hash(password,salt)

// //               const userData = {

// //                 name,
// //                 email,
// //                 password: hashedpassword
// //               }

// //               const newUser = new  userModel(userData) 

// //               const user = await newUser.save()
              

// //               const token =jwt.sign({id:user._id},process.env.JWT_SECRET)

// //               res.json({success:true,token})
             

            

// //     } catch (error) {
         
// //     console.log(error)
// //     res.json({success:false,message:error.message}) 


            
// //     }
// // }


// // //Api for userlogin  

// // const loginUser = async (req,res) => {

// //     try {



// //         const {email,password} = req.body
// //         const user = await userModel.findOne({email})

// //            if(!user){
// //              return  res.json({success:false,message:"user does not exit "}) 
                   
// //            }

// //            const isMatch = await bcrypt.compare(password,user.password)

// //           if (isMatch) {
 
// //                   const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

// //                   res.json({success:true,token})

// //            }
// //            else {

// //             res.json({success:false,message:"Invalid credentials"})
// //            }




// //     } catch (error) {
// //         console.log(error)
// //     res.json({success:false,message:error.message}) 

// //     }
// // }

// // // API to get user profile data 
// // const getProfile = async(req,res)=>{

// //   try {
      
// //     // const{userId} =req.body 
// //     const { userId } = req.user;

// //     const userData = await userModel.findById(userId).select('-password')
// //     res.json({success:true,userData})


// //   } catch (error) {
// //     console.log(error)
// //     res.json({success:false,message:error.message}) 
    
// //   }
// // }

// // // API to update user profile

// // const updateProfile= async (req,res) =>{
// //  try {


// //   //  const {userId,name,phone,address,dob,gender} = req.body
// //   const {name,phone,address,dob,gender} = req.body
// //   const userId = req.user.userId;  // ✅ match with your middleware


// //    const imageFile =req.file 

// //    if (!name ||!phone  ||!dob||!gender) {
// //           return res.json({success:false,message:"Data missing"})
// //    }

// //   // await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender}) 

// //   await userModel.findByIdAndUpdate(
// //     userId,
// //     { $set: { name, phone, address: JSON.parse(address), dob, gender } },
// //     { new: true }
// //   );
  
// //   if (imageFile) {

// //               // upload image to cloudanary 

// //               const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})

// //               const imageUrl = imageUpload.secure_url

// //               await userModel.findByIdAndUpdate(userId,{image:imageUrl})
    
// //   }

// //   res.json({success:true,message:"profile updated"})
  
// //  } catch (error) {
// //   console.log(error)
// //   res.json({success:false,message:error.message}) 
// //  }

// // }


// // const bookAppointment = async (req, res) => {

// //     try {

// //         const { userId, docId, slotDate, slotTime } = req.body

// //         const docData = await doctorModel.findById(docId).select('-password')

// //         if (!docData.available) {
// //             return res.json({ success: false, message: 'Doctor not available' })
// //         }

// //         let slots_booked = docData.slots_booked

// //         // checking for slot availability
// //         if (slots_booked[slotDate]) {
  

// //       if (!docData.available) {
// //           return res.json({ success: false, message: 'Doctor not available' })
// //       }

// //       let slots_booked = docData.slots_booked

// //       // checking for slot availability
// //       if (slots_booked[slotDate]) {
// //         return res.json({success:false,message:'Slot not available'})
// //       } else {
// //           slots_booked[slotDate].push(slotTime)
// //       }
// //       } else {
// //           slots_booked[slotDate] = []
// //           slots_booked[slotDate].push(slotTime)
// //       }
      
// //       const userData = await userModel.findById(userId).select('-password')
      
// //       delete docData.slots_booked
      
// //       const appointmentData = {
// //           userId,
// //           docId,
// //           userData,
// //           docData,
// //           amount:docData.fees,
// //           slotTime,
// //           slotDate,
// //           date:Date.now()
// //       }

// //       const newAppointment = new appointmentModel(appointmentData)

// //       await newAppointment.save()

// //       // save new slots data in docData
// // await doctorModel.findByIdAndUpdate(docId, {slots_booked})

// // res.json({success: true, message: 'Appointment Booked'})
// // } catch (error) {
// //     console.log(error)
// //     res.json({ success: false, message: error.message })
// // }
// // }


      





// // export {registerUser,loginUser,getProfile,updateProfile,bookAppointment}








// import validator from 'validator'
// import bcrypt from 'bcrypt'
// import userModel from '../models/userModel.js'
// import jwt from 'jsonwebtoken'
// import { v2 as cloudinary } from 'cloudinary'
// import doctorModel from '../models/doctorModel.js'
// import appointmentModel from '../models/appointmentModel.js'

// // =====================
// // REGISTER USER
// // =====================
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body

//     if (!name || !email || !password) {
//       return res.json({ success: false, message: 'Missing details' })
//     }

//     if (!validator.isEmail(email)) {
//       return res.json({ success: false, message: 'Enter a valid email' })
//     }

//     if (password.length < 8) {
//       return res.json({ success: false, message: 'Password must be at least 8 characters' })
//     }

//     const existingUser = await userModel.findOne({ email })
//     if (existingUser) {
//       return res.json({ success: false, message: 'Email already registered' })
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     })

//     const savedUser = await newUser.save()
//     const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

//     res.json({ success: true, token })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // LOGIN USER
// // =====================
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body

//     const user = await userModel.findOne({ email })
//     if (!user) {
//       return res.json({ success: false, message: 'User does not exist' })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.json({ success: false, message: 'Invalid credentials' })
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
//     res.json({ success: true, token })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // GET PROFILE
// // =====================
// export const getProfile = async (req, res) => {
//   try {
//     const { userId } = req.user
//     const userData = await userModel.findById(userId).select('-password')
//     res.json({ success: true, userData })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // UPDATE PROFILE
// // =====================
// export const updateProfile = async (req, res) => {
//   try {
//     const { name, phone, address, dob, gender } = req.body
//     const userId = req.user.userId
//     const imageFile = req.file

//     if (!name || !phone || !dob || !gender) {
//       return res.json({ success: false, message: 'Data missing' })
//     }

//     await userModel.findByIdAndUpdate(
//       userId,
//       { $set: { name, phone, address: JSON.parse(address), dob, gender } },
//       { new: true }
//     )

//     if (imageFile) {
//       const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
//       await userModel.findByIdAndUpdate(userId, { image: upload.secure_url })
//     }

//     res.json({ success: true, message: 'Profile updated' })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // BOOK APPOINTMENT
// // =====================
// export const bookAppointment = async (req, res) => {
//   try {
//     const { userId, docId, slotDate, slotTime } = req.body

//     if (!userId || !docId || !slotDate || !slotTime) {
//       return res.json({ success: false, message: 'Missing required fields' })
//     }

//     const docData = await doctorModel.findById(docId).select('-password')
//     if (!docData) {
//       return res.json({ success: false, message: 'Doctor not found' })
//     }

//     if (!docData.available) {
//       return res.json({ success: false, message: 'Doctor not available' })
//     }

//     let slots_booked = docData.slots_booked || {}

//     // ✅ If date exists and slot already booked
//     if (slots_booked[slotDate]?.includes(slotTime)) {
//       return res.json({ success: false, message: 'Slot already booked' })
//     }

//     // ✅ Add new slot
//     if (!slots_booked[slotDate]) {
//       slots_booked[slotDate] = []
//     }
//     slots_booked[slotDate].push(slotTime)

//     const userData = await userModel.findById(userId).select('-password')
//     if (!userData) {
//       return res.json({ success: false, message: 'User not found' })
//     }

//     const appointmentData = {
//       userId,
//       docId,
//       userData,
//       docData,
//       amount: docData.fees,
//       slotDate,
//       slotTime,
//       date: Date.now(),
//     }

//     const newAppointment = new appointmentModel(appointmentData)
//     await newAppointment.save()

//     // Save updated slot data
//     await doctorModel.findByIdAndUpdate(docId, { slots_booked })

//     res.json({ success: true, message: 'Appointment booked successfully' })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }


// import validator from 'validator'
// import bcrypt from 'bcrypt'
// import userModel from '../models/userModel.js'
// import jwt from 'jsonwebtoken'
// import { v2 as cloudinary } from 'cloudinary'
// import doctorModel from '../models/doctorModel.js'
// import appointmentModel from '../models/appointmentModel.js'
// // import added for stripe
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// // import razorpay from 'razorpay'

// // =====================
// // REGISTER USER
// // =====================
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body

//     if (!name || !email || !password) {
//       return res.json({ success: false, message: "Missing details" })
//     }

//     if (!validator.isEmail(email)) {
//       return res.json({ success: false, message: "Enter a valid email" })
//     }

//     if (password.length < 8) {
//       return res.json({ success: false, message: "Enter a strong password (min 8 chars)" })
//     }

//     const existingUser = await userModel.findOne({ email })
//     if (existingUser) {
//       return res.json({ success: false, message: "Email already registered" })
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword
//     })

//     const user = await newUser.save()

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

//     res.json({ success: true, token })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // LOGIN USER
// // =====================
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const user = await userModel.findOne({ email })

//     if (!user) {
//       return res.json({ success: false, message: "User not found" })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.json({ success: false, message: "Invalid credentials" })
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
//     res.json({ success: true, token })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // GET USER PROFILE
// // =====================
// const getProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId
//     const userData = await userModel.findById(userId).select('-password')
//     res.json({ success: true, userData })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // UPDATE USER PROFILE
// // =====================
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId
//     const { name, phone, address, dob, gender } = req.body
//     const imageFile = req.file

//     if (!name || !phone || !dob || !gender) {
//       return res.json({ success: false, message: "Missing data" })
//     }

//     const updateData = {
//       name,
//       phone,
//       address: address ? JSON.parse(address) : {},
//       dob,
//       gender,
//     }

//     if (imageFile) {
//       const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
//       updateData.image = uploadedImage.secure_url
//     }

//     await userModel.findByIdAndUpdate(userId, updateData, { new: true })
//     res.json({ success: true, message: "Profile updated successfully" })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // BOOK APPOINTMENT
// // =====================
// const bookAppointment = async (req, res) => {
//   try {
//     const userId = req.user.userId
//     const { docId, slotDate, slotTime, paymentIntentId } = req.body

//     if (!docId || !slotDate || !slotTime) {
//       return res.json({ success: false, message: "Missing required fields" })
//     }

//     const docData = await doctorModel.findById(docId)
//     if (!docData) {
//       return res.json({ success: false, message: "Doctor not found" })
//     }

//     if (!docData.available) {
//       return res.json({ success: false, message: "Doctor not available" })
//     }

//     let slots_booked = docData.slots_booked || {}

//     // Create a date key if it doesn't exist
//     if (!slots_booked[slotDate]) {
//       slots_booked[slotDate] = []
//     }

//     // Check if slot is already booked
//     if (slots_booked[slotDate].includes(slotTime)) {
//       return res.json({ success: false, message: "Slot already booked, please choose another" })
//     }

//     // Add this time slot
//     slots_booked[slotDate].push(slotTime)

//     const userData = await userModel.findById(userId).select('-password')
//     const cleanDocData = await doctorModel.findById(docId).select('-password -slots_booked')

//     // Create new appointment record
//     const appointmentData = new appointmentModel({
//       userId,
//       docId,
//       userData,
//       docData: cleanDocData,
//       amount: docData.fees,
//       slotDate,
//       slotTime,
//       date: Date.now(),
//       paymentIntentId: paymentIntentId || null,
//       payment: !!paymentIntentId, // Mark as paid if paymentIntentId is provided
//     })

//     await appointmentData.save()
//     await doctorModel.findByIdAndUpdate(docId, { slots_booked })

//     res.json({ 
//       success: true, 
//       message: paymentIntentId ? "Appointment booked and paid successfully" : "Appointment booked successfully",
//       appointment: appointmentData 
//     })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }



// // API to get user appointments for frontend my-appointments page
// const listAppointment = async (req, res) => {
//   try {
//     // const { userId } = req.body
//     const userId = req.user.userId

//     const appointments = await appointmentModel.find({ userId })

//     res.json({ success: true, appointments })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }
// // API to cancel appointment
// const cancelAppointment = async (req, res) => {
//   try {
//     const { appointmentId} = req.body

//     const userId = req.user.userId 

//     const appointmentData = await appointmentModel.findById(appointmentId)

//     // verify appointment user
//     // if (appointmentData.userId !== userId) {
//     //   return res.json({success:false,message:'Unauthorized action'})
//     // }

//     if (appointmentData.userId.toString() !== userId.toString()) {
//       return res.json({ success:false, message:'Unauthorized action' })
//     }
    

//     await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

//     const {docId, slotDate, slotTime} = appointmentData

//     const doctorData = await doctorModel.findById(docId)
    
//     let slots_booked = doctorData.slots_booked
    
//     slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    
//     await doctorModel.findByIdAndUpdate(docId, {slots_booked})
    
//     res.json({success:true, message:'Appointment Cancelled'})
    


//   } 
//   catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }

// }

// // =====================
// // UPDATE APPOINTMENT PAYMENT STATUS
// // =====================
// const updateAppointmentPayment = async (req, res) => {
//   try {
//     const { appointmentId, paymentIntentId } = req.body
//     const userId = req.user.userId

//     const appointment = await appointmentModel.findById(appointmentId)
    
//     if (!appointment) {
//       return res.json({ success: false, message: "Appointment not found" })
//     }

//     // Verify appointment belongs to user
//     if (appointment.userId.toString() !== userId.toString()) {
//       return res.json({ success: false, message: "Unauthorized action" })
//     }

//     // Update payment status
//     await appointmentModel.findByIdAndUpdate(appointmentId, {
//       payment: true,
//       paymentIntentId: paymentIntentId,
//       status: 'confirmed'
//     })

//     res.json({ 
//       success: true, 
//       message: "Payment status updated successfully" 
//     })

//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// // =====================
// // CREATE STRIPE PAYMENT INTENT
// // =====================
// const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount, currency = 'usd', appointmentDetails } = req.body
//     const userId = req.user.userId

//     console.log('Creating checkout session for user:', userId)
//     console.log('Payment details:', { amount, currency, appointmentDetails })

//     // Validate required fields
//     if (!amount || amount <= 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Valid amount is required" 
//       })
//     }

//     if (!appointmentDetails) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Appointment details are required" 
//       })
//     }

//     // Validate appointment details structure
//     if (!appointmentDetails.doctorId || !appointmentDetails.slotDate || !appointmentDetails.slotTime) {
//       return res.status(400).json({
//         success: false,
//         message: "Appointment details must include doctorId, slotDate, and slotTime"
//       })
//     }

//     // Convert amount to cents and ensure it's an integer
//     const amountInCents = Math.round(parseFloat(amount) * 100)
    
//     if (amountInCents < 50) { // Stripe minimum amount (50 cents = $0.50)
//       return res.status(400).json({
//         success: false,
//         message: "Amount must be at least $0.50"
//       })
//     }

//     console.log('Creating Stripe checkout session with amount:', amountInCents, 'cents')

//     // Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: currency.toLowerCase(),
//             product_data: {
//               name: 'Doctor Appointment',
//               description: `Appointment with Dr. ${appointmentDetails.doctorName || 'Doctor'} on ${appointmentDetails.slotDate} at ${appointmentDetails.slotTime}`,
//             },
//             unit_amount: amountInCents,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.FRONTEND_URL}/my-appointments?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentDetails.id || ''}`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
//       client_reference_id: userId.toString(),
//       metadata: {
//         userId: userId.toString(),
//         doctorId: appointmentDetails.doctorId.toString(),
//         slotDate: appointmentDetails.slotDate,
//         slotTime: appointmentDetails.slotTime,
//         appointmentType: appointmentDetails.type || 'general',
//         ...appointmentDetails
//       },
//       // Optional: Add customer email if available
//       customer_email: req.user.email || undefined,
//     })

//     console.log('Checkout session created successfully:', session.id)

//     res.json({ 
//       success: true, 
//       sessionId: session.id,
//       url: session.url, // This is the URL to redirect user to Stripe Checkout
//       message: "Checkout session created successfully"
//     })

//   } catch (error) {
//     console.error('Stripe Checkout Session Error:', error)
    
//     // Handle specific Stripe errors
//     if (error.type === 'StripeInvalidRequestError') {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment request",
//         error: error.message
//       })
//     }

//     if (error.type === 'StripeAuthenticationError') {
//       return res.status(500).json({
//         success: false,
//         message: "Payment service configuration error",
//         error: "Stripe authentication failed"
//       })
//     }

//     if (error.type === 'StripeConnectionError') {
//       return res.status(503).json({
//         success: false,
//         message: "Payment service temporarily unavailable"
//       })
//     }

//     // Generic error response
//     res.status(500).json({ 
//       success: false, 
//       message: "Internal server error while creating payment session",
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
//     })
//   }
// }


// // Add this new function to your userController.js
// const handleStripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     // Verify webhook signature
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.log(`Webhook signature verification failed.`, err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the checkout.session.completed event
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
    
//     try {
//       // Here you can update your database to mark the appointment as paid
//       console.log('Payment successful for session:', session.id);
      
//       // Extract appointment details from session metadata
//       const { userId, doctorId, slotDate, slotTime } = session.metadata;
      
//       // Update your appointment record in database
//       // await appointmentModel.findOneAndUpdate(
//       //   { userId, doctorId, slotDate, slotTime },
//       //   { payment: true, paymentIntentId: session.id }
//       // );
      
//     } catch (error) {
//       console.error('Error updating appointment after payment:', error);
//     }
//   }

//   res.json({ received: true });
// }



// export {
//   registerUser,
//   loginUser,
//   getProfile,
//   updateProfile,
//   bookAppointment,
//   listAppointment,
//   cancelAppointment,
//   createPaymentIntent,
//   handleStripeWebhook,
//   updateAppointmentPayment
// }

import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// =====================
// REGISTER USER
// =====================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password (min 8 chars)" })
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    })

    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// LOGIN USER
// =====================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// GET USER PROFILE
// =====================
const getProfile = async (req, res) => {
  try {
    // FIX: Use req.body.userId instead of req.user.userId
    const userId = req.body.userId
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// UPDATE USER PROFILE
// =====================
const updateProfile = async (req, res) => {
  try {
    // FIX: Use req.body.userId
    const userId = req.body.userId
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing data" })
    }

    const updateData = {
      name,
      phone,
      address: address ? JSON.parse(address) : {},
      dob,
      gender,
    }

    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      updateData.image = uploadedImage.secure_url
    }

    await userModel.findByIdAndUpdate(userId, updateData, { new: true })
    res.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// BOOK APPOINTMENT
// =====================
const bookAppointment = async (req, res) => {
  try {
    // FIX: Use req.body.userId
    const userId = req.body.userId
    const { docId, slotDate, slotTime, paymentIntentId } = req.body

    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing required fields" })
    }

    const docData = await doctorModel.findById(docId)
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" })
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" })
    }

    let slots_booked = docData.slots_booked || {}

    // Create a date key if it doesn't exist
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = []
    }

    // Check if slot is already booked
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot already booked, please choose another" })
    }

    // Add this time slot
    slots_booked[slotDate].push(slotTime)

    const userData = await userModel.findById(userId).select('-password')
    const cleanDocData = await doctorModel.findById(docId).select('-password -slots_booked')

    // Create new appointment record
    const appointmentData = new appointmentModel({
      userId,
      docId,
      userData,
      docData: cleanDocData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
      paymentIntentId: paymentIntentId || null,
      payment: !!paymentIntentId, // Mark as paid if paymentIntentId is provided
    })

    await appointmentData.save()
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ 
      success: true, 
      message: paymentIntentId ? "Appointment booked and paid successfully" : "Appointment booked successfully",
      appointment: appointmentData 
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// LIST APPOINTMENTS
// =====================
const listAppointment = async (req, res) => {
  try {
    // FIX: Use req.body.userId
    const userId = req.body.userId

    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// CANCEL APPOINTMENT
// =====================
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    
    // FIX: Use req.body.userId
    const userId = req.body.userId 

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
        return res.json({ success: false, message: "Appointment not found" })
    }

    // verify appointment user
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success:false, message:'Unauthorized action' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

    const {docId, slotDate, slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)
    
    let slots_booked = doctorData.slots_booked
    
    if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    }
    
    await doctorModel.findByIdAndUpdate(docId, {slots_booked})
    
    res.json({success:true, message:'Appointment Cancelled'})

  } 
  catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// UPDATE APPOINTMENT PAYMENT STATUS
// =====================
const updateAppointmentPayment = async (req, res) => {
  try {
    const { appointmentId, paymentIntentId } = req.body
    
    // FIX: Use req.body.userId
    const userId = req.body.userId

    const appointment = await appointmentModel.findById(appointmentId)
    
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" })
    }

    // Verify appointment belongs to user
    if (appointment.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" })
    }

    // Update payment status
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
      paymentIntentId: paymentIntentId,
      status: 'confirmed'
    })

    res.json({ 
      success: true, 
      message: "Payment status updated successfully" 
    })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// =====================
// CREATE STRIPE PAYMENT INTENT
// =====================
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', appointmentDetails } = req.body
    
    // FIX: Use req.body.userId
    const userId = req.body.userId

    console.log('Creating checkout session for user:', userId)
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" })
    }

    if (!appointmentDetails) {
      return res.status(400).json({ success: false, message: "Appointment details are required" })
    }

    // Validate appointment details structure
    if (!appointmentDetails.doctorId || !appointmentDetails.slotDate || !appointmentDetails.slotTime) {
      return res.status(400).json({
        success: false,
        message: "Appointment details must include doctorId, slotDate, and slotTime"
      })
    }

    // Convert amount to cents and ensure it's an integer
    const amountInCents = Math.round(parseFloat(amount) * 100)
    
    if (amountInCents < 50) { 
      return res.status(400).json({ success: false, message: "Amount must be at least $0.50" })
    }

    // FIX: Use Vercel URL directly to ensure redirection works
    // Or use process.env.FRONTEND_URL if it is strictly defined in Render
    const frontend_url = process.env.FRONTEND_URL || 'https://doctor-s-appointment-client.vercel.app'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Doctor Appointment',
              description: `Appointment with Dr. ${appointmentDetails.doctorName || 'Doctor'} on ${appointmentDetails.slotDate} at ${appointmentDetails.slotTime}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // FIX: Ensure success_url points to Vercel
      success_url: `${frontend_url}/my-appointments?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentDetails.id || ''}`,
      cancel_url: `${frontend_url}/payment-cancelled`,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        doctorId: appointmentDetails.doctorId.toString(),
        slotDate: appointmentDetails.slotDate,
        slotTime: appointmentDetails.slotTime,
        appointmentType: appointmentDetails.type || 'general',
        ...appointmentDetails
      }
      // Removed req.user.email to prevent crash since req.user is undefined
    })

    res.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url, 
      message: "Checkout session created successfully"
    })

  } catch (error) {
    console.error('Stripe Checkout Session Error:', error)
    res.status(500).json({ 
      success: false, 
      message: "Internal server error while creating payment session",
      error: error.message 
    })
  }
}


// =====================
// HANDLE STRIPE WEBHOOK
// =====================
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      console.log('Payment successful for session:', session.id);
      
      // Extract appointment details from session metadata
      const { userId, doctorId, slotDate, slotTime } = session.metadata;
      
      // Add your logic to update the database here if needed
      // Currently, your payment verification happens on the frontend redirect via updateAppointmentPayment
      
    } catch (error) {
      console.error('Error updating appointment after payment:', error);
    }
  }

  res.json({ received: true });
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  createPaymentIntent,
  handleStripeWebhook,
  updateAppointmentPayment
}