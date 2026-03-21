import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../utils/api'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getCart()
      setCart(data)
    } catch (err) {
      setError(err.message || 'Unable to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const total = useMemo(() => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || item.priceAtAddTime || 0), 0)
  }, [cart])

  const placeOrder = async () => {
    try {
      setError('')
      setMessage('')
      if (!shippingAddress.trim()) {
        setError('Please enter shipping address')
        return
      }
      const order = await api.createOrder({ shippingAddress: shippingAddress.trim() })
      await api.createPayment(order._id, { method: paymentMethod })
      setMessage('Order placed successfully')
      setShippingAddress('')
      await fetchCart()
    } catch (err) {
      setError(err.message || 'Unable to place order')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f7f8] px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold text-gray-900">My Cart</h1>
          {loading ? <p className="mt-4">Loading cart...</p> : null}
          {error ? <p className="mt-4 text-red-600">{error}</p> : null}
          {message ? <p className="mt-4 text-emerald-700">{message}</p> : null}

          {!loading && cart?.items?.length === 0 ? (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
              <p>Your cart is empty.</p>
              <Link to="/" className="mt-3 inline-block text-blue-700">Continue shopping</Link>
            </div>
          ) : null}

          {!loading && cart?.items?.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {cart.items.map((item) => (
                <article key={item.product?._id || item.product} className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Price: Rs. {(item.product?.price || item.priceAtAddTime || 0).toLocaleString('en-IN')}</p>
                </article>
              ))}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-semibold">Total: Rs. {total.toLocaleString('en-IN')}</p>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter full shipping address"
                  className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={3}
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="netbanking">Netbanking</option>
                </select>
                <button
                  type="button"
                  onClick={placeOrder}
                  className="mt-3 w-full rounded-lg bg-[#191970] px-4 py-2 text-white"
                >
                  Place Order
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
