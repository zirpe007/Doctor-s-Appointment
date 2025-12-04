


// import jwt from "jsonwebtoken";

// // ✅ User authentication middleware
// const authUser = async (req, res, next) => {
//   try {
//     const token = req.headers.token; // Token sent directly in headers

//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Not authorized, please log in again" });
//     }

//     // Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded?.id) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Invalid or expired token" });
//     }

//     // ✅ Attach user info to request
//     req.user = { userId: decoded.id };

//     next();
//   } catch (error) {
//     console.error("Auth Error:", error.message);

//     // Optional: differentiate expired token
//     if (error.name === "TokenExpiredError") {
//       return res
//         .status(401)
//         .json({ success: false, message: "Token expired, please log in again" });
//     }

//     return res
//       .status(403)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// };

// // export default authUser;
// import jwt from "jsonwebtoken";

// // User authentication middleware
// const authUser = async (req, res, next) => {
//   try {
//     // 1. Log headers to debug on Render Dashboard
//     console.log("Headers received:", req.headers);

//     // 2. Extract token (handle both 'token' and 'Token' cases)
//     const token = req.headers.token || req.headers.authorization;

//     if (!token) {
//       console.log("No token found in headers");
//       return res.json({ success: false, message: "Not authorized, please log in again" });
//     }

//     // 3. Verify Token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 4. Attach to request
//     // IMPORTANT: Ensure your controllers look for req.body.userId OR req.user.userId
//     req.body.userId = decoded.id; 
    
//     next();

//   } catch (error) {
//     console.log("Auth Error:", error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// export default authUser;
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized login Again" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // --- CRITICAL FIX START ---
    // GET requests do not have a body. req.body is undefined.
    // We MUST create it before assigning userId.
    if (!req.body) {
       req.body = {} 
    }
    
    req.body.userId = token_decode.id;
    // --- CRITICAL FIX END ---

    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;