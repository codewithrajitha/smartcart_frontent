import React, { useEffect, useState } from "react";
import axios from "axios";

const UserViewCart = ({ onContinueShopping }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Checkout & Modal States
    const [showModal, setShowModal] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState("address"); // 'address' | 'payment' | 'success'
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderId, setOrderId] = useState("");

    // Form Field States
    const [shippingForm, setShippingForm] = useState({
        fullName: "", address: "", city: "", zipCode: "", phone: ""
    });

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [userId]);

    // Fetch Cart Products
    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://smartcart-server-7qs4.onrender.com/cartRoutes/getcartproducts/${userId}`
            );
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
            showToast("Failed to load your cart. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Show Custom Toast Notification
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type });
        }, 3000);
    };

    // Update Quantity
    const updateQuantity = async (cartId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        try {
            setUpdatingId(cartId);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === cartId ? { ...item, quantity: newQty } : item
                )
            );
            showToast("Cart updated!");
        } catch (error) {
            console.error(error);
            showToast("Could not update quantity.", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    // Remove Item
    const removeItem = async (cartId) => {
        try {
            setUpdatingId(cartId);
            setCartItems(prevItems => prevItems.filter(item => item._id !== cartId));
            showToast("Product removed from cart.", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to remove item.", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    // Form Submissions & Step Navigations
    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (!shippingForm.fullName || !shippingForm.address || !shippingForm.city || !shippingForm.zipCode || !shippingForm.phone) {
            showToast("Please fill all shipping fields.", "error");
            return;
        }
        setCheckoutStep("payment");
    };

    // Dynamic Razorpay SDK Script Loader
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (e) => {
        e.preventDefault();

        try {
            setIsPlacingOrder(true);

            // 1. Load Razorpay SDK
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                showToast("Razorpay SDK failed to load. Are you offline?", "error");
                setIsPlacingOrder(false);
                return;
            }

            // 2. Create Razorpay Payment Order on Backend (in paise)
            const rzpOrderResponse = await axios.post(
                "https://smartcart-server-7qs4.onrender.com/orderRoutes/create-payment-order",
                { amount: total }
            );

            const { id: rzpOrderId, amount: rzpAmount, currency: rzpCurrency } = rzpOrderResponse.data;

            // 3. Define Razorpay Checkout Options
            const options = {
                key: "rzp_test_Sv9JlBos82FzYn", // Keep this in your backend or config env files
                amount: rzpAmount,
                currency: rzpCurrency,
                name: "SmartCart Store",
                description: "Complete payment securely using Razorpay",
                image: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png", // Store Logo
                order_id: rzpOrderId,
                handler: async function (response) {
                    try {
                        // This callback executes when payment succeeds
                        const verificationPayload = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            userId,
                            items: cartItems.map(item => ({
                                productId: item.productId._id,
                                quantity: item.quantity,
                                price: item.productId.price
                            })),
                            shippingDetails: shippingForm,
                            totalAmount: total
                        };

                        // Verify signature and store order details in Mongoose Order Schema
                        const verificationResponse = await axios.post(
                            "https://smartcart-server-7qs4.onrender.com/orderRoutes/verify-payment",
                            verificationPayload
                        );

                        if (verificationResponse.data.success) {
                            setOrderId(verificationResponse.data.orderId);
                            setCartItems([]); // Reset local cart
                            setCheckoutStep("success");
                        } else {
                            showToast("Order placement failed signature verification.", "error");
                        }
                    } catch (err) {
                        console.error("Verification failed:", err);
                        showToast("Payment completed but order storage failed. Contact support.", "error");
                    } finally {
                        setIsPlacingOrder(false);
                    }
                },
                prefill: {
                    name: shippingForm.fullName,
                    contact: shippingForm.phone
                },
                notes: {
                    address: shippingForm.address
                },
                theme: {
                    color: "#0f172a" // Premium Midnight theme color to match UI
                },
                modal: {
                    ondismiss: function () {
                        showToast("Payment checkout cancelled.", "error");
                        setIsPlacingOrder(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Razorpay order initiation failed:", error);
            showToast("Failed to initialize secure payment. Try again.", "error");
            setIsPlacingOrder(false);
        }
    };

    // Calculations
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.productId?.price || 0;
        return acc + price * item.quantity;
    }, 0);

    const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Securing your luxury shopping cart...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div style={styles.emptyContainer}>
                <h2 style={styles.emptyTitle}>Please Log In</h2>
                <p style={styles.emptySubtitle}>Log in to access your cart and complete checkout.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={{
                ...styles.toast,
                transform: toast.show ? "translateY(0)" : "translateY(150%)",
                opacity: toast.show ? 1 : 0,
                backgroundColor: toast.type === "success" ? "rgba(5, 150, 105, 0.95)" : "rgba(225, 29, 72, 0.95)"
            }}>
                {toast.message}
            </div>

            <div style={styles.contentWrapper}>
                {/* Main Cart Area */}
                <div style={styles.cartSection}>
                    <div style={styles.headerRow}>
                        <h1 style={styles.title}>Your Cart</h1>
                        <span style={styles.itemCount}>{cartItems.length} items</span>
                    </div>

                    {cartItems.length === 0 && checkoutStep !== "success" ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyCartIcon}>🛒</div>
                            <h2 style={styles.emptyTitle}>Your cart feels light!</h2>
                            <p style={styles.emptySubtitle}>Explore our catalog and add premium beauty and skincare products to your collection.</p>
                            <button
                                id="btn-continue-shopping"
                                style={styles.continueShoppingBtn}
                                onClick={onContinueShopping}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div style={styles.itemsList}>
                            {cartItems.map((item) => {
                                const product = item.productId;
                                if (!product) return null;

                                return (
                                    <div key={item._id} style={styles.card}>
                                        <img
                                            src={`https://smartcart-server-7qs4.onrender.com/uploads/${product.image}`}
                                            alt={product.name}
                                            style={styles.image}
                                        />

                                        <div style={styles.detailsCol}>
                                            <span style={styles.category}>{product.category}</span>
                                            <h3 style={styles.itemName}>{product.name}</h3>
                                            <span style={styles.unitPrice}>₹ {product.price} each</span>
                                        </div>

                                        <div style={styles.actionsCol}>
                                            <div style={styles.quantitySelector}>
                                                <button
                                                    id={`btn-dec-${item._id}`}
                                                    style={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item._id, item.quantity, -1)}
                                                    disabled={updatingId === item._id || item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span style={styles.qtyNumber}>{item.quantity}</span>
                                                <button
                                                    id={`btn-inc-${item._id}`}
                                                    style={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item._id, item.quantity, 1)}
                                                    disabled={updatingId === item._id}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                id={`btn-remove-${item._id}`}
                                                style={styles.deleteBtn}
                                                onClick={() => removeItem(item._id)}
                                                disabled={updatingId === item._id}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div style={styles.priceCol}>
                                            <span style={styles.totalPrice}>₹ {product.price * item.quantity}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Side Summary Panel */}
                {cartItems.length > 0 && (
                    <div style={styles.summarySection}>
                        <h2 style={styles.summaryTitle}>Order Summary</h2>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Subtotal</span>
                            <span style={styles.summaryValue}>₹ {subtotal}</span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Shipping</span>
                            <span style={styles.summaryValue}>
                                {shipping === 0 ? <span style={{ color: "#10b981", fontWeight: "600" }}>FREE</span> : `₹ ${shipping}`}
                            </span>
                        </div>

                        {shipping > 0 && (
                            <p style={styles.shippingNotice}>
                                Spend <strong>₹ {1500 - subtotal}</strong> more to unlock FREE shipping!
                            </p>
                        )}

                        <div style={styles.divider}></div>

                        <div style={{ ...styles.summaryRow, marginBottom: "30px" }}>
                            <span style={styles.totalLabel}>Total</span>
                            <span style={styles.totalValue}>₹ {total}</span>
                        </div>

                        <button
                            id="btn-checkout"
                            style={styles.checkoutBtn}
                            onClick={() => {
                                setCheckoutStep("address");
                                setShowModal(true);
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>

            {/* CHECKOUT MODAL OVERLAY */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContainer}>
                        {/* Header */}
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                {checkoutStep === "address" && "Shipping Details"}
                                {checkoutStep === "payment" && "Razorpay Secured Checkout"}
                                {checkoutStep === "success" && "Order Placed!"}
                            </h2>
                            {checkoutStep !== "success" && (
                                <button
                                    style={styles.closeModalBtn}
                                    onClick={() => setShowModal(false)}
                                    disabled={isPlacingOrder}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Progress Tracker */}
                        {checkoutStep !== "success" && (
                            <div style={styles.trackerRow}>
                                <div style={{ ...styles.trackNode, backgroundColor: "#0f172a", color: "#fff" }}>1</div>
                                <div style={{ ...styles.trackLine, backgroundColor: checkoutStep === "payment" ? "#0f172a" : "#e2e8f0" }}></div>
                                <div style={{
                                    ...styles.trackNode,
                                    backgroundColor: checkoutStep === "payment" ? "#0f172a" : "#f1f5f9",
                                    color: checkoutStep === "payment" ? "#fff" : "#64748b"
                                }}>2</div>
                            </div>
                        )}

                        {/* STEP 1: SHIPPING ADDRESS */}
                        {checkoutStep === "address" && (
                            <form onSubmit={handleAddressSubmit} style={styles.formContainer}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Jane Doe"
                                        style={styles.textInput}
                                        value={shippingForm.fullName}
                                        onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Delivery Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Luxury Avenue, Suite 10"
                                        style={styles.textInput}
                                        value={shippingForm.address}
                                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={styles.formRow}>
                                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                                        <label style={styles.inputLabel}>City</label>
                                        <input
                                            type="text"
                                            placeholder="Mumbai"
                                            style={styles.textInput}
                                            value={shippingForm.city}
                                            onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                                        <label style={styles.inputLabel}>ZIP / Pin Code</label>
                                        <input
                                            type="text"
                                            placeholder="400001"
                                            style={styles.textInput}
                                            value={shippingForm.zipCode}
                                            onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        style={styles.textInput}
                                        value={shippingForm.phone}
                                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" style={styles.modalSubmitBtn}>
                                    Continue to Payment →
                                </button>
                            </form>
                        )}

                        {/* STEP 2: RAZORPAY CONFIRMATION GATEWAY */}
                        {checkoutStep === "payment" && (
                            <div style={styles.formContainer}>

                                {/* HIGH QUALITY SECURED MOCK DETAILS PREVIEW */}
                                <div style={styles.virtualCard}>
                                    <div style={styles.cardHeaderRow}>
                                        <span style={styles.cardLogo}>RAZORPAY SECURED</span>
                                        <span style={styles.chipIcon}></span>
                                    </div>
                                    <div style={styles.cardNumberDisplay}>
                                        PAYMENT METHOD PREVIEW
                                    </div>
                                    <div style={styles.cardFooterRow}>
                                        <div>
                                            <span style={styles.cardLabel}>DELIVER TO</span>
                                            <p style={styles.cardValue}>{shippingForm.fullName.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <span style={styles.cardLabel}>TOTAL VALUE</span>
                                            <p style={styles.cardValue}>₹ {total}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.razorpayInfoBox}>
                                    <p style={styles.razorpayInfoText}>
                                        🛡️ <strong>100% Encrypted Payments.</strong> You will be redirected to the secure Razorpay overlay to complete your transaction with Credit/Debit Cards, UPI, Netbanking, or Wallets.
                                    </p>
                                </div>

                                <button
                                    onClick={handleRazorpayPayment}
                                    style={{
                                        ...styles.modalSubmitBtn,
                                        backgroundColor: isPlacingOrder ? "#64748b" : "#4f46e5", // Indigo theme
                                        cursor: isPlacingOrder ? "not-allowed" : "pointer"
                                    }}
                                    disabled={isPlacingOrder}
                                >
                                    {isPlacingOrder ? "Initializing Secured Gateway..." : `Pay securely with Razorpay · ₹ ${total}`}
                                </button>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS CELEBRATION SCREEN */}
                        {checkoutStep === "success" && (
                            <div style={styles.successWrapper}>
                                <div style={styles.checkmarkCircle}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 13L9 17L19 7" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 style={styles.successTitle}>Order Placed Successfully!</h3>
                                <p style={styles.successSub}>Your payment has been securely processed by Razorpay. Your order will be prepared shortly.</p>

                                <div style={styles.orderInvoiceBox}>
                                    <div style={styles.invoiceLine}>
                                        <span>Order Reference ID</span>
                                        <strong>{orderId}</strong>
                                    </div>
                                    <div style={styles.invoiceLine}>
                                        <span>Total Amount Paid</span>
                                        <strong style={{ color: "#10b981" }}>₹ {total}</strong>
                                    </div>
                                    <div style={styles.invoiceLine}>
                                        <span>Delivery Estimate</span>
                                        <span>3-5 Business Days</span>
                                    </div>
                                </div>

                                <button
                                    style={styles.continueShoppingBtn}
                                    onClick={() => {
                                        setShowModal(false);
                                        onContinueShopping();
                                    }}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "50px 40px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#0f172a"
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        flexWrap: "wrap"
    },
    cartSection: {
        flex: "2",
        minWidth: "320px"
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderBottom: "2px solid #e2e8f0",
        paddingBottom: "15px",
        marginBottom: "30px"
    },
    title: {
        fontSize: "32px",
        fontWeight: "800",
        margin: 0
    },
    itemCount: {
        fontSize: "16px",
        color: "#64748b",
        fontWeight: "600"
    },
    itemsList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    card: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        gap: "20px",
        flexWrap: "wrap"
    },
    image: {
        width: "90px",
        height: "90px",
        objectFit: "contain",
        borderRadius: "10px",
        backgroundColor: "#f8fafc",
        padding: "5px",
        border: "1px solid #f1f5f9"
    },
    detailsCol: {
        flex: 2,
        minWidth: "150px"
    },
    category: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#3b82f6",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    itemName: {
        fontSize: "18px",
        fontWeight: "700",
        margin: "4px 0 8px 0",
        color: "#0f172a"
    },
    unitPrice: {
        fontSize: "14px",
        color: "#64748b"
    },
    actionsCol: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
    },
    quantitySelector: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        overflow: "hidden"
    },
    qtyBtn: {
        backgroundColor: "#f8fafc",
        border: "none",
        width: "32px",
        height: "32px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        transition: "background 0.2s"
    },
    qtyNumber: {
        padding: "0 12px",
        fontWeight: "600",
        fontSize: "14px"
    },
    deleteBtn: {
        border: "none",
        backgroundColor: "transparent",
        color: "#f43f5e",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600"
    },
    priceCol: {
        minWidth: "80px",
        textAlign: "right"
    },
    totalPrice: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a"
    },
    summarySection: {
        flex: "1",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
        height: "fit-content",
        minWidth: "300px"
    },
    summaryTitle: {
        fontSize: "22px",
        fontWeight: "800",
        marginBottom: "24px",
        color: "#0f172a"
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
        fontSize: "15px"
    },
    summaryLabel: {
        color: "#64748b"
    },
    summaryValue: {
        fontWeight: "600",
        color: "#0f172a"
    },
    shippingNotice: {
        fontSize: "12px",
        color: "#b45309",
        backgroundColor: "#fef3c7",
        padding: "10px 14px",
        borderRadius: "8px",
        margin: "10px 0 20px 0",
        lineHeight: "1.4"
    },
    divider: {
        height: "1px",
        backgroundColor: "#e2e8f0",
        margin: "20px 0"
    },
    totalLabel: {
        fontSize: "18px",
        fontWeight: "700"
    },
    totalValue: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a"
    },
    checkoutBtn: {
        width: "100%",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        border: "none",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.2)"
    },
    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
    },
    emptyCartIcon: {
        fontSize: "56px",
        marginBottom: "20px"
    },
    emptyTitle: {
        fontSize: "24px",
        fontWeight: "700",
        marginBottom: "10px",
        color: "#0f172a"
    },
    emptySubtitle: {
        color: "#64748b",
        fontSize: "15px",
        maxWidth: "400px",
        margin: "0 auto 30px auto",
        lineHeight: "1.6"
    },
    continueShoppingBtn: {
        backgroundColor: "#0f172a",
        color: "#ffffff",
        border: "none",
        padding: "14px 28px",
        borderRadius: "10px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "transform 0.2s",
        marginTop: "10px"
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc"
    },
    spinner: {
        width: "48px",
        height: "48px",
        border: "5px solid #cbd5e1",
        borderTop: "5px solid #0f172a",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    },
    loadingText: {
        marginTop: "20px",
        fontSize: "16px",
        color: "#64748b",
        fontWeight: "500"
    },
    toast: {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        color: "#fff",
        padding: "16px 28px",
        borderRadius: "12px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
        zIndex: 1001,
        fontWeight: "600",
        fontSize: "15px",
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease",
        backdropFilter: "blur(8px)",
        pointerEvents: "none"
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px"
    },
    modalContainer: {
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        padding: "32px",
        position: "relative",
        maxHeight: "90vh",
        overflowY: "auto"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    modalTitle: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a",
        margin: 0
    },
    closeModalBtn: {
        border: "none",
        backgroundColor: "#f1f5f9",
        color: "#64748b",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    trackerRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "30px",
        gap: "10px"
    },
    trackNode: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "14px"
    },
    trackLine: {
        height: "2px",
        width: "60px",
        borderRadius: "1px"
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "18px"
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },
    inputLabel: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    textInput: {
        padding: "14px 18px",
        borderRadius: "12px",
        border: "1.5px solid #e2e8f0",
        fontSize: "15px",
        color: "#0f172a",
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.2s"
    },
    formRow: {
        display: "flex",
        gap: "16px"
    },
    modalSubmitBtn: {
        backgroundColor: "#0f172a",
        color: "#fff",
        border: "none",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
    },
    virtualCard: {
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // Slate theme
        borderRadius: "18px",
        padding: "24px",
        color: "#fff",
        boxShadow: "0 10px 20px rgba(15, 23, 42, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "200px",
        marginBottom: "15px",
        position: "relative",
        overflow: "hidden"
    },
    cardHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardLogo: {
        fontWeight: "800",
        fontSize: "14px",
        letterSpacing: "1px",
        color: "#38bdf8"
    },
    chipIcon: {
        width: "38px",
        height: "28px",
        borderRadius: "6px",
        background: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)", // Neon-purple chip style
        boxShadow: "inset 0 1px 3px rgba(255,255,255,0.4)"
    },
    cardNumberDisplay: {
        fontSize: "18px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        textAlign: "center",
        margin: "15px 0",
        color: "#94a3b8"
    },
    cardFooterRow: {
        display: "flex",
        justifyContent: "space-between"
    },
    cardLabel: {
        fontSize: "9px",
        color: "#94a3b8",
        letterSpacing: "1px",
        display: "block",
        marginBottom: "2px"
    },
    cardValue: {
        margin: 0,
        fontSize: "13px",
        fontWeight: "600",
        letterSpacing: "0.5px"
    },
    razorpayInfoBox: {
        backgroundColor: "#e0f2fe",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #bae6fd"
    },
    razorpayInfoText: {
        fontSize: "13px",
        color: "#0369a1",
        lineHeight: "1.6",
        margin: 0
    },
    successWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "20px 0"
    },
    checkmarkCircle: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#d1fae5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px"
    },
    successTitle: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "12px"
    },
    successSub: {
        fontSize: "14px",
        color: "#64748b",
        lineHeight: "1.6",
        maxWidth: "340px",
        margin: "0 auto 24px auto"
    },
    orderInvoiceBox: {
        backgroundColor: "#f8fafc",
        borderRadius: "16px",
        width: "100%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "30px",
        border: "1px solid #f1f5f9"
    },
    invoiceLine: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        color: "#64748b"
    }
};

export default UserViewCart;