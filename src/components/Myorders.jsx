import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const UserViewOrders = ({ onGoShopping }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [receiptOrder, setReceiptOrder] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://smartcart-server-7qs4.onrender.com/orderRoutes/user-orders/${userId}`
            );
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            showToast("Failed to load your orders. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 3000);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return { backgroundColor: "#d1fae5", color: "#065f46", text: "Delivered 🟢" };
            case "Shipped":
                return { backgroundColor: "#dbeafe", color: "#1e40af", text: "In Transit 🔵" };
            case "Cancelled":
                return { backgroundColor: "#fee2e2", color: "#991b1b", text: "Cancelled 🔴" };
            default:
                return { backgroundColor: "#fef3c7", color: "#92400e", text: "Processing 🟡" };
        }
    };

    // Tracking Functions
    const openTracking = (order) => setTrackingOrder(order);
    const closeTracking = () => setTrackingOrder(null);

    const copyTrackingId = (trackingId) => {
        navigator.clipboard.writeText(trackingId);
        showToast("Tracking ID copied to clipboard!", "success");
    };

    const getTrackingSteps = (order) => {
        const status = order.status || "Processing";
        const createdDate = new Date(order.createdAt);

        if (status === "Cancelled") {
            return [
                { label: "Order Placed", date: formatDate(order.createdAt), status: "completed" },
                { label: "Order Cancelled", date: formatDate(order.updatedAt || Date.now()), status: "completed" }
            ];
        }

        return [
            { label: "Order Placed", date: formatDate(order.createdAt), status: "completed" },
            { label: "Processing", date: formatDate(new Date(createdDate.getTime() + 86400000 * 1)), status: ["Processing", "Shipped", "Delivered"].includes(status) ? "completed" : "pending" },
            { label: "Shipped", date: formatDate(new Date(createdDate.getTime() + 86400000 * 3)), status: ["Shipped", "Delivered"].includes(status) ? "completed" : "pending" },
            { label: "Out for Delivery", date: formatDate(new Date(createdDate.getTime() + 86400000 * 5)), status: status === "Delivered" ? "completed" : "pending" },
            { label: "Delivered", date: formatDate(new Date(createdDate.getTime() + 86400000 * 6)), status: status === "Delivered" ? "completed" : "pending" }
        ];
    };

    // Final Fixed PDF Download
    const downloadPDF = (order) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        // Header
         doc.setFontSize(22);
        doc.text("SmartCart", pageWidth / 2, y, { align: "center" });
        y += 12;

        doc.setFontSize(18);
        doc.text("Beauty & Skincare Store", pageWidth / 2, y, { align: "center" });
        y += 12;

        doc.setFontSize(16);
        doc.text("Invoice / Receipt", pageWidth / 2, y, { align: "center" });
        y += 18;

        // Order Info
        doc.setFontSize(11);
        doc.text(`Order ID: ${order._id}`, 20, y);
        y += 8;
        doc.text(`Date: ${formatDate(order.createdAt)}`, 20, y);
        y += 8;
        doc.text(`Status: ${order.status || "Processing"}`, 20, y);
        y += 18;

        // Customer Info
        doc.text("Billed To:", 20, y);
        y += 8;
        doc.text("Customer Name", 20, y);
        y += 7;
        doc.text("customer@example.com", 20, y);
        y += 7;
        doc.text("123 Beauty Lane, Mumbai", 20, y);
        y += 18;

        // Items
        doc.setFontSize(13);
        doc.text("Items Purchased", 20, y);
        y += 10;

        doc.setFillColor(15, 23, 42);
        doc.rect(20, y, pageWidth - 40, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("Product", 25, y + 8);
        doc.text("Qty", 115, y + 8);
        doc.text("Price", 145, y + 8);
        doc.text("Amount", 175, y + 8);
        y += 15;

        doc.setTextColor(0);

        order.items.forEach((item) => {
            const product = item.productId;
            if (!product) return;

            const itemTotal = product.price * item.quantity;
            const productName = product.name.length > 28 
                ? product.name.substring(0, 28) + "..." 
                : product.name;

            doc.text(productName, 25, y);
            doc.text(item.quantity.toString(), 118, y);
            doc.text(`Rs. ${product.price}`, 145, y);
            doc.text(`Rs. ${itemTotal}`, 175, y);
            y += 11;
        });

        // Total
        y += 8;
        doc.setLineWidth(0.8);
        doc.line(20, y, pageWidth - 20, y);
        y += 12;

        doc.setFontSize(14);
        doc.text("Total Amount:", 130, y);
        doc.text(`Rs. ${order.totalAmount}`, 175, y);

        // Footer - Fixed (No Emoji)
        y += 25;
        doc.setFontSize(10);
        doc.text("Thank you for shopping with us!", pageWidth / 2, y, { align: "center" });
        y += 8;
        doc.text("This is a computer generated receipt.", pageWidth / 2, y, { align: "center" });

        doc.save(`Invoice_${order._id.slice(-8)}.pdf`);
        showToast("Invoice downloaded successfully!", "success");
    };

    const openReceipt = (order) => setReceiptOrder(order);
    const closeReceipt = () => setReceiptOrder(null);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Fetching your exclusive orders...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div style={styles.emptyContainer}>
                <h2 style={styles.emptyTitle}>Please Log In</h2>
                <p style={styles.emptySubtitle}>Log in to access your dashboard and purchase history.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Toast */}
            <div style={{
                ...styles.toast,
                transform: toast.show ? "translateY(0)" : "translateY(150%)",
                opacity: toast.show ? 1 : 0,
                backgroundColor: toast.type === "success" ? "rgba(5, 150, 105, 0.95)" : "rgba(225, 29, 72, 0.95)"
            }}>
                {toast.message}
            </div>

            <div style={styles.contentWrapper}>
                <div style={styles.headerRow}>
                    <h1 style={styles.title}>Your Purchases</h1>
                    <span style={styles.orderCount}>{orders.length} orders total</span>
                </div>

                {orders.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📦</div>
                        <h2 style={styles.emptyTitle}>No orders placed yet</h2>
                        <p style={styles.emptySubtitle}>Your purchase history is currently empty. Explore our beauty and skincare collection to place your first order!</p>
                        <button style={styles.goShoppingBtn} onClick={onGoShopping}>
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div style={styles.ordersList}>
                        {orders.map((order) => {
                            const statusConfig = getStatusStyle(order.status);
                            return (
                                <div key={order._id} style={styles.orderCard}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.metaCol}>
                                            <span style={styles.metaLabel}>ORDER PLACED</span>
                                            <span style={styles.metaValue}>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div style={styles.metaCol}>
                                            <span style={styles.metaLabel}>ORDER TOTAL</span>
                                            <span style={styles.totalPrice}>₹ {order.totalAmount}</span>
                                        </div>
                                        <div style={styles.metaCol}>
                                            <span style={styles.metaLabel}>ORDER ID</span>
                                            <span style={styles.orderId}>{order._id}</span>
                                        </div>
                                        <div style={styles.statusCol}>
                                            <span style={{ ...styles.statusBadge, ...statusConfig }}>
                                                {statusConfig.text}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={styles.itemsContainer}>
                                        {order.items.map((item, idx) => {
                                            const product = item.productId;
                                            if (!product) return null;
                                            return (
                                                <div key={idx} style={styles.itemRow}>
                                                    <img src={`https://smartcart-server-7qs4.onrender.com/uploads/${product.image}`} alt={product.name} style={styles.itemImage} />
                                                    <div style={styles.itemDetails}>
                                                        <h4 style={styles.itemName}>{product.name}</h4>
                                                        <p style={styles.itemCategory}>{product.category}</p>
                                                        <p style={styles.itemQtyPrice}>
                                                            Qty: <strong>{item.quantity}</strong> · ₹ {product.price} each
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div style={styles.cardFooter}>
                                        <button style={styles.secondaryBtn} onClick={() => openTracking(order)}>
                                            Track Shipment
                                        </button>
                                        <button style={styles.ghostBtn} onClick={() => openReceipt(order)}>
                                            View Receipt 📄
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tracking Modal */}
            {trackingOrder && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0 }}>
                                {trackingOrder.status === "Cancelled" ? "Order Cancelled" : "Track Order"} #{trackingOrder._id.slice(-8)}
                            </h2>
                            <button style={styles.closeBtn} onClick={closeTracking}>✕</button>
                        </div>

                        <div style={styles.trackingInfo}>
                            <div style={styles.trackingRow}>
                                <div>
                                    <strong>Tracking ID</strong>
                                    <div style={styles.trackingId}>
                                        {trackingOrder.trackingId || `TRK${trackingOrder._id.slice(-10).toUpperCase()}`}
                                        <button onClick={() => copyTrackingId(trackingOrder.trackingId || `TRK${trackingOrder._id.slice(-10).toUpperCase()}`)} style={styles.copyBtn}>📋</button>
                                    </div>
                                </div>
                                {trackingOrder.status !== "Cancelled" && (
                                    <div>
                                        <strong>Estimated Delivery</strong>
                                        <div style={{ marginTop: "4px" }}>{formatDate(new Date(Date.now() + 86400000 * 7))}</div>
                                    </div>
                                )}
                            </div>
                            {trackingOrder.status === "Cancelled" && (
                                <div style={styles.cancelMessage}>This order has been cancelled. No further action will be taken.</div>
                            )}
                        </div>

                        <div style={styles.timeline}>
                            {getTrackingSteps(trackingOrder).map((step, index) => (
                                <div key={index} style={styles.timelineItem}>
                                    <div style={{
                                        ...styles.timelineDot,
                                        backgroundColor: step.status === "completed" 
                                            ? (trackingOrder.status === "Cancelled" ? "#ef4444" : "#10b981") 
                                            : "#e2e8f0"
                                    }} />
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineLabel}>{step.label}</div>
                                        <div style={styles.timelineDate}>{step.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.ghostBtn} onClick={closeTracking}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {receiptOrder && (
                <div style={styles.modalOverlay}>
                    <div style={{ ...styles.modalContent, maxWidth: "720px" }}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0 }}>Invoice / Receipt</h2>
                            <button style={styles.closeBtn} onClick={closeReceipt}>✕</button>
                        </div>

                        <div style={styles.receiptBody}>
                            <div style={styles.receiptHeader}>
    <h2>SmartCart</h2>
                                <h5>Beauty & Skincare Store</h5>                                <p>Order ID: <strong>{receiptOrder._id}</strong></p>
                                <p>Date: {formatDate(receiptOrder.createdAt)}</p>
                            </div>

                            <div style={styles.receiptInfo}>
                                <div>
                                    <strong>Billed To:</strong><br />
                                    Customer Name<br />
                                    customer@example.com
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <strong>Status:</strong><br />
                                    <span style={{ ...styles.statusBadge, ...getStatusStyle(receiptOrder.status) }}>
                                        {getStatusStyle(receiptOrder.status).text}
                                    </span>
                                </div>
                            </div>

                            <table style={styles.receiptTable}>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receiptOrder.items.map((item, idx) => {
                                        const product = item.productId;
                                        if (!product) return null;
                                        return (
                                            <tr key={idx}>
                                                <td>{product.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹ {product.price}</td>
                                                <td>₹ {(product.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div style={styles.receiptTotal}>
                                <div><strong>Total Amount</strong></div>
                                <div><strong>₹ {receiptOrder.totalAmount}</strong></div>
                            </div>

                            <div style={styles.receiptFooter}>
                                Thank you for shopping with us! 💖
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.secondaryBtn} onClick={() => downloadPDF(receiptOrder)}>
                                Download PDF
                            </button>
                            <button style={styles.ghostBtn} onClick={closeReceipt}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "50px 40px", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: "#0f172a" },
    contentWrapper: { maxWidth: "900px", margin: "0 auto" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px", marginBottom: "30px" },
    title: { fontSize: "32px", fontWeight: "800", margin: 0 },
    orderCount: { fontSize: "15px", color: "#64748b", fontWeight: "600" },
    ordersList: { display: "flex", flexDirection: "column", gap: "30px" },
    orderCard: { backgroundColor: "#ffffff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
    cardHeader: { backgroundColor: "#f8fafc", padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" },
    metaCol: { display: "flex", flexDirection: "column", gap: "4px" },
    metaLabel: { fontSize: "10px", color: "#64748b", fontWeight: "700", letterSpacing: "0.8px" },
    metaValue: { fontSize: "14px", fontWeight: "600", color: "#1e293b" },
    totalPrice: { fontSize: "15px", fontWeight: "800", color: "#0f172a" },
    orderId: { fontSize: "13px", fontFamily: "monospace", color: "#475569", background: "#e2e8f0", padding: "2px 8px", borderRadius: "6px" },
    statusCol: { display: "flex", alignItems: "center" },
    statusBadge: { padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "700" },
    itemsContainer: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" },
    itemRow: { display: "flex", gap: "20px", alignItems: "center", borderBottom: "1px dashed #f1f5f9", paddingBottom: "15px" },
    itemImage: { width: "70px", height: "70px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", padding: "4px" },
    itemDetails: { flex: 1 },
    itemName: { fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: "#0f172a" },
    itemCategory: { fontSize: "12px", color: "#3b82f6", textTransform: "uppercase", fontWeight: "600", margin: "0 0 6px 0", letterSpacing: "0.5px" },
    itemQtyPrice: { fontSize: "13px", color: "#64748b", margin: 0 },
    cardFooter: { backgroundColor: "#f8fafc", padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "12px" },
    secondaryBtn: { backgroundColor: "#0f172a", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    ghostBtn: { backgroundColor: "transparent", color: "#475569", border: "1px solid #cbd5e1", padding: "9px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    emptyState: { textAlign: "center", padding: "80px 20px", backgroundColor: "#ffffff", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
    emptyIcon: { fontSize: "64px", marginBottom: "24px" },
    goShoppingBtn: { backgroundColor: "#0f172a", color: "#ffffff", border: "none", padding: "14px 28px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
    loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f8fafc" },
    spinner: { width: "48px", height: "48px", border: "5px solid #cbd5e1", borderTop: "5px solid #0f172a", borderRadius: "50%", animation: "spin 1s linear infinite" },
    loadingText: { marginTop: "20px", fontSize: "16px", color: "#64748b", fontWeight: "500" },
    toast: { position: "fixed", bottom: "30px", right: "30px", color: "#fff", padding: "16px 28px", borderRadius: "12px", boxShadow: "0px 10px 30px rgba(0,0,0,0.15)", zIndex: 1001, fontWeight: "600", fontSize: "15px", transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease", backdropFilter: "blur(8px)", pointerEvents: "none" },

    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
    modalContent: { backgroundColor: "#ffffff", borderRadius: "20px", width: "90%", maxWidth: "520px", maxHeight: "92vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)" },
    modalHeader: { padding: "24px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
    closeBtn: { background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#64748b" },
    modalFooter: { padding: "20px 28px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "12px" },

    trackingInfo: { padding: "24px 28px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
    trackingRow: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" },
    trackingId: { fontFamily: "monospace", fontSize: "15px", fontWeight: "700", color: "#0f172a", marginTop: "4px", display: "flex", alignItems: "center", gap: "10px" },
    copyBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer" },
    cancelMessage: { marginTop: "16px", color: "#991b1b", fontWeight: "600", fontSize: "14px" },
    timeline: { padding: "32px 28px" },
    timelineItem: { display: "flex", gap: "16px", marginBottom: "32px", position: "relative" },
    timelineDot: { width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "3px", border: "3px solid white", boxShadow: "0 0 0 3px #e2e8f0" },
    timelineContent: { flex: 1 },
    timelineLabel: { fontWeight: "700", fontSize: "16px", color: "#0f172a" },
    timelineDate: { color: "#64748b", fontSize: "14px", marginTop: "2px" },

    receiptBody: { padding: "28px" },
    receiptHeader: { textAlign: "center", marginBottom: "24px", borderBottom: "2px solid #e2e8f0", paddingBottom: "16px" },
    receiptInfo: { display: "flex", justifyContent: "space-between", marginBottom: "24px" },
    receiptTable: { width: "100%", borderCollapse: "collapse", marginBottom: "24px" },
    receiptTotal: { display: "flex", justifyContent: "space-between", fontSize: "18px", borderTop: "2px solid #e2e8f0", paddingTop: "16px", marginBottom: "20px" },
    receiptFooter: { textAlign: "center", color: "#64748b", fontStyle: "italic", padding: "10px 0" }
};

export default UserViewOrders;