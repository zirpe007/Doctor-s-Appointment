import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  // Fetch doctor info
  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId)
    setDocInfo(doc)
  }

  // Generate slots
  const getAvailableSlots = async () => {
    setDocSlots([])
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots((prev) => [...prev, timeSlots])
    }
  }

  // ===================
  // BOOK APPOINTMENT
  // ===================
  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please log in to book an appointment')
      return navigate('/login')
    }

    // ✅ NEW: Block unverified doctor
    if (!docInfo.isVerified) {
      return toast.error("Doctor is not verified yet")
    }

    if (!slotTime || !docSlots[slotIndex]) {
      return toast.error('Please select a date and time slot')
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Something went wrong while booking')
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  return (
    docInfo && (
      <div>
        {/* ------- Doctor Details ------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-5">
            
            {/* ✅ Name + Verified */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              {docInfo.isVerified && (
                <img className="w-5" src={assets.verified_icon} alt="verified" />
              )}
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* About */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="info" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            {/* Fees */}
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee{' '}
              <span className="text-gray-600">
                {currencySymbol} {docInfo.fees}
              </span>
            </p>

            {/* ✅ NEW: Certificate */}
            {docInfo.certificate && (
              <div className="mt-3">
                <a
                  href={docInfo.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  📄 View Degree Certificate
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ------- Booking Slots ------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((daySlots, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-full cursor-pointer transition-all
                  ${
                    slotIndex === index
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 text-gray-700'
                  }`}
              >
                <p>{daySlots[0] && daysofWeek[daySlots[0].datetime.getDay()]}</p>
                <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots[slotIndex]?.map((slot, idx) => (
              <p
                key={idx}
                onClick={() => setSlotTime(slot.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  slot.time === slotTime
                    ? 'bg-primary text-white'
                    : 'text-gray-400 border border-gray-300'
                }`}
              >
                {slot.time.toLowerCase()}
              </p>
            ))}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  )
}

export default Appointment