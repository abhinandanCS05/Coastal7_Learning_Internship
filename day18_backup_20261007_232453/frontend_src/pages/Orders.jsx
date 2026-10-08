import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PackageCheck, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function Orders() {
  const queryClient = useQueryClient();
  const ws = useRef(null);

  const {
    data: orders = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    staleTime: 30 * 1000,
  });


  useEffect(() => {
    const token = localStorage.getItem('shopflow_token');

    if (!token) {
      return undefined;
    }

    const proto = location.protocol === 'https:' ? 'wss' : 'ws';

    ws.current = new WebSocket(
      `${proto}://${location.host.replace(':5173', ':8000')}/ws/orders?token=${encodeURIComponent(token)}`
    );

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (!message.order) {
          return;
        }

        queryClient.setQueryData(['orders'], (previous = []) => {
          const exists = previous.some(
            (order) => order.id === message.order.id
          );

          return exists
            ? previous.map((order) =>
                order.id === message.order.id
                  ? message.order
                  : order
              )
            : [message.order, ...previous];
        });
      } catch {
        // Ignore malformed WebSocket messages.
      }
    };

    ws.current.onerror = () => {
      // REST/React Query remains the fallback when WebSocket is unavailable.
    };

    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <main className="py-20 text-center">
        <RefreshCw className="mx-auto mb-3 animate-spin" size={28} />
        <p className="text-slate-500">Loading your ordersÃ¢â‚¬Â¦</p>
      </main>
    );
  }

  return (
    <main className="py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">My Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track every order and its latest admin-updated status in real time.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-xl border p-2.5 disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw
            size={17}
            className={isFetching ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {isError && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.response?.data?.detail ||
            'Unable to load orders.'}
        </div>
      )}

      {!isError && !orders.length && (
        <div className="mt-6 rounded-2xl border p-10 text-center text-slate-500">
          <PackageCheck className="mx-auto mb-3" size={40} />
          <p>No orders yet.</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">Order #{order.id}</p>
                <p className="text-xs text-slate-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  order.status === 'DELIVERED'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {order.items.map((item, index) => (
                <div
                  key={`${item.product_id}-${index}`}
                  className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800"
                >
                  <b>{item.name}</b>
                  <p>
                    Qty {item.quantity} Ã‚Â·
                    {Number(item.unit_price).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <span>
                Payment: <b>{order.payment_method}</b>
              </span>

              <span>
                Payment status: <b>{order.payment_status}</b>
              </span>

              <span className="text-xl font-black sm:text-right">
                {Number(order.total).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              <b>Delivery address</b>

              <p className="mt-1">
                {order.address?.full_name} Ã‚Â· {order.address?.phone}
              </p>

              <p>
                {order.address?.address_line},{' '}
                {order.address?.city},{' '}
                {order.address?.state} -{' '}
                {order.address?.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
