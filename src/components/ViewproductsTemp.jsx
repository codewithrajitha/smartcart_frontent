import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserViewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [addingProductId, setAddingProductId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [searchTerm, setSearchTerm] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get current category from search parameters, default to "All"
    const activeCategory = searchParams.get("category") || "All";

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch Products from Server
    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await axios.get(
                "http://localhost:5000/users/usergetProducts"
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            showToast("Failed to load products. Please try again later.", "error");
        } finally {
            setLoadingProducts(false);
        }
    };

    // Show Custom Toast Notification
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type });
        }, 3000);
    };

    // Add To Cart API Integration
    const addToCart = async (product) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            showToast("Please log in to add products to your bag.", "error");
            return;
        }

        try {
            setAddingProductId(product._id);

            const response = await axios.post(
                "http://localhost:5000/cartRoutes/addtocart",
                {
                    userId,
                    productId: product._id
                }
            );

            showToast(response.data.message || "Added to bag successfully!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            showToast(errorMsg, "error");
        } finally {
            setAddingProductId(null);
        }
    };

    // Handle Category Tab Clicks
    const handleCategoryClick = (category) => {
        if (category === "All") {
            searchParams.delete("category");
        } else {
            searchParams.set("category", category);
        }
        setSearchParams(searchParams);
    };

    // Filter Products based on selected Category and search query
    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category?.toLowerCase() === activeCategory.toLowerCase() ||
            (activeCategory.toLowerCase() === "lips" && product.category?.toLowerCase() === "lipstick");

        const matchesSearch =
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const CATEGORIES_TABS = [
        { label: "All", icon: "✨" },
        { label: "Lips", icon: "💄" },
        { label: "Skincare", icon: "🌿" },
        { label: "Eyes", icon: "👁️" },
        { label: "Foundation", icon: "🌸" }
    ];

    // Determine Dynamic Title Based on Category
    const getHeadingText = () => {
        switch (activeCategory.toLowerCase()) {
            case "lips":
                return "Lipstick & Lips Collection";
            case "skincare":
                return "Premium Skincare Rituals";
            case "eyes":
                return "Exquisite Eye Palettes";
            case "foundation":
                return "Flawless Foundations";
            default:
                return "SmartCart Beauty Collection";
        }
    };

    return (
        <div style={styles.container}>
            {/* Elegant Toast Notification */}
            <div style={{
                ...styles.toast,
                transform: toast.show ? "translateY(0)" : "translateY(150%)",
                opacity: toast.show ? 1 : 0,
                backgroundColor: toast.type === "success" ? "rgba(192, 57, 75, 0.95)" : "rgba(255, 71, 87, 0.95)"
            }}>
                {toast.message}
            </div>

            {/* Top Navigation Row */}
            <div style={styles.topRow}>
                <button
                    onClick={() => navigate("/home")}
                    style={styles.backBtn}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(-4px)";
                        e.currentTarget.style.color = "#a0293a";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.style.color = "#c0394b";
                    }}
                >
                    ← Back to Home
                </button>
            </div>

            {/* Header Section */}
            <div style={styles.headerSection}>
                <h1 style={styles.heading}>{getHeadingText()}</h1>
                <p style={styles.subtitle}>
                    Luxury cruelty-free formulas designed to enhance your natural beauty.
                </p>
            </div>

            {/* Filter and Search Bar */}
            <div style={styles.controlsBar}>
                {/* Search input with focus effects */}
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            style={styles.clearSearchBtn}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Horizontal Category Tabs */}
                <div style={styles.tabContainer}>
                    {CATEGORIES_TABS.map((tab) => {
                        const isActive = activeCategory.toLowerCase() === tab.label.toLowerCase();
                        return (
                            <button
                                key={tab.label}
                                onClick={() => handleCategoryClick(tab.label)}
                                style={{
                                    ...styles.tab,
                                    ...(isActive ? styles.activeTab : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.borderColor = "#c0394b";
                                        e.currentTarget.style.backgroundColor = "#fff0f2";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.borderColor = "#f0e4e6";
                                        e.currentTarget.style.backgroundColor = "#ffffff";
                                    }
                                }}
                            >
                                <span style={{ marginRight: "6px" }}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Products Grid / Loading / Empty States */}
            {loadingProducts ? (
                <div style={styles.loadingSpinner}>
                    <div style={styles.spinnerRing}></div>
                    <p style={{ marginTop: "14px", fontWeight: "600" }}>Curating products for you...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyStateIcon}>✨</div>
                    <h3 style={styles.emptyStateTitle}>No Products Found</h3>
                    <p style={styles.emptyStateText}>
                        We couldn't find any products matching your selection. Try clearing search keywords or selecting a different category.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            handleCategoryClick("All");
                        }}
                        style={styles.resetBtn}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#a0293a"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#c0394b"}
                    >
                        Explore All Products
                    </button>
                </div>
            ) : (
                <div style={styles.productGrid}>
                    {filteredProducts.map((product) => {
                        const isAdding = addingProductId === product._id;
                        return (
                            <div
                                key={product._id}
                                style={styles.card}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-8px)";
                                    e.currentTarget.style.boxShadow = "0px 12px 30px rgba(192, 57, 75, 0.12)";
                                    const img = e.currentTarget.querySelector("img");
                                    if (img) img.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0px 6px 20px rgba(192, 57, 75, 0.04)";
                                    const img = e.currentTarget.querySelector("img");
                                    if (img) img.style.transform = "scale(1)";
                                }}
                            >
                                {/* Product Image */}
                                <div style={styles.imageContainer}>
                                    <img
                                        src={`http://localhost:5000/uploads/${product.image}`}
                                        alt={product.name}
                                        style={styles.image}
                                    />
                                </div>

                                {/* Product Content details */}
                                <div style={styles.content}>
                                    <span style={styles.categoryBadge}>
                                        {product.category}
                                    </span>

                                    <h2 style={styles.name}>{product.name}</h2>

                                    <p style={styles.description}>{product.description}</p>

                                    <div style={styles.bottomRowCard}>
                                        <div style={styles.priceContainer}>
                                            <span style={styles.currencySymbol}>₹</span>
                                            <span style={styles.priceValue}>{product.price}</span>
                                        </div>

                                        <button
                                            style={{
                                                ...styles.button,
                                                opacity: isAdding ? 0.7 : 1,
                                                cursor: isAdding ? "not-allowed" : "pointer",
                                                background: isAdding ? "#a08085" : "#c0394b"
                                            }}
                                            disabled={isAdding}
                                            onClick={() => addToCart(product)}
                                            onMouseEnter={(e) => {
                                                if (!isAdding) e.currentTarget.style.background = "#a0293a";
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isAdding) e.currentTarget.style.background = "#c0394b";
                                            }}
                                        >
                                            {isAdding ? "Adding..." : "Add to Bag"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "40px 24px",
        backgroundColor: "#fdf8f6",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        fontFamily: "'DM Sans', 'Segoe UI', Roboto, sans-serif"
    },

    topRow: {
        maxWidth: "1200px",
        margin: "0 auto 20px auto",
        display: "flex",
        justifyContent: "flex-start"
    },

    backBtn: {
        background: "none",
        border: "none",
        color: "#c0394b",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "transform 0.2s ease, color 0.2s ease",
        padding: "6px 12px",
        borderRadius: "100px",
        backgroundColor: "rgba(192, 57, 75, 0.05)"
    },

    headerSection: {
        textAlign: "center",
        marginBottom: "40px"
    },

    heading: {
        fontSize: "36px",
        fontWeight: "700",
        color: "#1a0a0d",
        marginBottom: "12px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        letterSpacing: "-0.5px"
    },

    subtitle: {
        fontSize: "16px",
        color: "#7a4050",
        maxWidth: "600px",
        margin: "0 auto"
    },

    controlsBar: {
        maxWidth: "1200px",
        margin: "0 auto 48px auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "0 10px"
    },

    searchWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "480px"
    },

    searchIcon: {
        position: "absolute",
        left: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "14px",
        color: "#b08090"
    },

    searchInput: {
        width: "100%",
        padding: "12px 40px 12px 44px",
        borderRadius: "100px",
        border: "1.5px solid #f0e4e6",
        backgroundColor: "#ffffff",
        fontSize: "14.5px",
        color: "#1a0a0d",
        outline: "none",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: "0 2px 8px rgba(192, 57, 75, 0.02)"
    },

    clearSearchBtn: {
        position: "absolute",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#b08090",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "700"
    },

    tabContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px"
    },

    tab: {
        padding: "10px 18px",
        backgroundColor: "#ffffff",
        border: "1.5px solid #f0e4e6",
        borderRadius: "100px",
        color: "#3d1a22",
        fontSize: "13.5px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)"
    },

    activeTab: {
        backgroundColor: "#c0394b",
        borderColor: "#c0394b",
        color: "#ffffff",
        boxShadow: "0 4px 12px rgba(192, 57, 75, 0.25)"
    },

    loadingSpinner: {
        textAlign: "center",
        fontSize: "16px",
        color: "#7a4050",
        marginTop: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    spinnerRing: {
        width: "40px",
        height: "40px",
        border: "3px solid #f0e4e6",
        borderTop: "3px solid #c0394b",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    },

    emptyState: {
        maxWidth: "500px",
        margin: "80px auto",
        textAlign: "center",
        padding: "40px 24px",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        border: "1px solid #f0e4e6",
        boxShadow: "0 8px 30px rgba(192, 57, 75, 0.04)"
    },

    emptyStateIcon: {
        fontSize: "48px",
        marginBottom: "16px"
    },

    emptyStateTitle: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#1a0a0d",
        marginBottom: "10px",
        fontFamily: "'Cormorant Garamond', Georgia, serif"
    },

    emptyStateText: {
        fontSize: "14.5px",
        color: "#7a4050",
        lineHeight: "1.6",
        marginBottom: "24px"
    },

    resetBtn: {
        padding: "12px 28px",
        backgroundColor: "#c0394b",
        color: "#ffffff",
        border: "none",
        borderRadius: "100px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background-color 0.2s ease"
    },

    productGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "28px",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 10px 40px"
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #f0e4e6",
        boxShadow: "0px 6px 20px rgba(192, 57, 75, 0.04)",
        transition: "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },

    imageContainer: {
        width: "100%",
        height: "250px",
        backgroundColor: "#ffffff",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #fdf0f2",
        overflow: "hidden"
    },

    image: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        transition: "transform 0.4s ease"
    },

    content: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    },

    categoryBadge: {
        alignSelf: "flex-start",
        color: "#c0394b",
        backgroundColor: "#fdf2f4",
        fontSize: "11px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "1px",
        padding: "4px 10px",
        borderRadius: "100px",
        marginBottom: "12px"
    },

    name: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#1a0a0d",
        marginBottom: "8px",
        lineHeight: "1.3",
        fontFamily: "'DM Sans', sans-serif"
    },

    description: {
        fontSize: "13.5px",
        color: "#7a4050",
        lineHeight: "1.5",
        marginBottom: "20px",
        flexGrow: 1
    },

    bottomRowCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto"
    },

    priceContainer: {
        display: "flex",
        alignItems: "baseline",
        gap: "2px"
    },

    currencySymbol: {
        color: "#1a0a0d",
        fontSize: "14px",
        fontWeight: "700"
    },

    priceValue: {
        color: "#1a0a0d",
        fontSize: "20px",
        fontWeight: "800",
        fontFamily: "'Cormorant Garamond', Georgia, serif"
    },

    button: {
        padding: "10px 20px",
        color: "white",
        border: "none",
        borderRadius: "100px",
        fontWeight: "700",
        fontSize: "13px",
        letterSpacing: "0.2px",
        transition: "background-color 0.2s ease"
    },

    toast: {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        color: "#fff",
        padding: "16px 28px",
        borderRadius: "12px",
        boxShadow: "0px 10px 30px rgba(192, 57, 75, 0.2)",
        zIndex: 1000,
        fontWeight: "700",
        fontSize: "14.5px",
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease",
        backdropFilter: "blur(8px)",
        pointerEvents: "none"
    }
};

// Add spinning keyframe animation to document styles dynamically
if (typeof document !== "undefined") {
    const styleId = "spinner-animation-style";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

export default UserViewProducts;