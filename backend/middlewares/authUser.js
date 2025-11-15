// import jwt from "jsonwebtoken"

// // user autherticationn middlewaree 

// const authUser = async (req,res,next) => {

// try {

//     const {token} = req.headers
//       if(!token){
//          return res.json({success:false,message:"Not Authorized login Again"})
//       }
//       const token_decode = jwt.verify(token,process.env.JWT_SECRET)

//       // req.body.userId= token_decode.id
//       req.user = { userId: token_decode.id } // in middleware

//       next() 

//     //    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){

//     //     return res.json({success:false,message:"Not Authorized login Again"})
//     //    }



      
     
// } catch (error) {
    
//     console.log(error)
//     res.json({success:false,message:error.message})   
// }


// }

// export default authUser



import jwt from "jsonwebtoken";

// ✅ User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token; // Token sent directly in headers

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, please log in again" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // ✅ Attach user info to request
    req.user = { userId: decoded.id };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    // Optional: differentiate expired token
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please log in again" });
    }

    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
