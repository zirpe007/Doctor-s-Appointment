// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/mongodb.js'
// import connectcloudinary from './config/cloudinary.js'
// import adminRouter from './routes/adminRoute.js'
// import doctorRouter from './routes/doctorRoute.js'
// import userRouter from './routes/userRoute.js'


// // app config
// const app = express()
// const port =process.env.PORT || 4000
// connectDB()
// connectcloudinary()


// // middlewares
// app.use(express.json())
// app.use(cors())

// // Stripe webhook endpoint needs raw body
// app.use('/api/user/stripe-webhook', express.raw({ type: 'application/json' }))


// // api endpoints

// app.use('/api/admin',adminRouter)
// app.use('/api/doctor',doctorRouter)
// app.use ('/api/user',userRouter)
// // app.use('/api/user/appointments',userRouter)



// app.get('/',(req,res)=>{
// res.send('API WORKING ')
// })

// app.listen(port,()=>console.log("Server Started",port))

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectcloudinary()

// --- FIX START: ROBUST CORS ---
// This allows your frontend to send the 'token' header
app.use(cors({
  origin: '*', // ideally replace '*' with your Vercel URL in production
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'token', 'Authorization'] // <--- THIS IS THE FIX
}));
// --- FIX END ---

// middlewares
app.use(express.json())

// Stripe webhook endpoint needs raw body
app.use('/api/user/stripe-webhook', express.raw({ type: 'application/json' }))

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
  res.send('API WORKING ')
})

app.listen(port, () => console.log("Server Started", port))