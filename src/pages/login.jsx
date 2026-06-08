
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         email: "",
//         password: ""
//     });

//     // Custom Toast feedback instead of blocking alert()
//     const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//     const showToast = (message, type = "success") => {
//         setToast({ show: true, message, type });
//         setTimeout(() => {
//             setToast({ show: false, message: "", type });
//         }, 3000);
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/users/login",
//                 formData
//             );

//             // ==========================================
//             // SUCCESS: Store user ID & Details in LocalStorage
//             // ==========================================
//             const userObj = response.data.user;
//             if (userObj) {
//                 const userId = userObj._id || userObj.id;

//                 // Store userId (crucial for cart, order history, and product catalogs)
//                 localStorage.setItem("userId", userId);

//                 // Store full user metadata block
//                 localStorage.setItem("user", JSON.stringify(userObj));

//                 if (response.data.token) {
//                     localStorage.setItem("token", response.data.token);
//                 }
//             }

//             showToast("Login Successful! Redirecting...", "success");

//             // Role-based navigation
//             const role = userObj?.role;
//             setTimeout(() => {
//                 if (role === "ADMIN") {
//                     navigate("/AdminHome");
//                 } else {
//                     navigate("/home");
//                 }
//             }, 1000);

//         } catch (error) {
//             console.error("Login Failed:", error);
//             const errorMsg = error.response?.data?.message || "Login Failed. Please check your credentials.";
//             showToast(errorMsg, "error");
//         }
//     };

//     return (
//         <div style={styles.container}>
//             {/* Ambient visual background glow orbs */}
//             <div style={styles.bgGlowViolet} />
//             <div style={styles.bgGlowRose} />
//             <div style={styles.bgGridOverlay} />

//             {/* Custom feedback toast overlay */}
//             <div style={{
//                 ...styles.toast,
//                 transform: toast.show ? "translateY(0)" : "translateY(150%)",
//                 opacity: toast.show ? 1 : 0,
//                 backgroundColor: toast.type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)"
//             }}>
//                 {toast.message}
//             </div>

//             <form style={styles.form} onSubmit={handleSubmit}>
//                 <h2 style={styles.title}>Welcome Back</h2>
//                 <p style={styles.subtitle}>Sign in to access your premium shopping experience</p>

//                 <div style={styles.inputWrapper}>
//                     <label style={styles.inputLabel}>Email Address</label>
//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="name@example.com"
//                         value={formData.email}
//                         onChange={handleChange}
//                         style={styles.input}
//                         required
//                     />
//                 </div>

//                 <div style={styles.inputWrapper}>
//                     <label style={styles.inputLabel}>Password</label>
//                     <input
//                         type="password"
//                         name="password"
//                         placeholder="••••••••"
//                         value={formData.password}
//                         onChange={handleChange}
//                         style={styles.input}
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     style={styles.button}
//                     onMouseEnter={e => {
//                         e.currentTarget.style.transform = "translateY(-1px)";
//                         e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
//                     }}
//                     onMouseLeave={e => {
//                         e.currentTarget.style.transform = "translateY(0)";
//                         e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.2)";
//                     }}
//                 >
//                     Sign In
//                 </button>

//                 <div style={styles.dividerRow}>
//                     <span style={styles.dividerLine}></span>
//                     <span style={styles.dividerText}>or</span>
//                     <span style={styles.dividerLine}></span>
//                 </div>

//                 <button
//                     type="button"
//                     style={styles.registerButton}
//                     onMouseEnter={e => {
//                         e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
//                         e.currentTarget.style.borderColor = "#6366f1";
//                         e.currentTarget.style.color = "#a5b4fc";
//                     }}
//                     onMouseLeave={e => {
//                         e.currentTarget.style.background = "transparent";
//                         e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
//                         e.currentTarget.style.color = "#cbd5e1";
//                     }}
//                     onClick={() => navigate("/register")}
//                 >
//                     Create Account
//                 </button>
//             </form>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         backgroundColor: "#030712", // Matching the premium dark background of your Home Page
//         position: "relative",
//         overflow: "hidden",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
//     },

