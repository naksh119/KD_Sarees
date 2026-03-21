import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import OfferTicker from '../components/OfferTicker'
import Navbar from '../components/Navbar'
import ConfirmPopup from '../components/ConfirmPopup'
import { api } from '../utils/api'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingProductId, setUpdatingProductId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const hasUserSession = Boolean(localStorage.getItem('kd_sarees_token'))

  const fetchCart = async () => {
    if (!hasUserSession) {
      setCart({ items: [] })
      setError('')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await api.getCart()
      setCart(data)
    } catch (err) {
      const errorMessage = err?.message || ''
      const isAuthError = /session expired|login/i.test(errorMessage)
      if (isAuthError) {
        setCart({ items: [] })
        setError('')
      } else {
        setError(errorMessage || 'Unable to load cart')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [hasUserSession])

  const total = useMemo(() => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || item.priceAtAddTime || 0), 0)
  }, [cart])
  const totalItems = useMemo(() => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
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

  const updateItemQuantity = async (productId, nextQuantity) => {
    if (!productId) return
    try {
      setError('')
      setMessage('')
      setUpdatingProductId(productId)
      if (nextQuantity <= 0) {
        const updatedCart = await api.removeCartItem({ productId })
        setCart(updatedCart)
        return
      }
      const updatedCart = await api.updateCartItem({ productId, quantity: nextQuantity })
      setCart(updatedCart)
    } catch (err) {
      setError(err?.message || 'Unable to update quantity')
    } finally {
      setUpdatingProductId('')
    }
  }

  return (
    <>
      <OfferTicker />
      <Navbar hasTopTicker />
      <main className="min-h-screen bg-gradient-to-b from-[#fefbf6] via-[#fff] to-[#f6f8ff] px-4 py-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <section className="relative overflow-hidden rounded-3xl border border-[#c4a77d]/35 bg-gradient-to-r from-[#b8956a] via-[#c4a77d] to-[#d2b78f] p-6 text-[#2c1810] shadow-xl md:p-8">
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#f5d76e]/30 blur-2xl" />
            <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-[#c4a77d]/25 blur-2xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#2c1810]/75">Secure Checkout</p>
                <h1
                  className="mt-2 text-4xl font-normal tracking-wide text-[#2c1810] md:text-5xl"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  My Cart
                </h1>
                <p className="mt-2 max-w-xl text-sm text-[#2c1810]/80 md:text-base">
                  Curated sarees ready for checkout. Confirm your details and place your order quickly.
                </p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-[#2c1810]/20 bg-white/35 px-4 py-3 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-xs text-[#2c1810]/75">Items</p>
                  <p className="text-xl font-semibold text-[#2c1810]">{totalItems}</p>
                </div>
                <div className="h-8 w-px bg-[#2c1810]/25" />
                <div className="text-center">
                  <p className="text-xs text-[#2c1810]/75">Total</p>
                  <p className="text-xl font-semibold text-[#2c1810]">Rs. {total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={`cart-item-skeleton-${index}`}
                    className="rounded-2xl border border-[#c4a77d]/25 bg-white p-4 shadow-sm md:p-5"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 rounded-xl bg-[#f3eadb] animate-pulse md:h-24 md:w-24" />
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="h-5 w-[52%] rounded bg-[#f3eadb] animate-pulse" />
                        <div className="h-4 w-[38%] rounded bg-[#f3eadb] animate-pulse" />
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 rounded-lg bg-[#f7ecd8] px-2 py-1">
                            <div className="h-7 w-7 rounded-md bg-white/80 animate-pulse" />
                            <div className="h-4 w-5 rounded bg-[#eadcc3] animate-pulse" />
                            <div className="h-7 w-7 rounded-md bg-white/80 animate-pulse" />
                          </div>
                          <div className="h-4 w-20 rounded bg-[#f3eadb] animate-pulse" />
                          <div className="h-5 w-16 rounded bg-[#f3eadb] animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-[#c4a77d]/25 bg-white p-5 shadow-sm">
                <div className="h-6 w-40 rounded bg-[#f3eadb] animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 rounded bg-[#f3eadb] animate-pulse" />
                    <div className="h-4 w-24 rounded bg-[#f3eadb] animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 rounded bg-[#f3eadb] animate-pulse" />
                    <div className="h-4 w-12 rounded bg-[#f3eadb] animate-pulse" />
                  </div>
                  <div className="border-t border-dashed border-[#e7dcc7] pt-2">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-24 rounded bg-[#f3eadb] animate-pulse" />
                      <div className="h-5 w-28 rounded bg-[#f3eadb] animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 h-4 w-32 rounded bg-[#f3eadb] animate-pulse" />
                <div className="mt-2 h-24 w-full rounded-xl border border-[#d6c2a1] bg-[#fffcf6] p-3">
                  <div className="h-3 w-full rounded bg-[#f3eadb] animate-pulse" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-[#f3eadb] animate-pulse" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-[#f3eadb] animate-pulse" />
                </div>
                <div className="mt-4 h-4 w-28 rounded bg-[#f3eadb] animate-pulse" />
                <div className="mt-2 h-10 w-full rounded-xl border border-[#d6c2a1] bg-[#fffcf6] px-3 py-2.5">
                  <div className="h-4 w-24 rounded bg-[#f3eadb] animate-pulse" />
                </div>
                <div className="mt-5 h-11 w-full rounded-xl bg-[#c4a77d]/75 animate-pulse" />
              </div>
            </section>
          ) : null}
          {error ? (
            <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">{error}</p>
          ) : null}
          {message ? (
            <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm">{message}</p>
          ) : null}

          {!loading && cart?.items?.length === 0 ? (
            <section className="mt-6 rounded-3xl border border-[#c4a77d]/35 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ecd8] text-2xl">🛍️</div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Your cart is empty</h2>
              <p className="mt-2 text-sm text-slate-600">Explore latest arrivals and add your favorite sarees.</p>
              <Link
                to="/"
                className="mt-5 inline-flex items-center rounded-xl bg-[#c4a77d] px-5 py-2.5 text-sm font-semibold text-[#2c1810] transition hover:bg-[#b8956a]"
              >
                Continue shopping
              </Link>
            </section>
          ) : null}

          {!loading && cart?.items?.length > 0 ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
              <section className="space-y-4">
                {cart.items.map((item) => {
                  const unitPrice = item.product?.price || item.priceAtAddTime || 0
                  const lineTotal = unitPrice * item.quantity
                  const productId = item.product?._id || item.product
                  const productName = item.product?.name || item.productName || 'Product'
                  const productImage = item.product?.images?.[0] || item.productImage || ''
                  const isUpdating = updatingProductId === String(productId)
                  return (
                    <article
                      key={productId}
                      className="rounded-2xl border border-[#c4a77d]/30 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-24 md:w-24">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">🧵</div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-2">
                          <div>
                            <h3 className="line-clamp-2 text-base font-semibold text-slate-900 md:text-lg">{productName}</h3>
                            <p className="mt-1 text-xs uppercase tracking-wide text-[#8b6b46]">Premium handloom collection</p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 rounded-lg bg-[#f7ecd8] px-2 py-1 text-[#2c1810]">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(productId, item.quantity - 1)}
                                disabled={isUpdating}
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-base font-bold leading-none transition hover:bg-[#efe1c8] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="min-w-[1.2rem] text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(productId, item.quantity + 1)}
                                disabled={isUpdating}
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-base font-bold leading-none transition hover:bg-[#efe1c8] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm text-slate-600">
                              Rs. {unitPrice.toLocaleString('en-IN')} x {item.quantity}
                            </p>
                            <p className="text-base font-bold text-[#191970]">Rs. {lineTotal.toLocaleString('en-IN')}</p>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ productId, productName })}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Delete item from cart"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V5h6v2" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </section>

              <aside className="h-fit rounded-3xl border border-[#c4a77d]/35 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-[#2c1810]">Order Summary</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-[#5e4b3a]">
                    <span>Items ({totalItems})</span>
                    <span>Rs. {total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5e4b3a]">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-700">Free</span>
                  </div>
                  <div className="border-t border-dashed border-[#e7dcc7] pt-2">
                    <div className="flex items-center justify-between text-base font-semibold text-[#191970]">
                      <span>Grand Total</span>
                      <span>Rs. {total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <label className="mt-5 block text-sm font-medium text-[#2c1810]">Shipping address</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House no, street, landmark, city, state, pincode"
                  className="mt-2 w-full rounded-xl border border-[#d6c2a1] bg-[#fffcf6] px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#c4a77d] focus:ring-2 focus:ring-[#c4a77d]/30"
                  rows={4}
                />

                <label className="mt-4 block text-sm font-medium text-[#2c1810]">Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#d6c2a1] bg-[#fffcf6] px-3 py-2.5 text-sm outline-none transition focus:border-[#c4a77d] focus:ring-2 focus:ring-[#c4a77d]/30"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="netbanking">Netbanking</option>
                </select>

                <button
                  type="button"
                  onClick={placeOrder}
                  className="mt-5 w-full rounded-xl bg-[#c4a77d] px-4 py-3 text-sm font-semibold text-[#2c1810] transition hover:bg-[#b8956a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2"
                >
                  Place Order Securely
                </button>
              </aside>
            </div>
          ) : null}
        </div>
      </main>
      <ConfirmPopup
        isOpen={Boolean(deleteTarget)}
        title="Remove item from cart?"
        message={
          deleteTarget?.productName
            ? `"${deleteTarget.productName}" will be removed from your cart.`
            : 'This item will be removed from your cart.'
        }
        confirmText="Yes, remove"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteTarget?.productId) {
            updateItemQuantity(deleteTarget.productId, 0)
          }
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
        isDanger
      />
    </>
  )
}
