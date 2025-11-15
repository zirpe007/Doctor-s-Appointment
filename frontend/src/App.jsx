import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Myprofile from "./pages/Myprofile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentCancelled from './pages/PaymentCancelled'

// Load Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Doctors" element={<Doctors />} />
          <Route path="/Doctors/:speciality" element={<Doctors />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/my-profile" element={<Myprofile />} />
          <Route path="/my-appointments" element={<MyAppointment />} />
          <Route path="/Appointment/:docId" element={<Appointment />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        </Routes>

        <Footer />
      </div>
    </Elements>
  );
};

export default App;
