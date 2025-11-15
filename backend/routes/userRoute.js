import express from 'express'


import { registerUser,loginUser, getProfile,updateProfile , bookAppointment, listAppointment ,cancelAppointment, createPaymentIntent, handleStripeWebhook, updateAppointmentPayment} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
// import createPaymentIntent from '../controllers/userController.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)

userRouter.post('/login',loginUser)


userRouter.get('/get-profile',authUser,getProfile)


userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)

userRouter.post('/book-appointment',authUser,bookAppointment)


userRouter.get('/appointments',authUser,listAppointment)

userRouter.post('/cancel-appointment',authUser,cancelAppointment)

userRouter.post('/create-payment', authUser, createPaymentIntent)

userRouter.post('/stripe-webhook', handleStripeWebhook)


userRouter.post('/update-payment-status', authUser, updateAppointmentPayment)













export default userRouter 