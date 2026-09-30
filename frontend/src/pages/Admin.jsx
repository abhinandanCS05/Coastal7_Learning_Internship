import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  PackageCheck,
  RefreshCw,
  Truck,
  User,
} from "lucide-react";

import api from "../services/api";


const STATUS_FLOW = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];


export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");


  async function loadOrders() {
    try {
      setError("");

      const response = await api.get("/admin/orders");

      setOrders(response.data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Unable to load orders",
      );
    }
  }


  async function updateStatus(orderId, status) {
    try {
      setUpdating(orderId);
      setError("");

      await api.patch(
        `/admin/orders/${orderId}/status`,
        null,
        {
          params: {
            status,
          },
        },
      );

      await loadOrders();

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Unable to update order status",
      );
    } finally {
      setUpdating(null);
    }
  }


  useEffect(() => {
    loadOrders();

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const websocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/admin?token=${encodeURIComponent(token)}`,
    );


    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      setEvents((previous) => [
        message,
        ...previous,
      ]);

      loadOrders();
    };


    websocket.onerror = () => {
      console.log(
        "Admin WebSocket connection error",
      );
    };


    return () => {
      websocket.close();
    };
  }, []);


  function getNextStatus(status) {
    const index = STATUS_FLOW.indexOf(status);

    if (
      index === -1 ||
      index === STATUS_FLOW.length - 1
    ) {
      return null;
    }

    return STATUS_FLOW[index + 1];
  }


  function statusColor(status) {
    if (status === "PLACED") {
      return "bg-slate-100 text-slate-700";
    }

    if (status === "PROCESSING") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "SHIPPED") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "DELIVERED") {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
  }


  return (
    <div className="space-y-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 to-indigo-950 p-8 text-white">

        <p className="font-bold text-indigo-300">
          ADMIN CENTER
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Order command center
        </h1>

        <p className="mt-2 text-slate-300">
          Manage customer orders and update delivery
          status in real time.
        </p>

      </section>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}


      {/* ================================================== */}
      {/* SUMMARY */}
      {/* ================================================== */}

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-3xl border bg-white p-6">

          <PackageCheck className="text-emerald-500" />

          <p className="mt-5 text-sm text-slate-500">
            Total Orders
          </p>

          <b className="text-4xl">
            {orders.length}
          </b>

        </div>


        <div className="rounded-3xl border bg-white p-6">

          <Bell className="text-amber-500" />

          <p className="mt-5 text-sm text-slate-500">
            Live Notifications
          </p>

          <b className="text-4xl">
            {events.length}
          </b>

        </div>

      </div>


      {/* ================================================== */}
      {/* ORDER MANAGEMENT */}
      {/* ================================================== */}

      <section className="rounded-3xl border bg-white p-5">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-black">
              Customer Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View customer details, products and
              manage order status.
            </p>
          </div>


          <button
            onClick={loadOrders}
            className="rounded-xl border p-3 transition hover:bg-slate-50"
            title="Refresh orders"
          >
            <RefreshCw size={18} />
          </button>

        </div>


        {/* ================================================== */}
        {/* ORDERS */}
        {/* ================================================== */}

        {orders.length === 0 ? (

          <div className="rounded-2xl bg-slate-50 p-10 text-center">

            <PackageCheck className="mx-auto text-slate-400" />

            <p className="mt-3 font-semibold text-slate-500">
              No customer orders yet.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {orders.map((order) => {

              const nextStatus =
                getNextStatus(order.status);


              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border bg-slate-50"
                >

                  {/* ====================================== */}
                  {/* ORDER HEADER */}
                  {/* ====================================== */}

                  <div className="flex flex-col gap-4 border-b bg-white p-5 md:flex-row md:items-center md:justify-between">

                    <div>

                      <div className="flex items-center gap-3">

                        <h3 className="text-lg font-black">
                          Order #{order.id}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${statusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>

                      </div>


                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">

                        <span className="flex items-center gap-1">
                          <User size={15} />
                          User ID: {order.user_id}
                        </span>

                        <span>
                          {order.user_email}
                        </span>

                      </div>

                    </div>


                    <div className="text-left md:text-right">

                      <p className="text-sm text-slate-500">
                        Order Total
                      </p>

                      <p className="text-2xl font-black">
                        ₹{Number(
                          order.total_amount,
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>


                  {/* ====================================== */}
                  {/* PRODUCTS */}
                  {/* ====================================== */}

                  <div className="p-5">

                    <h4 className="mb-3 font-black">
                      Products
                    </h4>


                    <div className="space-y-3">

                      {order.items.map(
                        (item, index) => (

                          <div
                            key={`${order.id}-${item.product_id}-${index}`}
                            className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row md:items-center md:justify-between"
                          >

                            <div>

                              <p className="font-bold">
                                {item.product_name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Product ID:{" "}
                                {item.product_id}
                              </p>

                            </div>


                            <div className="flex flex-wrap gap-5 text-sm">

                              <span>
                                Qty:{" "}
                                <b>
                                  {item.quantity}
                                </b>
                              </span>

                              <span>
                                Unit:{" "}
                                <b>
                                  ₹{Number(
                                    item.unit_price,
                                  ).toFixed(2)}
                                </b>
                              </span>

                              <span>
                                Subtotal:{" "}
                                <b>
                                  ₹{Number(
                                    item.subtotal,
                                  ).toFixed(2)}
                                </b>
                              </span>

                            </div>

                          </div>

                        ),
                      )}

                    </div>


                    {/* ================================== */}
                    {/* STATUS CONTROL */}
                    {/* ================================== */}

                    <div className="mt-5 rounded-2xl border bg-white p-4">

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                          <p className="font-black">
                            Order Status
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">

                            {STATUS_FLOW.map(
                              (status, index) => {

                                const currentIndex =
                                  STATUS_FLOW.indexOf(
                                    order.status,
                                  );

                                const completed =
                                  index <= currentIndex;

                                return (
                                  <div
                                    key={status}
                                    className="flex items-center gap-2"
                                  >

                                    <div
                                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                                        completed
                                          ? "bg-indigo-100 text-indigo-700"
                                          : "bg-slate-100 text-slate-400"
                                      }`}
                                    >

                                      {completed && (
                                        <CheckCircle2
                                          size={13}
                                        />
                                      )}

                                      {status}

                                    </div>


                                    {index <
                                      STATUS_FLOW.length -
                                        1 && (
                                      <span className="text-slate-300">
                                        →
                                      </span>
                                    )}

                                  </div>
                                );
                              },
                            )}

                          </div>

                        </div>


                        {/* NEXT STATUS BUTTON */}

                        {nextStatus && (

                          <button
                            disabled={
                              updating === order.id
                            }
                            onClick={() =>
                              updateStatus(
                                order.id,
                                nextStatus,
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            {updating === order.id ? (
                              <>
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />

                                Updating...
                              </>
                            ) : (
                              <>
                                {nextStatus ===
                                  "PROCESSING" && (
                                  <PackageCheck
                                    size={16}
                                  />
                                )}

                                {nextStatus ===
                                  "SHIPPED" && (
                                  <Truck
                                    size={16}
                                  />
                                )}

                                {nextStatus ===
                                  "DELIVERED" && (
                                  <CheckCircle2
                                    size={16}
                                  />
                                )}

                                Mark as{" "}
                                {nextStatus}
                              </>
                            )}

                          </button>

                        )}

                        {!nextStatus && (
                          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 font-bold text-emerald-700">
                            <CheckCircle2
                              size={18}
                            />

                            Order Delivered
                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* LIVE NOTIFICATIONS */}
      {/* ================================================== */}

      <section className="rounded-3xl border bg-white p-5">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-black">
              Live Notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Real-time order activity from customers
              and status updates.
            </p>
          </div>

          <Bell className="text-amber-500" />

        </div>


        {events.length === 0 ? (

          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Waiting for customer orders...
          </p>

        ) : (

          <div className="mt-4 space-y-3">

            {events.map((event, index) => (

              <div
                key={`${event.order_id || "event"}-${index}`}
                className="rounded-xl bg-amber-50 p-4 text-sm"
              >

                <Bell className="mr-2 inline text-amber-600" />

                <b>
                  {event.event ===
                  "ORDER_STATUS_UPDATED"
                    ? `Order #${event.order_id}`
                    : ""}
                </b>{" "}

                {event.message}

                {event.user_email && (
                  <span className="ml-2 text-slate-500">
                    ({event.user_email})
                  </span>
                )}

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}