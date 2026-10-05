import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, WalletCards } from 'lucide-react';
import api from '../services/api';

export const checkoutSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  address_line: z.string().trim().min(5, 'Address must be at least 5 characters'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
});

const paymentMethods = [
  ['COD', 'Cash on Delivery', 'Pay when delivered'],
  ['UPI', 'UPI', 'Google Pay, PhonePe, BHIM and more'],
  ['NET_BANKING', 'Net Banking', 'Major Indian banks'],
  ['CARD', 'Credit / Debit Card', 'Secure card payment gateway ready'],
];

export default function Checkout() {
  const nav = useNavigate();

  const [cart, setCart] = useState(null);
  const [me, setMe] = useState(null);
  const [offers, setOffers] = useState([]);
  const [method, setMethod] = useState('COD');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      address_line: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    Promise.all([
      api.get('/cart'),
      api.get('/me'),
      api.get('/offers'),
    ])
      .then(([c, m, o]) => {
        setCart(c.data);
        setMe(m.data);
        setOffers(o.data);

        reset({
          full_name: m.data.full_name || '',
          phone: m.data.phone || '',
          address_line: m.data.address_line || '',
          city: m.data.city || '',
          state: m.data.state || '',
          pincode: m.data.pincode || '',
        });
      })
      .finally(() => setLoading(false));
  }, [reset]);

  if (loading || !cart || !me) {
    return <main className="py-20 text-center">Loading checkoutâ€¦</main>;
  }

  const submit = async (address) => {
    try {
      await api.put('/me/address', address);

      await api.post('/orders', {
        payment_method: method,
        address,
      });

      setSaved(true);

      setTimeout(() => {
        nav('/app/orders');
      }, 600);
    } catch (error) {
      alert(error.response?.data?.detail || 'Checkout failed');
    }
  };

  const discount =
    cart.subtotal >= 7999
      ? 500
      : cart.subtotal >= 999
        ? cart.subtotal * 0.1
        : 0;

  const delivery = cart.subtotal >= 499 ? 0 : 49;

  const total = Math.max(
    0,
    cart.subtotal - discount + delivery
  );

  return (
    <main className="py-8">
      <h1 className="text-3xl font-black">Secure Checkout</h1>

      <form
        onSubmit={handleSubmit(submit)}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]"
      >
        <section className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 font-bold">
              <MapPin size={19} className="text-indigo-600" />
              Delivery Address
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              We found your saved address. Edit it below if needed.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['full_name', 'Full name'],
                ['phone', 'Phone'],
                ['address_line', 'Address'],
                ['city', 'City'],
                ['state', 'State'],
                ['pincode', 'PIN code'],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className={
                    name === 'address_line'
                      ? 'sm:col-span-2 text-sm font-semibold'
                      : 'text-sm font-semibold'
                  }
                >
                  {label}

                  <input
                    {...register(name)}
                    className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-950"
                  />

                  {errors[name] && (
                    <span className="mt-1 block text-xs font-medium text-red-600">
                      {errors[name].message}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 font-bold">
              <WalletCards size={19} className="text-indigo-600" />
              Payment Method
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map(([value, label, description]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-4 ${
                    method === value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={method === value}
                    onChange={() => setMethod(value)}
                  />

                  <span className="ml-2 font-semibold">
                    {label}
                  </span>

                  <span className="mt-1 block pl-5 text-xs text-slate-500">
                    {description}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold">Bill Details</h2>

          <div className="mt-4 flex justify-between">
            <span>Subtotal</span>
            <span>{cart.subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="mt-2 flex justify-between text-green-600">
            <span>Offer discount</span>
            <span>
              -
              {discount.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>Delivery</span>
            <span className="text-green-600">
              {delivery === 0
                ? 'FREE'
                : `${delivery}`}
            </span>
          </div>

          <div className="my-4 border-t" />

          <div className="flex justify-between text-xl font-black">
            <span>Total</span>
            <span>

              {total.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle className="mr-2 inline" />
                Order Placed
              </>
            ) : isSubmitting ? (
              'Processing Orderâ€¦'
            ) : (
              `Place Order Â· ${
                method === 'COD' ? 'Pay on Delivery' : method
              }`
            )}
          </button>

          <div className="mt-4">
            {offers.map((offer) => (
              <div
                key={offer.code}
                className="mt-2 rounded-lg bg-green-50 p-2 text-xs text-green-700"
              >
                <b>{offer.code}</b> Â· {offer.description}
              </div>
            ))}
          </div>
        </aside>
      </form>
    </main>
  );
}
