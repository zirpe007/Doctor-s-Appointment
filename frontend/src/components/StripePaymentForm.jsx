import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const StripePaymentForm = ({ amount, onPaymentSuccess, appointmentDetails, backendUrl, token }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const createCheckoutSession = async () => {
    if (!amount || amount <= 0) {
      toast.error('Invalid payment amount')
      return
    }

    setIsLoading(true)
    setPaymentError('')
    
    try {
      console.log('Creating checkout session with amount:', amount)
      
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-payment`,
        {
          amount: amount, // Send amount in dollars (not cents)
          appointmentDetails
        },
        {
          headers: {
            token,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Checkout session response:', data)

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        const errorMsg = data.message || 'Failed to create checkout session'
        setPaymentError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('Checkout session error details:', error)
      
      // More detailed error logging
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data)
        const serverError = error.response.data?.error || error.response.data?.message || 'Server error'
        setPaymentError(`Backend Error: ${serverError}`)
        toast.error(`Payment setup failed: ${serverError}`)
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request)
        setPaymentError('No response from server. Please check your connection.')
        toast.error('Cannot connect to payment server')
      } else {
        // Other errors
        console.error('Error setting up payment:', error.message)
        setPaymentError(error.message)
        toast.error('Error setting up payment')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await createCheckoutSession()
  }

  // Check for payment success in URL parameters when component loads
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    const paymentStatus = urlParams.get('payment_status')
    
    if (sessionId && paymentStatus === 'success') {
      toast.success('Payment completed successfully!')
      // You can call onPaymentSuccess with the session ID
      if (onPaymentSuccess) {
        onPaymentSuccess({ id: sessionId, status: 'succeeded' })
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Secure Payment</h3>
        <p className="text-blue-700 text-sm">
          You will be redirected to Stripe's secure checkout page to complete your payment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Display */}
        {paymentError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{paymentError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redirecting to Payment...
            </>
          ) : (
            `Pay $${amount}`
          )}
        </button>
      </form>

      <div className="text-xs text-gray-500 text-center">
        <p>Secure payment powered by Stripe</p>
      </div>

      {/* Debug Info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <p>Amount: ${amount}</p>
          <p>Status: {isLoading ? 'Processing...' : 'Ready'}</p>
        </div>
      )}
    </div>
  )
}

export default StripePaymentForm