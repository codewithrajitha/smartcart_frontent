import React, { useState, useEffect } from "react";
import axios from "axios";

// Font Injection
if (typeof document !== "undefined") {
  const id = "smartcart-admin-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }
}

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
  const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("https://smartcart-server-7qs4.onrender.com/orderRoutes/all_orders");
      
      const data = response.data.data || response.data;
      setOrders(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filtering Logic
  useEffect(() => {
    let result = orders;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o._id?.toLowerCase().includes(q) ||
          o.shippingDetails?.fullName?.toLowerCase().includes(q) ||
          o.shippingDetails?.city?.toLowerCase().includes(q) ||
          o.shippingDetails?.phone?.includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (paymentFilter !== "ALL") {
      result = result.filter((o) => o.paymentStatus === paymentFilter);
    }

    setFiltered(result);
  }, [search, statusFilter, paymentFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(`https://smartcart-server-7qs4.onrender.com/orderRoutes/update_order_status/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentChange = async (orderId, newPaymentStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(`https://smartcart-server-7qs4.onrender.com/orders/updatePayment/${orderId}`, { paymentStatus: newPaymentStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const processingCnt = orders.filter((o) => o.status === "Processing").length;
  const deliveredCnt = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCnt = orders.filter((o) => o.status === "Cancelled").length;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf8f6" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "50px", height: "50px", border: "4px solid #f0e4e6", borderTopColor: "#c0394b", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <p style={{ marginTop: "20px", color: "#b08090", fontWeight: "600" }}>Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      {/* Banner */}
      <div style={s.banner}>
        <div style={s.bannerContent}>
          <div>
            <p style={s.bannerEyebrow}>SmartCart Admin</p>
            <h1 style={s.bannerTitle}>Order Management</h1>
            <p style={s.bannerSub}>Track and manage all customer orders</p>
          </div>
          <button style={s.refreshBtn} onClick={fetchOrders} disabled={refreshing}>
            ↻ {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div style={s.body}>
        {/* Stats */}
        <div style={s.statsRow}>
          <StatCard label="Total Orders" value={orders.length} icon="📋" accent="#c0394b" />
          <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon="💰" accent="#3d7a6b" sub="from paid orders" />
          <StatCard label="Processing" value={processingCnt} icon="⏳" accent="#a07850" />
          <StatCard label="Delivered" value={deliveredCnt} icon="✅" accent="#3d7a6b" />
          <StatCard label="Cancelled" value={cancelledCnt} icon="✕" accent="#c0394b" />
        </div>

        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchWrap}>
            <input
              style={s.searchInput}
              placeholder="Search by Order ID, Name, City or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={s.filterGroup}>
            {["ALL", ...ORDER_STATUSES].map((st) => (
              <button
                key={st}
                style={{
                  ...s.filterBtn,
                  background: statusFilter === st ? "#c0394b" : "transparent",
                  color: statusFilter === st ? "#fff" : "#7a4050",
                }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Filter */}
          <div style={s.filterGroup}>
            {["ALL", ...PAYMENT_STATUSES].map((ps) => (
              <button
                key={ps}
                style={{
                  ...s.filterBtn,
                  background: paymentFilter === ps ? "#3d7a6b" : "transparent",
                  color: paymentFilter === ps ? "#fff" : "#7a4050",
                }}
                onClick={() => setPaymentFilter(ps)}
              >
                {ps}
              </button>
            ))}
          </div>

          <div style={s.resultCount}>
            <strong>{filtered.length}</strong> orders found
          </div>
        </div>

        {/* Table */}
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Order ID</th>
                <th style={s.th}>Customer</th>
                <th style={s.th}>Items</th>
                <th style={s.th}>Total</th>
                <th style={s.th}>Order Status</th>
                <th style={s.th}>Payment</th>
                <th style={s.th}>Method</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={s.emptyCell}>No orders found</td>
                </tr>
              ) : (
                filtered.map((order, idx) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    idx={idx}
                    onStatusChange={handleStatusChange}
                    onPaymentChange={handlePaymentChange}
                    updatingId={updatingId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// Reusable Stat Card
function StatCard({ label, value, icon, accent, sub }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        ...s.statCard,
        borderColor: hover ? accent : "#f0e4e6",
        boxShadow: hover ? `0 10px 30px ${accent}20` : "0 4px 15px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ ...s.statIconWrap, background: accent + "15" }}>{icon}</div>
      <div>
        <p style={s.statLabel}>{label}</p>
        <p style={{ ...s.statValue, color: accent }}>{value}</p>
        {sub && <p style={s.statSub}>{sub}</p>}
      </div>
    </div>
  );
}

// Order Row Component
function OrderRow({ order, idx, onStatusChange, onPaymentChange, updatingId }) {
  const [expanded, setExpanded] = useState(false);
  const [hov, setHov] = useState(false);

  const sc = {
    Processing: { color: "#a07850", bg: "#fdf8f2" },
    Shipped: { color: "#2a5c8a", bg: "#f0f6fc" },
    Delivered: { color: "#3d7a6b", bg: "#f0faf8" },
    Cancelled: { color: "#c0394b", bg: "#fdf2f4" },
  }[order.status] || { color: "#666", bg: "#f5f5f5" };

  return (
    <>
      <tr
        style={{
          background: hov ? "#fdf8f6" : idx % 2 === 0 ? "#fff" : "#fdfaf9",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setExpanded(!expanded)}
      >
        <td style={s.td}>
          <strong>#{order._id?.slice(-8)}</strong><br />
          <small style={{ color: "#999" }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</small>
        </td>
        <td style={s.td}>
          <div>{order.shippingDetails?.fullName}</div>
          <small>{order.shippingDetails?.city}</small>
        </td>
        <td style={s.td}>{order.items?.length} items</td>
        <td style={s.td}><strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong></td>
        <td style={s.td} onClick={(e) => e.stopPropagation()}>
          <select
            style={{ ...s.statusSelect, background: sc.bg, color: sc.color }}
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            disabled={updatingId === order._id}
          >
            {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
        <td style={s.td}>{order.paymentStatus}</td>
        <td style={s.td}>{order.paymentMethod}</td>
        <td style={s.td}>▾</td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan="8" style={s.expandedCell}>
            <h4>Shipping Address</h4>
            <p><strong>{order.shippingDetails?.fullName}</strong></p>
            <p>{order.shippingDetails?.address}</p>
            <p>{order.shippingDetails?.city}, {order.shippingDetails?.zipCode}</p>
            <p>Phone: {order.shippingDetails?.phone}</p>
          </td>
        </tr>
      )}
    </>
  );
}

// Styles Object
const s = {
  root: { fontFamily: "'DM Sans', sans-serif", background: "#fdf8f6", minHeight: "100vh" },
  banner: { background: "linear-gradient(135deg, #3d1a22, #a0293a)", padding: "40px", color: "white" },
  bannerContent: { maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
  bannerEyebrow: { fontSize: "12px", letterSpacing: "2px", opacity: 0.9 },
  bannerTitle: { fontSize: "42px", fontFamily: "'Cormorant Garamond', serif", margin: "8px 0" },
  bannerSub: { opacity: 0.9 },
  refreshBtn: { padding: "12px 24px", background: "white", color: "#a0293a", border: "none", borderRadius: "50px", fontWeight: "bold", cursor: "pointer" },
  body: { maxWidth: "1280px", margin: "0 auto", padding: "30px 20px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" },
  statCard: { background: "white", padding: "20px", borderRadius: "16px", border: "2px solid #f0e4e6", transition: "all 0.3s" },
  statIconWrap: { fontSize: "28px", width: "55px", height: "55px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" },
  statLabel: { fontSize: "12px", color: "#b08090", fontWeight: "600", margin: 0 },
  statValue: { fontSize: "28px", fontWeight: "700", margin: "4px 0" },
  statSub: { fontSize: "12px", color: "#c0a0a8" },
  toolbar: { background: "white", padding: "16px", borderRadius: "16px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "20px", border: "1px solid #f0e4e6" },
  searchWrap: { flex: 1, minWidth: "280px" },
  searchInput: { width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: "50px", fontSize: "14px" },
  filterGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: { padding: "8px 16px", border: "1px solid #ddd", borderRadius: "50px", cursor: "pointer", fontSize: "13px" },
  resultCount: { marginLeft: "auto", fontWeight: "500" },
  tableWrap: { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left", background: "#fdf8f6", fontWeight: "600", color: "#b08090", fontSize: "13px" },
  td: { padding: "16px", borderBottom: "1px solid #f0e4e6" },
  statusSelect: { padding: "6px 12px", borderRadius: "30px", border: "none", fontWeight: "600", cursor: "pointer" },
  expandedCell: { padding: "20px", background: "#fdfaf9" },
  emptyCell: { padding: "60px", textAlign: "center", color: "#999" },
};

export default ViewOrders;