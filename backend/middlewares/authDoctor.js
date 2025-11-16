


import jwt from "jsonwebtoken";

// ✅ Docotr  authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers.token; // Token sent directly in headers

    if (!dtoken) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, please log in again" });
    }

    // Verify JWT
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // ✅ Attach user info to request
    req.user = { docId: decoded.id };

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

export default authDoctor;
