import express from 'express' 
import { addDoctor ,allDoctors,loginAdmin,appointmentsAdmin,appointmentCancle,adminDashboard} from '../controllers/adminController.js'

import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter  = express.Router()

adminRouter.post(
    "/add-doctor",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "certificate", maxCount: 1 },
    ]),
    addDoctor
  );
  

adminRouter.post('/login',loginAdmin)

adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)

adminRouter.get('/appointments',authAdmin,appointmentsAdmin)


adminRouter.post('/cancel-appointment' ,authAdmin,appointmentCancle)


adminRouter.get('/dashboard',authAdmin,adminDashboard)



export default adminRouter