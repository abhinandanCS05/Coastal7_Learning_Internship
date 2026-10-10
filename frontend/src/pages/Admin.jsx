import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Package,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock3,
  XCircle,
  UserRound,
  MapPin,
  IndianRupee,
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  ImagePlus,
  Save,
  Power,
} from "lucide-react";
import api, { mediaUrl } from "../services/api";

const STATUS = [
  ["PLACED", "Order Placed", Clock3],
  ["PROCESSING", "Processing", Package],
  ["SHIPPED", "Shipped", Truck],
  ["DELIVERED", "Delivered", CheckCircle],
  ["CANCELLED", "Cancelled", XCircle],
];

const NEXT = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const emptyProduct = {
  name: "",
  description: "",
  category: "Electronics",
  subcategory: "Phones",
  price: "",
  mrp: "",
  stock: 0,
  badge: "",
  offer_text: "",
  rating: 4.2,
  reviews: 0,
  image_url: "",
};

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState(null);
  const [editorImage, setEditorImage] = useState(null);
  const [editorImagePreview, setEditorImagePreview] = useState("");
  const [uploading, setUploading] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvImport, setCsvImport] = useState(null);
  const [csvImportError, setCsvImportError] = useState("");
  const [csvImporting, setCsvImporting] = useState(false);
  const csvInputRef = useRef(null);
  const ws = useRef(null);

  const handleCsvImport = async () => {
    if (!csvFile) {
      setCsvImportError("Choose a CSV file first.");
      return;
    }

    if (!csvFile.name.toLowerCase().endsWith(".csv")) {
      setCsvImportError("Only .csv files are supported.");
      return;
    }

    if (csvFile.size > 10 * 1024 * 1024) {
      setCsvImportError("The CSV file must be 10 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    setCsvImportError("");
    setCsvImporting(true);
    setCsvImport(null);

    try {
      const response = await api.post(
        "/day18/admin/products/import",
        formData
      );

      if (!response.data?.task_id) {
        throw new Error("The server did not return a task ID.");
      }

      setCsvImport({
        ...response.data,
        status: response.data.status || "QUEUED",
        ready: false,
        progress: {
          percent: 0,
          message: response.data.message || "Import queued.",
        },
      });

      setCsvFile(null);
      if (csvInputRef.current) {
        csvInputRef.current.value = "";
      }
    } catch (e) {
      setCsvImportError(
        e.response?.data?.detail ||
          e.message ||
          "Unable to start the CSV import."
      );
    } finally {
      setCsvImporting(false);
    }
  };

  const load = async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/products"),
      ]);

      setOrders(ordersResponse.data);
      setProducts(productsResponse.data.items || []);
      setError("");
    } catch (e) {
      setError(
        e.response?.data?.detail || "Unable to load admin data."
      );
    }
  };

  useEffect(() => {
    load();

    const token = localStorage.getItem("zetA_token");

    if (token) {
      const proto = location.protocol === "https:" ? "wss" : "ws";

      ws.current = new WebSocket(
        `${proto}://${location.host.replace(
          ":5173",
          ":8000"
        )}/ws/admin?token=${encodeURIComponent(token)}`
      );

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.order) {
          setOrders((previous) =>
            message.event === "order_created"
              ? [message.order, ...previous]
              : previous.map((order) =>
                  order.id === message.order.id
                    ? message.order
                    : order
                )
          );
        }
      };
    }

    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    const taskId = csvImport?.task_id;

    if (!taskId || csvImport.ready) {
      return;
    }

    let cancelled = false;
    let timerId;

    const checkStatus = async () => {
      try {
        const response = await api.get(
          `/day18/tasks/${encodeURIComponent(taskId)}`
        );
        const data = response.data;

        if (cancelled) return;

        setCsvImport((current) =>
          current?.task_id === taskId
            ? { ...current, ...data, rows: current.rows }
            : current
        );

        if (!data.ready) {
          timerId = window.setTimeout(checkStatus, 1000);
        } else if (data.status === "SUCCESS") {
          await load();
        }
      } catch (e) {
        if (!cancelled) {
          setCsvImport((current) =>
            current?.task_id === taskId
              ? {
                  ...current,
                  status: "ERROR",
                  ready: true,
                  error:
                    e.response?.data?.detail ||
                    e.message ||
                    "Unable to retrieve import status.",
                }
              : current
          );
        }
      }
    };

    timerId = window.setTimeout(checkStatus, 500);

    return () => {
      cancelled = true;
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [csvImport?.task_id, csvImport?.ready]);

  const updateOrderStatus = async (order, nextStatus) => {
    try {
      const response = await api.patch(
        `/admin/orders/${order.id}/status`,
        { status: nextStatus }
      );

      setOrders((previous) =>
        previous.map((item) =>
          item.id === order.id ? response.data : item
        )
      );
    } catch (e) {
      alert(
        e.response?.data?.detail || "Status update failed"
      );
    }
  };

  const uploadImage = async (product, file) => {
    if (!file) return;

    try {
      setUploading(product.id);

      const formData = new FormData();
      formData.append("file", file);

      await api.post(
        `/admin/products/${product.id}/image`,
        formData
      );

      await load();
    } catch (e) {
      alert(
        e.response?.data?.detail ||
          "Image upload failed"
      );
    } finally {
      setUploading(null);
      setDrag(null);
    }
  };

  const removeImage = async (product) => {
    if (!confirm(`Remove image for "${product.name}"?`)) {
      return;
    }

    try {
      await api.delete(
        `/admin/products/${product.id}/image`
      );

      await load();
    } catch (e) {
      alert(
        e.response?.data?.detail ||
          "Image removal failed"
      );
    }
  };


  const selectEditorImage = (file) => {
    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      alert("Please select a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setEditorImage(file);
    setEditorImagePreview(URL.createObjectURL(file));
  };

  const uploadEditorImage = async (productId) => {
    if (!editorImage || !productId) return null;

    const formData = new FormData();

    formData.append(
      "file",
      editorImage,
      editorImage.name
    );

    const response = await api.post(
      `/admin/products/${productId}/image`,
      formData
    );

    return response.data;
  };

  const saveProduct = async () => {
    if (!editing) return;

    if (!editing.name?.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!editing.category?.trim()) {
      alert("Category is required.");
      return;
    }

    if (!editing.subcategory?.trim()) {
      alert("Subcategory is required.");
      return;
    }

    const price = Number(editing.price);
    const mrp = Number(editing.mrp);
    const stock = Number(editing.stock);
    const rating = Number(editing.rating || 0);
    const reviews = Number(editing.reviews || 0);

    if (!Number.isFinite(price) || price < 0) {
      alert("Enter a valid selling price.");
      return;
    }

    if (!Number.isFinite(mrp) || mrp < 0) {
      alert("Enter a valid MRP.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a valid non-negative integer.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: editing.name.trim(),
        description: editing.description || "",
        category: editing.category.trim(),
        subcategory: editing.subcategory.trim(),
        price,
        mrp,
        stock,
        badge: editing.badge || "",
        offer_text: editing.offer_text || "",
        rating,
        reviews,
      };

      console.log(
        "zetA: Saving product",
        editing.id,
        payload
      );

      let savedProduct;

      if (creating) {
        const response = await api.post(
          "/admin/products",
          payload
        );

        savedProduct = response.data;

        console.log(
          "zetA: Product created",
          savedProduct
        );

        if (editorImage) {
          await uploadEditorImage(savedProduct.id);

          console.log(
            "zetA: New product image uploaded"
          );
        }
      } else {
        const response = await api.put(
          `/admin/products/${editing.id}`,
          payload
        );

        savedProduct = response.data;

        console.log(
          "zetA: Product updated successfully",
          savedProduct
        );

        if (editorImage) {
          const imageResponse =
            await uploadEditorImage(editing.id);

          console.log(
            "zetA: Replacement image uploaded successfully",
            imageResponse
          );
        }
      }

      // Reload database data after every successful save.
      await load();

      setEditing(null);
      setCreating(false);
      setEditorImage(null);
      setEditorImagePreview("");

      alert(
        editorImage
          ? "Product and image updated successfully."
          : "Product updated successfully."
      );

    } catch (e) {
      console.error(
        "zetA PRODUCT SAVE ERROR:",
        e.response?.data || e
      );

      const detail = e.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(
          detail
            .map(
              (item) =>
                item.msg ||
                JSON.stringify(item)
            )
            .join("\n")
        );
      } else {
        alert(
          detail ||
          e.message ||
          "Unable to save product."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const archiveProduct = async (product) => {
    if (
      !confirm(
        `Archive "${product.name}"?\n\nIt will no longer appear in the customer catalogue.`
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/admin/products/${product.id}`
      );

      await load();
    } catch (e) {
      alert(
        e.response?.data?.detail ||
          "Product archive failed"
      );
    }
  };

  const createNewProduct = () => {
    setCreating(true);
    setEditorImage(null);
    setEditorImagePreview("");
    setEditing({
      ...emptyProduct,
    });
  };

  const counts = {
    PLACED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  orders.forEach((order) => {
    counts[order.status] =
      (counts[order.status] || 0) + 1;
  });

  const filteredProducts = products.filter((product) => {
    const query = productSearch.toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.subcategory.toLowerCase().includes(query) ||
      String(product.id).includes(query)
    );
  });

  return (
    <main className="zeta-page zeta-admin zeta-page space-y-8 py-8">
      {/* HEADER */}
      <section className="rounded-3xl bg-gradient-to-br from-[#080b1f] via-indigo-950 to-violet-950 p-7 text-white shadow-2xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
              Operations / Administration
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              zetA Admin Command Center
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage customer orders, catalogue data, pricing,
              stock, product information and media from one
              protected administration workspace.
            </p>
          </div>

          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold backdrop-blur hover:bg-white/15"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ORDER COUNTERS */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {STATUS.map(([status, label, Icon]) => (
          <div
            key={status}
            className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <Icon
              size={19}
              className="text-indigo-600"
            />

            <p className="mt-3 text-3xl font-black">
              {counts[status]}
            </p>

            <p className="text-xs font-semibold text-slate-500">
              {label}
            </p>
          </div>
        ))}
      </section>

      {/* ORDERS */}
      <section className="overflow-hidden rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b p-5">
          <h2 className="text-xl font-black">
            Live Order Command Center
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            New customer orders appear here automatically.
            Only administrators can change order status.
          </p>
        </div>

        {!orders.length ? (
          <div className="p-10 text-center text-slate-500">
            No orders received yet.
          </div>
        ) : (
          <div className="divide-y dark:divide-slate-800">
            {orders.map((order) => (
              <article
                key={order.id}
                className="p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black dark:bg-slate-800">
                        #{order.id}
                      </span>

                      <h3 className="font-black">
                        {order.customer?.full_name ||
                          order.address?.full_name ||
                          "Customer"}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.customer?.email} ? Customer ID #
                      {order.customer?.id} ?{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr_280px]">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <h4 className="flex items-center gap-2 text-sm font-black">
                      <Package size={16} />
                      Products
                    </h4>

                    {order.items.map(
                      (item, index) => (
                        <div
                          key={`${item.product_id}-${index}`}
                          className="mt-3 flex justify-between gap-3 text-sm"
                        >
                          <span>
                            {item.name}{" "}
                            <span className="text-slate-500">
                              ? {item.quantity}
                            </span>
                          </span>

                          <b>
                            
                            {Number(
                              item.line_total
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </b>
                        </div>
                      )
                    )}

                    <div className="mt-3 border-t pt-3 text-xs text-slate-500">
                      Subtotal 
                      {Number(
                        order.subtotal
                      ).toLocaleString("en-IN")}{" "}
                      ? Discount 
                      {Number(
                        order.discount
                      ).toLocaleString("en-IN")}{" "}
                      ? Shipping 
                      {Number(
                        order.shipping
                      ).toLocaleString("en-IN")}
                    </div>

                    <div className="mt-2 flex justify-between font-black">
                      <span>Total</span>

                      <span>
                        
                        {Number(
                          order.total
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
                    <h4 className="flex items-center gap-2 font-black">
                      <UserRound size={16} />
                      Customer & Delivery
                    </h4>

                    <p className="mt-3 font-bold">
                      {order.customer?.full_name}
                    </p>

                    <p>{order.customer?.email}</p>
                    <p>{order.customer?.phone}</p>

                    <div className="mt-3 flex gap-2">
                      <MapPin
                        size={16}
                        className="shrink-0 text-indigo-600"
                      />

                      <span>
                        {order.address?.address_line},{" "}
                        {order.address?.city},{" "}
                        {order.address?.state} -{" "}
                        {order.address?.pincode}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
                    <h4 className="flex items-center gap-2 font-black">
                      <IndianRupee size={16} />
                      Payment & Status
                    </h4>

                    <p className="mt-3">
                      Method:{" "}
                      <b>{order.payment_method}</b>
                    </p>

                    <p>
                      Payment:{" "}
                      <b>{order.payment_status}</b>
                    </p>

                    <div className="mt-3 space-y-2">
                      {NEXT[order.status].map(
                        (nextStatus) => (
                          <button
                            key={nextStatus}
                            onClick={() =>
                              updateOrderStatus(
                                order,
                                nextStatus
                              )
                            }
                            className={`w-full rounded-lg px-3 py-2 text-xs font-black ${
                              nextStatus ===
                              "CANCELLED"
                                ? "border border-red-200 text-red-600"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            {nextStatus ===
                            "CANCELLED"
                              ? "Cancel Order"
                              : `Move to ${nextStatus}`}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* BULK CSV PRODUCT IMPORT */}
      <section className="rounded-2xl border border-dashed border-indigo-300 bg-white p-5 shadow-sm dark:border-indigo-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Upload size={21} className="text-indigo-600" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Bulk Product Import
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Upload a CSV catalogue and process it in the background with
              Celery. Maximum file size: 10 MB.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Background processing
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            disabled={csvImporting || Boolean(csvImport && !csvImport.ready)}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setCsvImportError("");

              if (file && !file.name.toLowerCase().endsWith(".csv")) {
                setCsvFile(null);
                setCsvImportError("Please select a .csv file.");
                event.target.value = "";
                return;
              }

              if (file && file.size > 10 * 1024 * 1024) {
                setCsvFile(null);
                setCsvImportError("The CSV file must be 10 MB or smaller.");
                event.target.value = "";
                return;
              }

              setCsvFile(file);
            }}
            className="block w-full min-w-0 flex-1 rounded-xl border border-slate-200 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-semibold file:text-indigo-700 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            type="button"
            onClick={handleCsvImport}
            disabled={
              !csvFile ||
              csvImporting ||
              Boolean(csvImport && !csvImport.ready)
            }
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={17} />
            {csvImporting
              ? "Uploading..."
              : csvImport && !csvImport.ready
                ? "Import in progress..."
                : "Import CSV"}
          </button>
        </div>

        {csvFile && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Selected: {csvFile.name} (
            {(csvFile.size / 1024).toFixed(1)} KB)
          </p>
        )}

        {csvImportError && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {csvImportError}
          </div>
        )}

        {csvImport && (
          <div className="mt-5 space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Import status: {csvImport.status}
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {csvImport.ready && csvImport.status === "SUCCESS"
                  ? 100
                  : Math.max(
                      0,
                      Math.min(100, csvImport.progress?.percent ?? 0)
                    )}%
              </span>
            </div>

            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
              role="progressbar"
              aria-label="CSV import progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                csvImport.ready && csvImport.status === "SUCCESS"
                  ? 100
                  : Math.max(
                      0,
                      Math.min(100, csvImport.progress?.percent ?? 0)
                    )
              }
            >
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${
                    csvImport.ready && csvImport.status === "SUCCESS"
                      ? 100
                      : Math.max(
                          0,
                          Math.min(100, csvImport.progress?.percent ?? 0)
                        )
                  }%`,
                }}
              />
            </div>

            {csvImport.progress?.message && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {csvImport.progress.message}
              </p>
            )}

            {csvImport.status === "SUCCESS" && csvImport.ready && (
              <div
                role="status"
                className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <strong>Import completed successfully.</strong>
                {" "}The product catalogue has been refreshed.
              </div>
            )}

            {csvImport.ready &&
              csvImport.status !== "SUCCESS" && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                >
                  <strong>Import did not complete successfully.</strong>
                  {csvImport.error && (
                    <p className="mt-1 break-words">{csvImport.error}</p>
                  )}
                </div>
              )}

            <p className="break-all text-xs text-slate-400">
              Task ID: {csvImport.task_id}
            </p>
          </div>
        )}
      </section>

      {/* PRODUCT MANAGEMENT */}
      <section className="overflow-hidden rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
          <div>
            <h2 className="text-xl font-black">
              Product Management
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Full catalogue control ? pricing, stock,
              descriptions, status and images.
            </p>
          </div>

          <button
            onClick={createNewProduct}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-black text-white hover:bg-indigo-700"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>

        {/* SEARCH */}
        <div className="border-b p-5">
          <div className="relative max-w-xl">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={productSearch}
              onChange={(e) =>
                setProductSearch(e.target.value)
              }
              placeholder="Search by product name, category or ID..."
              className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800">
              <tr>
                <th className="px-5 py-4">
                  Product
                </th>
                <th className="px-5 py-4">
                  Category
                </th>
                <th className="px-5 py-4">
                  Price
                </th>
                <th className="px-5 py-4">
                  MRP
                </th>
                <th className="px-5 py-4">
                  Stock
                </th>
                <th className="px-5 py-4">
                  Status
                </th>
                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-slate-800">
              {filteredProducts.map(
                (product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.image_url ||
                            "https://images.unsplash.com/photo-1560393464-5c69a73c3e4b?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />

                        <div>
                          <p className="font-bold">
                            {product.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            #{product.id} ?{" "}
                            {product.subcategory}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-black">
                      
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      
                      {Number(
                        product.mrp
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`font-black ${
                          product.stock < 10
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Active
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setCreating(false);
                            setEditorImage(null);
                            setEditorImagePreview("");
                            setEditing({
                              ...product,
                            });
                          }}
                          title="Edit product"
                          className="rounded-lg border p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            archiveProduct(product)
                          }
                          title="Archive product"
                          className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* IMAGE MANAGER */}
      <section className="overflow-hidden rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b p-5">
          <h2 className="text-xl font-black">
            Product Image Manager
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Admin-only drag-and-drop image upload and removal.
            Supported formats: JPG, PNG and WebP.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product) => (
            <div
              key={product.id}
              onDragOver={(event) => {
                event.preventDefault();
                setDrag(product.id);
              }}
              onDragLeave={() =>
                setDrag(null)
              }
              onDrop={(event) => {
                event.preventDefault();
                uploadImage(
                  product,
                  event.dataTransfer.files[0]
                );
              }}
              className={`rounded-2xl border p-3 ${
                drag === product.id
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                  : ""
              }`}
            >
              <div className="relative">
                {product.image_url ? (
                  <img
                    src={`${mediaUrl(product.image_url)}?v=${encodeURIComponent(product.image_url)}`}
                    alt={product.name}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <ImagePlus
                      size={32}
                      className="text-slate-400"
                    />
                  </div>
                )}

                {uploading === product.id && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 text-xs font-bold text-white">
                    Uploading...
                  </div>
                )}
              </div>

              <p className="mt-2 truncate text-sm font-bold">
                #{product.id} ? {product.name}
              </p>

              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                <Upload size={14} />
                Upload / Drop

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    uploadImage(
                      product,
                      event.target.files?.[0]
                    )
                  }
                />
              </label>

              {product.image_url && (
                <button
                  onClick={() =>
                    removeImage(product)
                  }
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Remove Image
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  {creating
                    ? "Catalogue"
                    : `Product #${editing.id}`}
                </p>

                <h2 className="text-2xl font-black">
                  {creating
                    ? "Create Product"
                    : "Edit Product"}
                </h2>
              </div>

              <button
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                  setEditorImage(null);
                  setEditorImagePreview("");
                }}
                className="rounded-xl border p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pt-6">
              <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900 dark:bg-indigo-950/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">
                      Product Image
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WebP ? Maximum 5 MB
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700">
                    <Upload size={15} />
                    Choose File

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) =>
                        selectEditorImage(
                          event.target.files?.[0]
                        )
                      }
                    />
                  </label>
                </div>

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    selectEditorImage(
                      event.dataTransfer.files?.[0]
                    );
                  }}
                  className="mt-4 flex min-h-48 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4 transition hover:border-indigo-500 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-950"
                  onClick={() =>
                    document
                      .getElementById("zetA-editor-image")
                      ?.click()
                  }
                >
                  <input
                    id="zetA-editor-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) =>
                      selectEditorImage(
                        event.target.files?.[0]
                      )
                    }
                  />

                  {editorImagePreview ? (
                    <div className="w-full">
                      <img
                        src={editorImagePreview}
                        alt="Selected product"
                        className="mx-auto max-h-56 rounded-xl object-contain"
                      />

                      <p className="mt-3 text-center text-xs font-bold text-indigo-600">
                        {editorImage?.name}
                      </p>
                    </div>
                  ) : editing.image_url ? (
                    <div className="w-full text-center">
                      <img
                        src={`${mediaUrl(editing.image_url)}?v=${encodeURIComponent(editing.image_url)}`}
                        alt={editing.name}
                        className="mx-auto max-h-56 rounded-xl object-contain"
                      />

                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Current image ? Drop a new image to replace it
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImagePlus
                        size={42}
                        className="mx-auto text-indigo-400"
                      />

                      <p className="mt-3 font-black">
                        Drag & Drop image here
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        or click to choose a file
                      </p>
                    </div>
                  )}
                </div>

                {editorImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditorImage(null);
                      setEditorImagePreview("");
                    }}
                    className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600"
                  >
                    <X size={14} />
                    Remove selected image
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-sm font-bold">
                  Product Name
                </span>

                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-sm font-bold">
                  Description
                </span>

                <textarea
                  rows="4"
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Category
                </span>

                <input
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Subcategory
                </span>

                <input
                  value={editing.subcategory}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      subcategory: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Selling Price ()
                </span>

                <input
                  type="number"
                  min="0"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      price: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  MRP ()
                </span>

                <input
                  type="number"
                  min="0"
                  value={editing.mrp}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      mrp: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Stock
                </span>

                <input
                  type="number"
                  min="0"
                  value={editing.stock}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      stock: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Badge
                </span>

                <input
                  value={editing.badge || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      badge: e.target.value,
                    })
                  }
                  placeholder="Limited Stock / Bestseller"
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-sm font-bold">
                  Offer Text
                </span>

                <input
                  value={editing.offer_text || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      offer_text: e.target.value,
                    })
                  }
                  placeholder="Save 500 today"
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Rating
                </span>

                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editing.rating}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      rating: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label>
                <span className="text-sm font-bold">
                  Review Count
                </span>

                <input
                  type="number"
                  min="0"
                  value={editing.reviews}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      reviews: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <button
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                  setEditorImage(null);
                  setEditorImagePreview("");
                }}
                className="rounded-xl border px-5 py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={saveProduct}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                <Save size={17} />
                {saving
                  ? "Saving..."
                  : creating
                  ? "Create Product"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
