import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

    const navigate = useNavigate();

    return (

        <div style={styles.container}>

            {/* Sidebar */}

            <div style={styles.sidebar}>

                <h2 style={styles.logo}>
                    SmartCart Admin
                </h2>

                <button
                    style={styles.navButton}
                    onClick={() => navigate("/admin")}
                >
                    Dashboard
                </button>

                <button
                    style={styles.navButton}
                    onClick={() => navigate("/AddProducts")}
                >
                    Add Product
                </button>

                 <button
                    style={styles.navButton}
                    onClick={() => navigate("/ViewAllUsers")}
                >
                    View all Users
                </button>



                <button
                    style={styles.navButton}
                    onClick={() => navigate("/ViewProducts")}
                >
                    View Products
                </button>
                

                 <button
                    style={styles.navButton}
                    onClick={() => navigate("/ViewOrders")}
                >
                    View Orders
                </button>
                
                <button
                    style={styles.navButton}
                    onClick={() => navigate("/login")}
                >
                    Logout
                </button>

            </div>

            {/* Main Content */}

            <div style={styles.main}>

                <h1>
                    Admin Dashboard
                </h1>

                <div style={styles.cardContainer}>

                    <div style={styles.card}>
                        <h2>120</h2>
                        <p>Total Products</p>
                    </div>

                    <div style={styles.card}>
                        <h2>58</h2>
                        <p>Total Orders</p>
                    </div>

                    <div style={styles.card}>
                        <h2>24</h2>
                        <p>Total Users</p>
                    </div>

                </div>

            </div>

        </div>
    );
};

const styles = {

    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
    },

    sidebar: {
        width: "250px",
        backgroundColor: "#111",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    logo: {
        marginBottom: "20px"
    },

    navButton: {
        padding: "12px",
        backgroundColor: "#222",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        textAlign: "left"
    },

    main: {
        flex: 1,
        padding: "30px"
    },

    cardContainer: {
        display: "flex",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap"
    },

    card: {
        width: "220px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        textAlign: "center"
    }
};

export default AdminDashboard;