import nodemailer from "nodemailer";

/* ================================
   📅 Format Slot Date
================================ */
const formatSlotDate = (slotDate = "") => {
  if (!slotDate || typeof slotDate !== "string") return "N/A";

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateArray = slotDate.split("_");
  if (dateArray.length !== 3) return slotDate;

  return `${dateArray[0]} ${months[Number(dateArray[1])] || ""} ${
    dateArray[2]
  }`.trim();
};

/* ================================
   🚀 Reusable SMTP Transporter
================================ */
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error("❌ SMTP environment variables missing");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // ✅ Verify connection once
  try {
    await transporter.verify();
    console.log("✅ SMTP server is ready");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err.message);
    transporter = null;
  }

  return transporter;
};

/* ================================
   📧 Send Appointment Confirmation
================================ */
export const sendAppointmentConfirmedEmail = async ({
  toEmail,
  userName,
  doctorName,
  slotDate,
  slotTime,
  appointmentId,
}) => {
  try {
    if (!toEmail) {
      return { sent: false, message: "User email not found" };
    }

    const transporter = await getTransporter();
    if (!transporter) {
      return {
        sent: false,
        message: "Email service not configured",
      };
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || "Doctor Appointment Team";

    const formattedDate = formatSlotDate(slotDate);

    const subject = "Appointment Confirmed";

    const text = `
Hi ${userName || "User"},

Your appointment with Dr. ${doctorName || "Doctor"} is confirmed.

Date: ${formattedDate}
Time: ${slotTime}
Appointment ID: ${appointmentId}

Please arrive 10 minutes early.

Thank you.
`;

    const html = `
      <div style="font-family:Arial;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;">
        <div style="background:#0f766e;color:#fff;padding:15px;">
          <h2>Appointment Confirmed</h2>
        </div>
        <div style="padding:20px;">
          <p>Hi ${userName || "User"},</p>
          <p>Your appointment with <b>Dr. ${
            doctorName || "Doctor"
          }</b> is confirmed.</p>

          <div style="background:#f9f9f9;padding:10px;border-radius:8px;">
            <p><b>Date:</b> ${formattedDate}</p>
            <p><b>Time:</b> ${slotTime}</p>
            <p><b>ID:</b> ${appointmentId}</p>
          </div>

          <p>Please arrive 10 minutes early.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log("📧 Appointment Email Sent:", info.messageId);

    return { sent: true };
  } catch (error) {
    console.error("❌ Appointment email error:", error.message);
    return { sent: false, message: error.message };
  }
};

/* ================================
   💰 Send Payment Success Email
================================ */
export const sendPaymentSuccessEmail = async ({
  toEmail,
  userName,
  doctorName,
  slotDate,
  slotTime,
  amount,
  appointmentId,
}) => {
  try {
    if (!toEmail) {
      return { sent: false, message: "User email not found" };
    }

    const transporter = await getTransporter();
    if (!transporter) {
      return {
        sent: false,
        message: "Email service not configured",
      };
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || "Doctor Appointment Team";

    const formattedDate = formatSlotDate(slotDate);

    const subject = "Payment Successful- Wait for Confirmation Email from Doctor";

    const formattedAmount = `₹${Number(amount || 0).toFixed(2)}`;

    const text = `
Hi ${userName || "User"},

Your payment has been received successfully.

Doctor: Dr. ${doctorName}
Date: ${formattedDate}
Time: ${slotTime}
Amount Paid: ${formattedAmount}
Appointment ID: ${appointmentId}

Thank you.
`;

    const html = `
      <div style="font-family:Arial;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;">
        <div style="background:#0f766e;color:#fff;padding:15px;">
          <h2>Payment Successful</h2>
        </div>
        <div style="padding:20px;">
          <p>Hi ${userName || "User"},</p>
          <p>Your payment has been received successfully.</p>

          <div style="background:#f9f9f9;padding:10px;border-radius:8px;">
            <p><b>Doctor:</b> Dr. ${doctorName}</p>
            <p><b>Date:</b> ${formattedDate}</p>
            <p><b>Time:</b> ${slotTime}</p>
            <p><b>Amount:</b> ${formattedAmount}</p>
            <p><b>ID:</b> ${appointmentId}</p>
          </div>

          <p>Please arrive 10 minutes early.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log("📧 Payment Email Sent:", info.messageId);

    return { sent: true };
  } catch (error) {
    console.error("❌ Payment email error:", error.message);
    return { sent: false, message: error.message };
  }
};

/* ================================
   ❌ Send Appointment Rejected Email
================================ */
export const sendAppointmentRejectedEmail = async ({
  toEmail,
  userName,
  doctorName,
  slotDate,
  slotTime,
  appointmentId,
  wasPaid,
}) => {
  try {
    if (!toEmail) {
      return { sent: false, message: "User email not found" };
    }

    const transporter = await getTransporter();
    if (!transporter) {
      return {
        sent: false,
        message: "Email service not configured",
      };
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || "Doctor Appointment Team";

    const formattedDate = formatSlotDate(slotDate);
    const subject = "Appointment Cancelled by Doctor";

    const refundLine = wasPaid
      ? "If your payment was completed, your money will be refunded to your original payment method as per our refund policy."
      : "No payment has been charged for this appointment.";

    const text = `
Hi ${userName || "User"},

We are sorry. Your appointment with Dr. ${doctorName || "Doctor"} has been cancelled by the doctor.

Date: ${formattedDate}
Time: ${slotTime}
Appointment ID: ${appointmentId}

${refundLine}

You can book another appointment from your account.
`;

    const html = `
      <div style="font-family:Arial;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;">
        <div style="background:#b91c1c;color:#fff;padding:15px;">
          <h2>Appointment Cancelled</h2>
        </div>
        <div style="padding:20px;">
          <p>Hi ${userName || "User"},</p>
          <p>We are sorry. Your appointment with <b>Dr. ${
            doctorName || "Doctor"
          }</b> has been cancelled by the doctor.</p>

          <div style="background:#f9f9f9;padding:10px;border-radius:8px;">
            <p><b>Date:</b> ${formattedDate}</p>
            <p><b>Time:</b> ${slotTime}</p>
            <p><b>ID:</b> ${appointmentId}</p>
          </div>

          <p style="margin-top:12px;">${refundLine}</p>
          <p>You can book another appointment from your account.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log("📧 Rejection Email Sent:", info.messageId);

    return { sent: true };
  } catch (error) {
    console.error("❌ Rejection email error:", error.message);
    return { sent: false, message: error.message };
  }
};
