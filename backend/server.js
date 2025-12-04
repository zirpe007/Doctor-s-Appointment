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

// middlewares
app.use(cors({
  origin: '*', 
  allowedHeaders: ['Content-Type', 'token', 'Authorization']
}));

// --- STRIPE FIX: THIS MUST BE BEFORE express.json() ---
// Stripe needs the RAW body. If express.json() runs first, it breaks Stripe.
app.use('/api/user/stripe-webhook', express.raw({ type: 'application/json' }))

// --- JSON PARSER ---
app.use(express.json()) 

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
  res.send('API WORKING ')
})

app.listen(port, () => console.log("Server Started", port))