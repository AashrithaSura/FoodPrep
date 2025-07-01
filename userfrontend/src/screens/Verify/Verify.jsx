import { useContext, useEffect, useState } from 'react'
import './Verify.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { url } = useContext(StoreContext)

    const verifyPayment = async () => {
        try {
            if (!orderId) {
                throw new Error("Order ID not found")
            }

            const response = await axios.post(url + "/api/order/verify", { 
                success, 
                orderId 
            })

            if (response.data.success) {
                navigate('/myorders', { state: { paymentSuccess: true } })
            } else {
                navigate('/', { state: { paymentCancelled: true } })
            }
        } catch (error) {
            console.error("Verification error:", error)
            setError(error.message)
            navigate('/', { state: { verificationError: true } })
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [success, orderId, url]) // Added dependencies

    if (error) {
        return (
            <div className="verify-error">
                <p>Error verifying payment: {error}</p>
                <button onClick={() => navigate('/')}>Return Home</button>
            </div>
        )
    }

    return <Loader />
}

export default Verify