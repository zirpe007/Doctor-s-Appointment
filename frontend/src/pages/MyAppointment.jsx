import React, { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import StripePaymentForm from "../components/StripePaymentForm";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [payingAppointment, setPayingAppointment] = useState(null);

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

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Update appointment payment status in backend
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-payment-status`,
        {
          appointmentId: payingAppointment._id,
          paymentIntentId: paymentIntent.id,
        },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Payment successful! Appointment is now confirmed.");
        setPayingAppointment(null);
        getUserAppointments(); // Refresh the list to show updated status
      } else {
        toast.error(
          "Payment successful but failed to update appointment status",
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error(
        "Payment successful but there was an error updating your appointment",
      );
    }
  };

  const initiatePayment = (appointment) => {
    setPayingAppointment(appointment);
  };

  // Check URL for payment success when component loads
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const appointmentId = urlParams.get("appointment_id");

    if (sessionId && appointmentId) {
      // Update payment status in backend
      const updatePaymentStatus = async () => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/update-payment-status",
            { appointmentId, paymentIntentId: sessionId },
            { headers: { token } },
          );

          if (data.success) {
            toast.success(
              "Payment completed successfully! Waiting for doctor confirmation.",
            );
            getUserAppointments(); // Refresh appointments to show updated status
          } else {
            toast.error(
              "Payment successful but failed to update appointment status",
            );
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
          toast.error(
            "Payment successful but there was an error updating your appointment",
          );
        }
      };

      updatePaymentStatus();

      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [token, backendUrl, getUserAppointments]);

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token, getUserAppointments]);

  const getAppointmentStatus = (appointment) => {
    if (appointment.cancelled) return "cancelled";
    if (appointment.isCompleted) return "confirmed";
    if (appointment.payment) return "awaiting-confirmation";
    return "payment-pending";
  };

  const getPaymentBadge = (appointment) => {
    const isPaid = !!appointment.payment;
    const style = isPaid
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
    const label = isPaid ? "Paid" : "Pending";

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => {
          const status = getAppointmentStatus(item);

          return (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 h-32 object-cover bg-indigo-50 rounded"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-xs text-neutral-700 font-medium">
                    Date & Time:
                  </span>
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
                <div className="mt-2">{getPaymentBadge(item)}</div>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {status === "payment-pending" && (
                  <button
                    onClick={() => initiatePayment(item)}
                    className="text-xs text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}

                {status === "payment-pending" && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-xs text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}

                {status === "awaiting-confirmation" && (
                  <button className="sm:min-w-48 py-2 border border-yellow-500 rounded text-yellow-600">
                    Waiting for Doctor Confirmation
                  </button>
                )}

                {status === "confirmed" && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Appointment Confirmed
                  </span>
                )}

                {status === "cancelled" && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Appointment Cancelled
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {payingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Complete Payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Amount: ${payingAppointment.amount}
            </p>
            <StripePaymentForm
              amount={payingAppointment.amount}
              onPaymentSuccess={handlePaymentSuccess}
              appointmentDetails={{
                id: payingAppointment._id,
                doctorId: payingAppointment.docId,
                slotDate: payingAppointment.slotDate,
                slotTime: payingAppointment.slotTime,
              }}
              backendUrl={backendUrl}
              token={token}
            />
            <button
              onClick={() => setPayingAppointment(null)}
              className="mt-4 w-full text-gray-600 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