//     // Radial neon glow backgrounds
//     bgGlowViolet: {
//         position: "absolute",
//         top: "-150px",
//         left: "-150px",
//         width: "500px",
//         height: "500px",
//         borderRadius: "50%",
//         background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%)",
//         zIndex: 0,
//         pointerEvents: "none"
//     },
//     bgGlowRose: {
//         position: "absolute",
//         bottom: "-150px",
//         right: "-150px",
//         width: "500px",
//         height: "500px",
//         borderRadius: "50%",
//         background: "radial-gradient(circle, rgba(244, 114, 182, 0.08) 0%, rgba(244, 114, 182, 0) 70%)",
//         zIndex: 0,
//         pointerEvents: "none"
//     },
//     bgGridOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
//         backgroundSize: "32px 32px",
//         zIndex: 0,
//         pointerEvents: "none"
//     },

//     form: {
//         position: "relative",
//         zIndex: 1,
//         width: "400px",
//         padding: "40px",
//         backgroundColor: "rgba(17, 24, 39, 0.75)", // Sleek Dark Glassmorphism
//         borderRadius: "24px",
//         border: "1px solid rgba(255, 255, 255, 0.08)",
//         backdropFilter: "blur(16px)",
//         boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
//         display: "flex",
//         flexDirection: "column",
//         gap: "20px"
//     },

//     title: {
//         fontSize: "28px",
//         fontWeight: "800",
//         color: "#f8fafc",
//         margin: "0 0 4px 0",
//         textAlign: "center",
//         letterSpacing: "-0.5px"
//     },

//     subtitle: {
//         fontSize: "14px",
//         color: "#94a3b8",
//         margin: "0 0 10px 0",
//         textAlign: "center",
//         lineHeight: "1.5"
//     },

//     inputWrapper: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "6px"
//     },

//     inputLabel: {
//         fontSize: "11px",
//         fontWeight: "700",
//         color: "#94a3b8",
//         textTransform: "uppercase",
//         letterSpacing: "0.5px"
//     },

//     input: {
//         width: "100%",
//         padding: "14px 18px",
//         backgroundColor: "rgba(30, 41, 59, 0.5)",
//         border: "1.5px solid rgba(255, 255, 255, 0.08)",
//         borderRadius: "12px",
//         color: "#f8fafc",
//         fontSize: "15px",
//         outline: "none",
//         transition: "all 0.2s ease"
//     },

//     button: {
//         width: "100%",
//         padding: "14px",
//         marginTop: "10px",
//         background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", // Glowing premium gradient
//         color: "white",
//         border: "none",
//         borderRadius: "12px",
//         fontWeight: "700",
//         fontSize: "15px",
//         cursor: "pointer",
//         transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
//         boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
//     },

//     dividerRow: {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "10px",
//         margin: "5px 0"
//     },

//     dividerLine: {
//         flex: 1,
//         height: "1px",
//         backgroundColor: "rgba(255, 255, 255, 0.08)"
//     },

//     dividerText: {
//         color: "#64748b",
//         fontSize: "12px",
//         textTransform: "uppercase",
//         fontWeight: "600"
//     },

//     registerButton: {
//         width: "100%",
//         padding: "13px",
//         backgroundColor: "transparent",
//         color: "#cbd5e1",
//         border: "1px solid rgba(255, 255, 255, 0.1)",
//         borderRadius: "12px",
//         fontWeight: "600",
//         fontSize: "14px",
//         cursor: "pointer",
//         transition: "all 0.2s ease"
//     },

//     // Glassmorphic Custom Toast Notification System
//     toast: {
//         position: "fixed",
//         bottom: "30px",
//         right: "30px",
//         color: "#fff",
//         padding: "16px 28px",
//         borderRadius: "12px",
//         boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
//         zIndex: 1001,
//         fontWeight: "600",
//         fontSize: "15px",
//         transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease",
//         backdropFilter: "blur(8px)",
//         pointerEvents: "none"
//     }
// };

