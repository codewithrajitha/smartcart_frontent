import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';



const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const useParallax = () => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return offset;
};

const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const [ref, visible] = useScrollReveal();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};

const products = [
  { id: 1, name: "Wireless Headphones", price: "$129", badge: "Trending", color: "#FF6B35", emoji: "🎧", rating: 4.8, reviews: 2140 },
  { id: 2, name: "Smart Watch Pro", price: "$299", badge: "New", color: "#4ECDC4", emoji: "⌚", rating: 4.9, reviews: 872 },
  { id: 3, name: "Laptop Backpack", price: "$79", badge: "Best Seller", color: "#A855F7", emoji: "🎒", rating: 4.7, reviews: 5320 },
  { id: 4, name: "Mechanical Keyboard", price: "$199", badge: "Hot", color: "#F59E0B", emoji: "⌨️", rating: 4.6, reviews: 1830 },
];

const features = [
  { icon: "⚡", title: "Lightning Delivery", desc: "Same-day shipping on orders before 2PM. Weekend delivery included." },
  { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption. Your payment data is always protected." },
  { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns. No questions asked, full refund." },
  { icon: "🎁", title: "Gift Wrapping", desc: "Free premium gift wrapping on all orders over $50." },
];

const testimonials = [
  { name: "Priya R.", city: "Mumbai", text: "SmartCart changed how I shop online. The delivery was insanely fast and packaging was perfect.", avatar: "PR", color: "#FF6B35" },
  { name: "James T.", city: "London", text: "Best e-commerce experience I've had. The recommendations are spot-on every single time.", avatar: "JT", color: "#4ECDC4" },
  { name: "Aisha K.", city: "Dubai", text: "Love the curated collections! Found things I didn't even know I needed. 10/10 experience.", avatar: "AK", color: "#A855F7" },
];

const stats = [
  { number: "4.2M+", label: "Happy Customers" },
  { number: "180+", label: "Countries Served" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "2.4M+", label: "Products" },
];

export default function SmartCartLanding() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);
  const parallax = useParallax();
const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = (id) => {
    setCartCount(c => c + 1);
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 1500);
  };

  const styles = {
    root: { fontFamily: "'Sora', sans-serif", background: "#0A0A0F", color: "#F0EEE8", minHeight: "100vh", overflowX: "hidden" },

    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "12px 48px" : "24px 48px",
      background: scrolled ? "rgba(10,10,15,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.4s ease",
    },
    logo: { fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color: "#F0EEE8", display: "flex", alignItems: "center", gap: "8px" },
    logoAccent: { color: "#FF6B35" },
    navLinks: { display: "flex", gap: "32px", listStyle: "none", margin: 0, padding: 0 },
    navLink: { fontSize: "14px", letterSpacing: "0.5px", cursor: "pointer", color: "#9A9A8F", transition: "color 0.2s", fontWeight: 500 },
    navLinkActive: { color: "#F0EEE8" },
    cartBtn: {
      background: "#FF6B35", border: "none", borderRadius: "50px", padding: "10px 22px",
      color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: "8px",
      transition: "transform 0.2s, background 0.2s",
      fontFamily: "'Sora', sans-serif",
    },
    cartBadge: {
      background: "#fff", color: "#FF6B35", borderRadius: "50%",
      width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "11px", fontWeight: 800,
    },

    hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 48px" },
    heroBg: {
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,53,0.12) 0%, transparent 70%)",
      transform: `translateY(${parallax * 0.3}px)`,
    },
    heroGrid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" },
    heroContent: { maxWidth: "760px", textAlign: "center", position: "relative", zIndex: 1 },
    heroTag: { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "50px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, color: "#FF6B35", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "28px" },
    heroTitle: { fontSize: "clamp(48px, 8vw, 88px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", margin: "0 0 24px" },
    heroTitleAccent: { background: "linear-gradient(135deg, #FF6B35 0%, #FF9F70 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    heroSubtitle: { fontSize: "18px", color: "#9A9A8F", lineHeight: 1.6, margin: "0 0 40px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" },
    heroCta: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" },
    btnPrimary: { background: "#FF6B35", color: "#fff", border: "none", borderRadius: "50px", padding: "16px 36px", fontWeight: 700, fontSize: "16px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "'Sora', sans-serif", boxShadow: "0 0 40px rgba(255,107,53,0.3)" },
    btnSecondary: { background: "transparent", color: "#F0EEE8", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50px", padding: "16px 36px", fontWeight: 600, fontSize: "16px", cursor: "pointer", transition: "background 0.2s", fontFamily: "'Sora', sans-serif" },

    floatBadge: {
      position: "absolute", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "12px 18px",
      display: "flex", alignItems: "center", gap: "10px",
    },

    section: { padding: "120px 48px" },
    sectionLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#FF6B35", marginBottom: "12px" },
    sectionTitle: { fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-1.5px", margin: "0 0 16px", lineHeight: 1.05 },
    sectionSub: { fontSize: "16px", color: "#9A9A8F", maxWidth: "500px", lineHeight: 1.7 },

    statsBar: { background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "32px" },
    statItem: { textAlign: "center" },
    statNum: { fontSize: "42px", fontWeight: 900, letterSpacing: "-1px", color: "#FF6B35" },
    statLabel: { fontSize: "13px", color: "#9A9A8F", fontWeight: 500, marginTop: "4px" },

    productsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginTop: "56px" },
    card: (id) => ({
      background: hoveredCard === id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "20px", padding: "28px",
      cursor: "pointer", position: "relative", overflow: "hidden",
      transition: "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
      transform: hoveredCard === id ? "translateY(-6px)" : "none",
      boxShadow: hoveredCard === id ? "0 20px 60px rgba(0,0,0,0.4)" : "none",
    }),
    cardEmoji: { fontSize: "56px", display: "block", marginBottom: "20px" },
    cardBadge: (color) => ({ display: "inline-block", background: color + "22", color: color, border: `1px solid ${color}44`, borderRadius: "50px", padding: "4px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "12px" }),
    cardName: { fontSize: "18px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.3px" },
    cardRating: { fontSize: "13px", color: "#9A9A8F", margin: "0 0 20px" },
    cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    cardPrice: { fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px" },
    addBtn: (id, color) => ({
      background: addedProduct === id ? "#22c55e" : color,
      border: "none", borderRadius: "50px", padding: "10px 20px",
      color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer",
      transition: "all 0.3s", fontFamily: "'Sora', sans-serif",
      transform: addedProduct === id ? "scale(1.05)" : "scale(1)",
    }),

    featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", marginTop: "56px" },
    featureCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "32px 28px" },
    featureIcon: { fontSize: "36px", marginBottom: "20px", display: "block" },
    featureTitle: { fontSize: "17px", fontWeight: 700, marginBottom: "10px", letterSpacing: "-0.3px" },
    featureDesc: { fontSize: "14px", color: "#9A9A8F", lineHeight: 1.65 },

    testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "56px" },
    testimonialCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px" },
    testimonialText: { fontSize: "15px", color: "#C8C6BE", lineHeight: 1.7, marginBottom: "24px", fontStyle: "italic" },
    testimonialAuthor: { display: "flex", alignItems: "center", gap: "12px" },
    avatar: (color) => ({ width: "40px", height: "40px", borderRadius: "50%", background: color + "30", border: `1px solid ${color}50`, color: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }),
    authorName: { fontSize: "14px", fontWeight: 700 },
    authorCity: { fontSize: "12px", color: "#9A9A8F" },

    ctaSection: { padding: "120px 48px", textAlign: "center", position: "relative", overflow: "hidden" },
    ctaBg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,107,53,0.1) 0%, transparent 70%)" },
    ctaBox: { maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 },
    emailForm: { display: "flex", gap: "12px", maxWidth: "440px", margin: "32px auto 0", flexWrap: "wrap" },
    emailInput: { flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "14px 22px", color: "#F0EEE8", fontSize: "15px", outline: "none", minWidth: "200px", fontFamily: "'Sora', sans-serif" },

    footer: { borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" },
    footerLogo: { fontSize: "18px", fontWeight: 800 },
    footerLinks: { display: "flex", gap: "24px", listStyle: "none", padding: 0, margin: 0 },
    footerLink: { fontSize: "13px", color: "#9A9A8F", cursor: "pointer" },
    footerCopy: { fontSize: "12px", color: "#5A5A52" },

    navItems: ["Home"],
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={styles.root}>

        {/* NAV */}
        <nav style={styles.nav}>
          <div style={styles.logo}>
            <span style={styles.logoAccent}>S</span>mart<span style={styles.logoAccent}>C</span>art
          </div>
          <ul style={styles.navLinks}>
            {styles.navItems.map(item => (
              <li key={item} style={{ ...styles.navLink, ...(activeNav === item.toLowerCase() ? styles.navLinkActive : {}) }}
                onClick={() => setActiveNav(item.toLowerCase())}>{item}</li>
            ))}
          </ul>
          <button style={styles.cartBtn} onMouseEnter={e => e.target.style.transform = "scale(1.05)"} onMouseLeave={e => e.target.style.transform = "scale(1)"}  onClick={() => navigate("/login")}>
              Login
          </button>
        </nav>

        {/* HERO */}
        <section style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroGrid} />

          <div style={{ ...styles.floatBadge, top: "20%", left: "6%", animation: "float 4s ease-in-out infinite" }}>
            <span>🔥</span><span style={{ fontSize: "13px", fontWeight: 600 }}>Flash Sale Live</span>
          </div>
          <div style={{ ...styles.floatBadge, top: "30%", right: "6%", animation: "float 4s ease-in-out infinite 1.5s" }}>
            <span>✅</span><span style={{ fontSize: "13px", fontWeight: 600 }}>2M+ Happy Buyers</span>
          </div>
          <div style={{ ...styles.floatBadge, bottom: "25%", left: "8%", animation: "float 4s ease-in-out infinite 0.8s" }}>
            <span>🚚</span><span style={{ fontSize: "13px", fontWeight: 600 }}>Free Same-Day Delivery</span>
          </div>

          <div style={styles.heroContent}>
            <div style={{ animation: "fadeUp 0.8s ease 0.1s both" }}>
              <span style={styles.heroTag}>✦ The Smartest Way to Shop</span>
            </div>
            <div style={{ animation: "fadeUp 0.8s ease 0.3s both" }}>
              <h1 style={styles.heroTitle}>
                Shop <span style={styles.heroTitleAccent}>Smarter,</span><br />Live Better.
              </h1>
            </div>
            <div style={{ animation: "fadeUp 0.8s ease 0.5s both" }}>
              <p style={styles.heroSubtitle}>Discover curated products at unbeatable prices. Fast shipping, easy returns, and millions of items — all in one place.</p>
            </div>
            <div style={{ ...styles.heroCta, animation: "fadeUp 0.8s ease 0.7s both" }}>
              <button style={styles.btnPrimary}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(255,107,53,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(255,107,53,0.3)"; }} onClick={() => navigate("/login")}>
                Explore Collections →
              </button>
              {/*<button style={styles.btnSecondary}*/}
                {/*onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}*/}
                {/*onMouseLeave={e => e.currentTarget.style.background = "transparent"}>*/}
                {/*View Flash Deals*/}
              {/*</button>*/}
            </div>
          </div>
        </section>

        {/* STATS */}
        <div style={styles.statsBar}>
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1} style={styles.statItem}>
              <div style={styles.statItem}>
                <div style={styles.statNum}>{s.number}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* PRODUCTS */}
        <section style={styles.section}>
          <FadeIn>
            <div style={styles.sectionLabel}>✦ Curated For You</div>
            <h2 style={styles.sectionTitle}>Trending Right Now</h2>
            <p style={styles.sectionSub}>Handpicked products loved by millions of customers worldwide.</p>
          </FadeIn>
          <div style={styles.productsGrid}>
            {products.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.1} direction="up">
                <div style={styles.card(p.id)}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: p.color, opacity: hoveredCard === p.id ? 1 : 0, transition: "opacity 0.3s" }} />
                  <span style={styles.cardEmoji}>{p.emoji}</span>
                  <span style={styles.cardBadge(p.color)}>{p.badge}</span>
                  <div style={styles.cardName}>{p.name}</div>
                  <div style={styles.cardRating}>⭐ {p.rating} · {p.reviews.toLocaleString()} reviews</div>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardPrice}>{p.price}</span>
                    <button style={styles.addBtn(p.id, p.color)} onClick={() => handleAddToCart(p.id)}>
                      {addedProduct === p.id ? "✓ Added!" : "+ Cart"}
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ ...styles.section, background: "rgba(255,255,255,0.015)" }}>
          <FadeIn>
            <div style={styles.sectionLabel}>✦ Why SmartCart</div>
            <h2 style={styles.sectionTitle}>Built Around You</h2>
            <p style={styles.sectionSub}>Every feature is crafted to make your shopping experience seamless.</p>
          </FadeIn>
          <div style={styles.featuresGrid}>
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.12} direction="up">
                <div style={styles.featureCard}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <div style={styles.featureTitle}>{f.title}</div>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={styles.section}>
          <FadeIn>
            <div style={styles.sectionLabel}>✦ Customer Love</div>
            <h2 style={styles.sectionTitle}>Millions of Happy Shoppers</h2>
            <p style={styles.sectionSub}>Don't take our word for it — hear from our community.</p>
          </FadeIn>
          <div style={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.15} direction="up">
                <div style={styles.testimonialCard}>
                  <p style={styles.testimonialText}>"{t.text}"</p>
                  <div style={styles.testimonialAuthor}>
                    <div style={styles.avatar(t.color)}>{t.avatar}</div>
                    <div>
                      <div style={styles.authorName}>{t.name}</div>
                      <div style={styles.authorCity}>{t.city}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaBg} />
          <FadeIn>
            <div style={styles.ctaBox}>
              <div style={styles.sectionLabel}>✦ Stay In The Loop</div>
              <h2 style={{ ...styles.sectionTitle, textAlign: "center" }}>Get Exclusive Deals First</h2>
              <p style={{ ...styles.sectionSub, textAlign: "center", margin: "0 auto" }}>Join over 500,000 shoppers who get early access to sales, drops, and special offers.</p>
              <div style={styles.emailForm}>
                <input style={styles.emailInput} type="email" placeholder="Enter your email..." />
                <button style={{ ...styles.btnPrimary, padding: "14px 28px", whiteSpace: "nowrap" }}>Subscribe →</button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.footerLogo}>Smart<span style={{ color: "#FF6B35" }}>Cart</span></div>
          <ul style={styles.footerLinks}>
            {["Privacy", "Terms", "Careers", "Support", "Press"].map(l => (
              <li key={l} style={styles.footerLink}>{l}</li>
            ))}
          </ul>
          <div style={styles.footerCopy}>© 2026 SmartCart. All rights reserved.</div>
        </footer>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: none; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #0A0A0F; }
          ::-webkit-scrollbar-thumb { background: #FF6B35; border-radius: 3px; }
        `}</style>
      </div>
    </>
  );
}