// export default Login;












import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/users/login",
                formData
            );

            const userObj = response.data.user;
            if (userObj) {
                const userId = userObj._id || userObj.id;
                localStorage.setItem("userId", userId);
                localStorage.setItem("user", JSON.stringify(userObj));

                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                }
            }

            showToast("Login Successful! Redirecting...", "success");

            const role = userObj?.role;
            setTimeout(() => {
                if (role === "ADMIN") {
                    navigate("/AdminHome");
                } else {
                    navigate("/home");
                }
            }, 1000);

        } catch (error) {
            console.error("Login Failed:", error);
            const errorMsg = error.response?.data?.message || "Login Failed. Please check your credentials.";
            showToast(errorMsg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInLeft {
                    from { 
                        opacity: 0; 
                        transform: translateX(-40px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }

                @keyframes slideInRight {
                    from { 
                        opacity: 0; 
                        transform: translateX(40px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }

                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes drawLine {
                    from { width: 0; }
                    to { width: 60px; }
                }

                @keyframes pulseGlow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(212, 165, 116, 0.3); 
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(212, 165, 116, 0.5); 
                    }
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .luxury-input:focus {
                    border-color: #d4a574 !important;
                    outline: none;
                }

                .luxury-input:focus + .input-line {
                    width: 100% !important;
                }

                .luxury-btn:not(:disabled):hover {
                    background: #d4a574 !important;
                    color: #1a1a1a !important;
                    letter-spacing: 3px !important;
                }

                .luxury-btn:not(:disabled):hover .btn-arrow {
                    transform: translateX(5px);
                    opacity: 1;
                }

                .ghost-btn:hover {
                    color: #d4a574 !important;
                    border-color: #d4a574 !important;
                }

                .ghost-btn:hover .btn-underline {
                    width: 100% !important;
                }

                .social-btn:hover {
                    border-color: #d4a574 !important;
                    background: rgba(212, 165, 116, 0.05) !important;
                }

                .social-btn:hover .social-icon {
                    color: #d4a574 !important;
                }

                .link:hover {
                    color: #d4a574 !important;
                }

                .link:hover .link-underline {
                    width: 100% !important;
                }
            `}</style>

            {/* Ambient background texture */}
            <div style={styles.bgTexture} />
            <div style={styles.bgGradient} />

            {/* Toast Notification */}
            <div style={{
                ...styles.toast,
                transform: toast.show ? "translateY(0)" : "translateY(-150%)",
                opacity: toast.show ? 1 : 0,
                borderColor: toast.type === "success" ? "#d4a574" : "#c0392b"
            }}>
                <span style={{
                    ...styles.toastIcon,
                    color: toast.type === "success" ? "#d4a574" : "#c0392b"
                }}>
                    {toast.type === "success" ? "✓" : "!"}
                </span>
                <span style={styles.toastMessage}>{toast.message}</span>
            </div>

            {/* Main Layout Container */}
            <div style={styles.layout}>
                {/* Left Panel - Branding */}
                <div style={styles.leftPanel}>
                    <div style={{
                        ...styles.leftContent,
                        animation: "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}>
                        <div style={styles.brandMark}>
                            <div style={styles.brandLogo}>SC</div>
                            <div style={styles.brandDivider}></div>
                            <div style={styles.brandName}>SMARTCART</div>
                        </div>

                        <div style={styles.heroSection}>
                            <h1 style={styles.heroTitle}>
                                Curated<br />
                                <span style={styles.heroAccent}>Luxury</span><br />
                                Awaits
                            </h1>
                            <p style={styles.heroSubtitle}>
                                Experience the finest collection of premium products, 
                                carefully selected for the discerning shopper.
                            </p>
                        </div>

                        <div style={styles.features}>
                            <div style={styles.feature}>
                                <div style={styles.featureIcon}>◆</div>
                                <div>
                                    <div style={styles.featureTitle}>Premium Quality</div>
                                    <div style={styles.featureDesc}>Handpicked selections</div>
                                </div>
                            </div>
                            <div style={styles.feature}>
                                <div style={styles.featureIcon}>◆</div>
                                <div>
                                    <div style={styles.featureTitle}>Exclusive Access</div>
                                    <div style={styles.featureDesc}>Members-only deals</div>
                                </div>
                            </div>
                            <div style={styles.feature}>
                                <div style={styles.featureIcon}>◆</div>
                                <div>
                                    <div style={styles.featureTitle}>Swift Delivery</div>
                                    <div style={styles.featureDesc}>Worldwide shipping</div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.decorativeLine}></div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div style={styles.rightPanel}>
                    <form 
                        style={{
                            ...styles.form,
                            animation: "slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                        onSubmit={handleSubmit}
                    >
                        {/* Form Header */}
                        <div style={styles.formHeader}>
                            <div style={styles.mobileLogo}>SC</div>
                            <h2 style={styles.formTitle}>Welcome Back</h2>
                            <p style={styles.formSubtitle}>Sign in to continue your journey</p>
                            <div style={styles.titleUnderline}></div>
                        </div>

                        {/* Email Field */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>
                                <span style={styles.labelText}>Email Address</span>
                                <span style={styles.requiredStar}>*</span>
                            </label>
                            <div style={styles.inputWrapper}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    className="luxury-input"
                                    style={{
                                        ...styles.input,
                                        borderColor: focusedInput === 'email' ? '#d4a574' : 'rgba(255, 255, 255, 0.1)'
                                    }}
                                    required
                                />
                                <div style={{
                                    ...styles.inputLine,
                                    width: focusedInput === 'email' ? '100%' : '0%',
                                    background: '#d4a574'
                                }} />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>
                                <span style={styles.labelText}>Password</span>
                                <span style={styles.requiredStar}>*</span>
                                <span 
                                    className="link"
                                    style={styles.forgotLink}
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot?
                                    <span className="link-underline" style={styles.linkUnderline}></span>
                                </span>
                            </label>
                            <div style={styles.inputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    className="luxury-input"
                                    style={{
                                        ...styles.input,
                                        borderColor: focusedInput === 'password' ? '#d4a574' : 'rgba(255, 255, 255, 0.1)',
                                        paddingRight: '50px'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    {showPassword ? "◉" : "◎"}
                                </button>
                                <div style={{
                                    ...styles.inputLine,
                                    width: focusedInput === 'password' ? '100%' : '0%',
                                    background: '#d4a574'
                                }} />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div style={styles.rememberRow}>
                            <label style={styles.checkboxLabel}>
                                <input type="checkbox" style={styles.checkbox} />
                                <span style={styles.checkboxText}>Remember me</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="luxury-btn"
                            disabled={isSubmitting}
                            style={{
                                ...styles.submitButton,
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? (
                                <span style={styles.loadingContent}>
                                    <span style={styles.spinner}></span>
                                    <span>Authenticating</span>
                                </span>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="btn-arrow" style={styles.btnArrow}>→</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div style={styles.divider}>
                            <div style={styles.dividerLine}></div>
                            <span style={styles.dividerText}>OR CONTINUE WITH</span>
                            <div style={styles.dividerLine}></div>
                        </div>

                        {/* Social Login */}
                        <div style={styles.socialRow}>
                            <button type="button" className="social-btn" style={styles.socialButton}>
                                <span className="social-icon" style={styles.socialIcon}>G</span>
                                <span>Google</span>
                            </button>
                            <button type="button" className="social-btn" style={styles.socialButton}>
                                <span className="social-icon" style={styles.socialIcon}>f</span>
                                <span>Facebook</span>
                            </button>
                        </div>

                        {/* Register Link */}
                        <div style={styles.registerSection}>
                            <span style={styles.registerText}>New to SmartCart?</span>
                            <button
                                type="button"
                                className="ghost-btn"
                                style={styles.registerButton}
                                onClick={() => navigate("/register")}
                            >
                                Create Account
                                <span className="btn-underline" style={styles.btnUnderline}></span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div style={styles.footer}>
                            <span>Protected by </span>
                            <span style={styles.footerAccent}>SmartCart Security</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        color: "#e8e8e8"
    },

    // Background layers
    bgTexture: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        opacity: 0.03,
        zIndex: 0,
        pointerEvents: "none"
    },
    bgGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse at top left, rgba(212, 165, 116, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 90, 43, 0.06) 0%, transparent 50%)",
        zIndex: 0,
        pointerEvents: "none"
    },

    // Layout
    layout: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        minHeight: "100vh",
        maxWidth: "1400px",
        margin: "0 auto"
    },

    // Left Panel
    leftPanel: {
        flex: "1 1 50%",
        padding: "60px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        position: "relative"
    },
    leftContent: {
        maxWidth: "500px",
        width: "100%"
    },

    // Brand Mark
    brandMark: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "80px"
    },
    brandLogo: {
        width: "50px",
        height: "50px",
        border: "1.5px solid #d4a574",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "20px",
        fontWeight: "600",
        color: "#d4a574",
        letterSpacing: "1px"
    },
    brandDivider: {
        width: "40px",
        height: "1px",
        background: "linear-gradient(90deg, #d4a574, transparent)"
    },
    brandName: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        fontWeight: "500",
        letterSpacing: "4px",
        color: "#d4a574"
    },

    // Hero Section
    heroSection: {
        marginBottom: "60px"
    },
    heroTitle: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "72px",
        fontWeight: "300",
        lineHeight: "1.1",
        margin: "0 0 24px 0",
        color: "#f5f5f5",
        letterSpacing: "-1px"
    },
    heroAccent: {
        fontStyle: "italic",
        color: "#d4a574",
        fontWeight: "400"
    },
    heroSubtitle: {
        fontSize: "15px",
        lineHeight: "1.8",
        color: "#888",
        margin: 0,
        fontWeight: "300",
        maxWidth: "400px"
    },

    // Features
    features: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        marginBottom: "60px"
    },
    feature: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },
    featureIcon: {
        color: "#d4a574",
        fontSize: "10px",
        flexShrink: 0
    },
    featureTitle: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#e8e8e8",
        marginBottom: "4px",
        letterSpacing: "0.5px"
    },
    featureDesc: {
        fontSize: "12px",
        color: "#888",
        fontWeight: "300"
    },

    // Decorative Line
    decorativeLine: {
        width: "60px",
        height: "1px",
        background: "linear-gradient(90deg, #d4a574, transparent)",
        animation: "drawLine 1.5s ease-out 0.5s both"
    },

    // Right Panel
    rightPanel: {
        flex: "1 1 50%",
        padding: "60px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    // Form
    form: {
        width: "100%",
        maxWidth: "420px"
    },
    formHeader: {
        marginBottom: "48px"
    },
    mobileLogo: {
        display: "none",
        width: "40px",
        height: "40px",
        border: "1px solid #d4a574",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "16px",
        color: "#d4a574",
        marginBottom: "24px"
    },
    formTitle: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "42px",
        fontWeight: "400",
        margin: "0 0 12px 0",
        color: "#f5f5f5",
        letterSpacing: "-0.5px"
    },
    formSubtitle: {
        fontSize: "14px",
        color: "#888",
        margin: "0 0 20px 0",
        fontWeight: "300"
    },
    titleUnderline: {
        width: "40px",
        height: "1px",
        background: "#d4a574"
    },

    // Fields
    fieldGroup: {
        marginBottom: "28px"
    },
    fieldLabel: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
    },
    labelText: {
        fontSize: "11px",
        fontWeight: "500",
        letterSpacing: "2px",
        color: "#888",
        textTransform: "uppercase"
    },
    requiredStar: {
        color: "#d4a574",
        marginLeft: "4px"
    },
    forgotLink: {
        fontSize: "11px",
        color: "#888",
        cursor: "pointer",
        position: "relative",
        textDecoration: "none",
        letterSpacing: "1px",
        textTransform: "uppercase",
        transition: "color 0.3s ease"
    },
    linkUnderline: {
        position: "absolute",
        bottom: "-2px",
        left: 0,
        height: "1px",
        width: 0,
        background: "#d4a574",
        transition: "width 0.3s ease"
    },

    inputWrapper: {
        position: "relative"
    },
    input: {
        width: "100%",
        padding: "16px 0",
        backgroundColor: "transparent",
        border: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#f5f5f5",
        fontSize: "15px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "300",
        transition: "border-color 0.3s ease",
        boxSizing: "border-box"
    },
    inputLine: {
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "1px",
        transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
    },
    eyeButton: {
        position: "absolute",
        right: "0",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#888",
        fontSize: "18px",
        cursor: "pointer",
        padding: "8px",
        transition: "color 0.3s ease"
    },

    // Remember Me
    rememberRow: {
        marginBottom: "32px"
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer"
    },
    checkbox: {
        width: "16px",
        height: "16px",
        accentColor: "#d4a574",
        cursor: "pointer"
    },
    checkboxText: {
        fontSize: "13px",
        color: "#888",
        fontWeight: "300"
    },

    // Submit Button
    submitButton: {
        width: "100%",
        padding: "18px",
        backgroundColor: "transparent",
        color: "#d4a574",
        border: "1px solid #d4a574",
        borderRadius: "0",
        fontSize: "12px",
        fontWeight: "500",
        letterSpacing: "3px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        fontFamily: "'Inter', sans-serif",
        marginBottom: "32px"
    },
    btnArrow: {
        transition: "all 0.3s ease",
        opacity: 0.7,
        fontSize: "16px"
    },
    loadingContent: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    spinner: {
        width: "16px",
        height: "16px",
        border: "1.5px solid rgba(212, 165, 116, 0.3)",
        borderTopColor: "#d4a574",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
    },

    // Divider
    divider: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "28px"
    },
    dividerLine: {
        flex: 1,
        height: "1px",
        background: "rgba(255, 255, 255, 0.08)"
    },
    dividerText: {
        fontSize: "10px",
        color: "#666",
        letterSpacing: "2px",
        fontWeight: "500"
    },

    // Social Buttons
    socialRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "32px"
    },
    socialButton: {
        padding: "14px",
        backgroundColor: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "0",
        color: "#e8e8e8",
        fontSize: "12px",
        fontWeight: "500",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontFamily: "'Inter', sans-serif"
    },
    socialIcon: {
        fontSize: "16px",
        fontWeight: "600",
        transition: "color 0.3s ease"
    },

    // Register Section
    registerSection: {
        textAlign: "center",
        marginBottom: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    },
    registerText: {
        fontSize: "13px",
        color: "#888",
        fontWeight: "300"
    },
    registerButton: {
        background: "none",
        border: "none",
        color: "#e8e8e8",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        padding: 0,
        position: "relative",
        transition: "color 0.3s ease",
        fontFamily: "'Inter', sans-serif"
    },
    btnUnderline: {
        position: "absolute",
        bottom: "-2px",
        left: 0,
        height: "1px",
        width: 0,
        background: "#d4a574",
        transition: "width 0.3s ease"
    },

    // Footer
    footer: {
        textAlign: "center",
        fontSize: "11px",
        color: "#666",
        fontWeight: "300",
        letterSpacing: "0.5px"
    },
    footerAccent: {
        color: "#d4a574",
        fontWeight: "500"
    },

    // Toast
    toast: {
        position: "fixed",
        top: "30px",
        right: "30px",
        backgroundColor: "rgba(15, 15, 15, 0.95)",
        border: "1px solid",
        padding: "16px 24px",
        borderRadius: "0",
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
        gap: "14px",
        backdropFilter: "blur(20px)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)"
    },
    toastIcon: {
        fontSize: "18px",
        fontWeight: "600",
        fontFamily: "'Cormorant Garamond', serif"
    },
    toastMessage: {
        fontSize: "13px",
        fontWeight: "400",
        color: "#e8e8e8",
        letterSpacing: "0.5px"
    }
};

export default Login;