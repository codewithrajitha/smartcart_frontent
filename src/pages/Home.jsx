import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── DATA ───────────────────────────────────────────────────────────────────

const FEATURED_CATEGORIES = [
  { icon: "💄", label: "Lips",        count: "320+ products",  accent: "#c0394b" },
  { icon: "✨", label: "Skincare",    count: "580+ products",  accent: "#a07850" },
  { icon: "👁️",  label: "Eyes",       count: "410+ products",  accent: "#5a3e6b" },
  { icon: "🌸", label: "Foundation",  count: "240+ products",  accent: "#d4826a" },
];

const TRUST_BADGES = [
  { icon: "🌿", label: "Cruelty-Free" },
  { icon: "🔬", label: "Dermatologist Tested" },
  { icon: "🚚", label: "Free Delivery ₹499+" },
  { icon: "↩️", label: "30-Day Returns" },
];

const DEALS = [
  {
    name: "Velvet Matte Lip Kit",
    desc: "Long-lasting comfort formula",
    oldPrice: "₹1,899",
    newPrice: "₹1,199",
    badge: "37% OFF",
    emoji: "💄",
    color: "#c0394b",
    bg: "#fdf2f4",
    category: "Lips",
  },
  {
    name: "Glow Serum Duo",
    desc: "Hyaluronic + Vitamin C",
    oldPrice: "₹3,200",
    newPrice: "₹2,099",
    badge: "34% OFF",
    emoji: "✨",
    color: "#a07850",
    bg: "#fdf8f2",
    category: "Skincare",
  },
  {
    name: "Smoky Eye Palette",
    desc: "12 blendable shades",
    oldPrice: "₹2,400",
    newPrice: "₹1,499",
    badge: "38% OFF",
    emoji: "👁️",
    color: "#5a3e6b",
    bg: "#f7f3fc",
    category: "Eyes",
  },
];

const HERO_CART_ITEMS = [
  { name: "Velvet Lip Rouge",    price: "₹1,199", emoji: "💄", bg: "#fde8ec" },
  { name: "Rose Glow Serum",     price: "₹2,099", emoji: "🌹", bg: "#fff0f3" },
  { name: "Luminous Foundation", price: "₹1,799", emoji: "✨", bg: "#fff8f0" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function fadeIn(visible, delay = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  };
}

// ─── FONT INJECTION ─────────────────────────────────────────────────────────

if (typeof document !== "undefined") {
  const id = "smartcart-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function Home() {
  const [visible, setVisible]       = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [hoveredDeal, setHoveredDeal] = useState(null);
  


  // User Profile & Authentication Dropdown States
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data from session:", err);
      }
    }
    
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };




  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! 👋 I'm your Beauty Assistant. How can I help you today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to backend (Real AI)
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/chat/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          userId: user?._id || localStorage.getItem("userId")
        })
      });

      const data = await response.json();

      setMessages(prev => [...prev, { 
        type: "bot", 
        text: data.reply || "Sorry, I'm having trouble responding right now." 
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        type: "bot", 
        text: "Sorry, I'm unable to connect to the server right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };





  return (
    <div style={s.root}>

      {/* ─── NAV ─── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={{ ...s.logo, cursor: "pointer" }} onClick={() => navigate("/home")}>
            <span style={s.logoMark}>S</span>
            <div>
              <span style={s.logoText}>SmartCart</span>
              <span style={s.logoTagline}>beauty</span>
            </div>
          </div>

          <div style={s.searchBar}>
            <span style={{ fontSize: "13px" }}>🔍</span>
            <span style={s.searchPlaceholder}>Search lipsticks, serums, palettes…</span>
          </div>

          <div style={s.navActions}>
            <button
              style={s.navBtn}
              onClick={() => navigate("/userviewcart")}
              onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              🛍 Bag
            </button>
            <button
              style={{ ...s.navBtn, ...s.navBtnPrimary }}
              onClick={() => navigate("/userviewproducts")}
              onMouseEnter={e => (e.currentTarget.style.background = "#a0293a")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c0394b")}
            >
              Shop Now
            </button>

            <button
  style={s.navBtn}
  onClick={() => navigate("/skinscanner")}
  onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
>
  📷 Skin Scanner
</button>

            {/* DYNAMIC PROFILE CORNER */}
            {user ? (
              <div 
                style={s.profileContainer}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div style={s.profileTrigger}>
                  <div style={s.avatar}>
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span style={s.profileName}>{user.name.split(" ")[0]}</span>
                  <span style={s.arrowDown}>▼</span>
                </div>

                {showDropdown && (
                  <div style={s.dropdown}>
                    <div style={s.dropdownHeader}>
                      <strong style={s.dropdownUserName}>{user.name}</strong>
                      <span style={s.dropdownEmail}>{user.email}</span>
                    </div>
                    <div style={s.dropdownDivider} />
                    <div 
                      style={s.dropdownItem}
                      onClick={() => navigate("/uservieworders")}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      📦 My Orders
                    </div>
                    <div 
                      style={s.dropdownItem}
                      onClick={() => navigate("/userviewcart")}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      🛍 My Bag
                    </div>
                    <div style={s.dropdownDivider} />
                    <div 
                      style={{ ...s.dropdownItem, color: "#c0394b", fontWeight: "700" }}
                      onClick={handleLogout}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      🚪 Sign Out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                style={{ ...s.navBtn, borderColor: "#c0394b", color: "#c0394b" }}
                onClick={() => navigate("/login")}
                onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ─── TRUST BAR ─── */}
      <div style={s.trustBar}>
        {TRUST_BADGES.map((b) => (
          <div key={b.label} style={s.trustItem}>
            <span style={{ fontSize: "13px" }}>{b.icon}</span>
            <span style={s.trustLabel}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* ─── HERO ─── */}
      <section
        style={{
          ...s.hero,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div style={s.heroContent}>
          <div style={s.heroPill}>🌸 New season arrivals</div>

          <h1 style={s.heroH1}>
            Reveal Your
            <br />
            <em style={s.heroItalic}>Natural Glow</em>
          </h1>

          <p style={s.heroSub}>
            Premium skincare, makeup & wellness — crafted for every skin tone.
            Cruelty-free formulas that feel as beautiful as they look.
          </p>

          <div style={s.heroCta}>
            <button
              style={s.ctaPrimary}
              onClick={() => navigate("/userviewproducts")}
              onMouseEnter={e => { e.currentTarget.style.background = "#a0293a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#c0394b"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Explore Collection →
            </button>
            <button
              style={s.ctaSecondary}
              onClick={() => navigate("/uservieworders")}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#c0394b")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8d5d8")}
            >
              Track My Order
            </button>
          </div>

          <div style={s.heroStats}>
            {[["8k+", "Products"], ["4.9★", "Avg Rating"], ["30k+", "Happy Customers"]].map(([v, l]) => (
              <div key={l} style={s.heroStat}>
                <strong style={s.heroStatVal}>{v}</strong>
                <span style={s.heroStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.heroVisual}>
          <HeroCard />
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section style={{ ...s.section, ...fadeIn(visible, 0.15) }}>
        <SectionHeader
          title="Shop by Category"
          subtitle="Curated collections for every beauty ritual"
        />
        <div style={s.catGrid}>
          {FEATURED_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              style={{
                ...s.catCard,
                borderColor: hoveredCat === cat.label ? cat.accent : "#f0e4e6",
                boxShadow:
                  hoveredCat === cat.label
                    ? `0 6px 24px ${cat.accent}28`
                    : "0 1px 4px rgba(0,0,0,0.05)",
                transform: hoveredCat === cat.label ? "translateY(-4px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHoveredCat(cat.label)}
              onMouseLeave={() => setHoveredCat(null)}
              onClick={() => navigate(`/userviewproducts?category=${encodeURIComponent(cat.label)}`)}
            >
              <div style={{ ...s.catIcon, background: cat.accent + "18" }}>
                <span style={{ fontSize: "26px" }}>{cat.icon}</span>
              </div>
              <div style={s.catInfo}>
                <strong style={s.catName}>{cat.label}</strong>
                <span style={s.catCount}>{cat.count}</span>
              </div>
              <span style={{ ...s.catArrow, color: cat.accent }}>›</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FLASH DEALS ─── */}
      <section style={{ ...s.dealsSection, ...fadeIn(visible, 0.25) }}>
        <div style={s.dealsHeader}>
          <div>
            <h2 style={s.dealsTitleText}>✨ Beauty Deals</h2>
            <p style={s.dealsSub}>Limited-time offers on bestsellers</p>
          </div>
          <button
            style={s.viewAllBtn}
            onClick={() => navigate("/userviewproducts")}
            onMouseEnter={e => (e.currentTarget.style.color = "#a0293a")}
            onMouseLeave={e => (e.currentTarget.style.color = "#c0394b")}
          >
            View All Deals →
          </button>
        </div>

        <div style={s.dealsGrid}>
          {DEALS.map((deal, i) => (
            <div
              key={deal.name}
              style={{
                ...s.dealCard,
                transform: hoveredDeal === i ? "translateY(-3px)" : "translateY(0)",
                boxShadow:
                  hoveredDeal === i
                    ? "0 10px 30px rgba(0,0,0,0.10)"
                    : "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={() => setHoveredDeal(i)}
              onMouseLeave={() => setHoveredDeal(null)}
              onClick={() => navigate(`/userviewproducts?category=${encodeURIComponent(deal.category)}`)}
            >
              <div style={{ ...s.dealImg, background: deal.bg }}>
                <span style={{ fontSize: "44px" }}>{deal.emoji}</span>
                <span style={{ ...s.dealBadge, background: deal.color }}>{deal.badge}</span>
              </div>
              <div style={s.dealBody}>
                <p style={s.dealName}>{deal.name}</p>
                <p style={s.dealDesc}>{deal.desc}</p>
                <div style={s.dealPrices}>
                  <span style={s.dealNewPrice}>{deal.newPrice}</span>
                  <span style={s.dealOldPrice}>{deal.oldPrice}</span>
                </div>
                <button
                  style={{ ...s.addToCartBtn, borderColor: deal.color, color: deal.color }}
                  onMouseEnter={e => { e.currentTarget.style.background = deal.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = deal.color; }}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BANNER CTA ─── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 56px", padding: "0 24px", ...fadeIn(visible, 0.35) }}>
        <div style={s.banner}>
          <div style={s.bannerLeft}>
            <span style={s.bannerEyebrow}>Free Shipping Above ₹499</span>
            <h2 style={s.bannerTitle}>Discover beauty that loves you back.</h2>
            <button
              style={s.bannerBtn}
              onClick={() => navigate("/userviewproducts")}
              onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
              onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
            >
              Shop the Collection →
            </button>
          </div>
          <div style={s.bannerRight}>
            {["🌿 Cruelty-Free", "🔬 Dermatologist Tested", "🌸 Clean Ingredients"].map((b) => (
              <div key={b} style={s.bannerBadge}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer style={s.footer}>
        <span style={s.footerBrand}>SmartCart Beauty</span>
        <span style={s.footerDivider}>·</span>
        <span style={s.footerText}>© 2025 All rights reserved</span>
        <span style={s.footerDivider}>·</span>
        <span style={s.footerLink}>Privacy Policy</span>
        <span style={s.footerDivider}>·</span>
        <span style={s.footerLink}>Terms of Service</span>
      </footer>



      {/* REAL AI CHATBOT */}
      <div style={s.chatContainer}>
        <button style={s.chatButton} onClick={() => setIsChatOpen(!isChatOpen)}>
          💬
        </button>

        {isChatOpen && (
          <div style={s.chatWindow}>
            <div style={s.chatHeader}>
              <div>
                <strong>Beauty Assistant</strong>
                <div style={{ fontSize: "12px", color: "#4ade80" }}>● Online</div>
              </div>
              <button style={s.closeChatBtn} onClick={() => setIsChatOpen(false)}>✕</button>
            </div>

            <div style={s.chatBody}>
              {messages.map((msg, idx) => (
                <div key={idx} style={msg.type === "user" ? s.userMessage : s.botMessage}>
                  {msg.text}
                </div>
              ))}
              
              {isTyping && (
                <div style={s.botMessage}>
                  <span>Thinking</span>
                  <span style={{ animation: "dots 1.5s infinite" }}>...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={s.chatInputArea}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, orders, returns..."
                style={s.chatInput}
              />
              <button style={s.sendButton} onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>



    </div>
  );
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={s.sectionTitle}>{title}</h2>
      <p style={s.sectionSub}>{subtitle}</p>
    </div>
  );
}

function HeroCard() {
  return (
    <div style={s.illustrationWrap}>
      <div style={s.dashCard}>
        <div style={s.dashHeader}>
          <span style={s.dashDot} />
          <span style={s.dashTitle}>My Beauty Bag</span>
          <span style={s.dashBadge}>3 items</span>
        </div>

        {HERO_CART_ITEMS.map((item) => (
          <div key={item.name} style={s.dashItem}>
            <div style={{ ...s.dashItemIcon, background: item.bg }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={s.dashItemName}>{item.name}</div>
            </div>
            <div style={s.dashItemPrice}>{item.price}</div>
          </div>
        ))}

        <div style={s.dashDivider} />

        <div style={s.dashTotal}>
          <span style={s.dashTotalLabel}>Total</span>
          <span style={s.dashTotalVal}>₹5,097</span>
        </div>

        <div style={s.dashCheckout}>Checkout Securely →</div>
      </div>

      <div style={s.floatingBadge}>
        <span style={{ fontSize: "18px" }}>🌸</span>
        <div>
          <div style={s.floatBadgeTitle}>Clean Beauty Certified</div>
          <div style={s.floatBadgeSub}>100% cruelty-free products</div>
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const s = {
  root: {
    minHeight: "100vh",
    background: "#fdf8f6",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#1a0a0d",
  },

  // NAV
  nav: {
    background: "#ffffff",
    borderBottom: "1px solid #f0e4e6",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  logoMark: {
    width: "34px",
    height: "34px",
    background: "linear-gradient(135deg, #c0394b, #e07080)",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    fontFamily: "'Cormorant Garamond', serif",
  },
  logoText: {
    fontWeight: "700",
    fontSize: "18px",
    color: "#1a0a0d",
    letterSpacing: "-0.3px",
    display: "block",
    lineHeight: 1.1,
  },
  logoTagline: {
    fontSize: "10px",
    color: "#c0394b",
    fontWeight: "600",
    letterSpacing: "2px",
    textTransform: "uppercase",
    display: "block",
  },
  searchBar: {
    flex: 1,
    background: "#fdf2f4",
    border: "1px solid #f0e4e6",
    borderRadius: "100px",
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "text",
    maxWidth: "480px",
  },
  searchPlaceholder: {
    fontSize: "13.5px",
    color: "#b08090",
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  navBtn: {
    background: "transparent",
    border: "1px solid #f0e4e6",
    borderRadius: "100px",
    padding: "8px 18px",
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#3d1a22",
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  },
  navBtnPrimary: {
    background: "#c0394b",
    borderColor: "#c0394b",
    color: "#fff",
    transition: "background 0.15s",
  },

  // USER PROFILE ADDITIONS
  profileContainer: {
    position: "relative",
    cursor: "pointer",
  },
  profileTrigger: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "100px",
    border: "1px solid #f0e4e6",
    backgroundColor: "#ffffff",
    transition: "all 0.2s ease"
  },
  avatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c0394b, #e07080)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'DM Sans', sans-serif"
  },
  profileName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#3d1a22"
  },
  arrowDown: {
    fontSize: "8px",
    color: "#b08090",
    marginLeft: "2px"
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: "220px",
    backgroundColor: "#ffffff",
    border: "1px solid #f0e4e6",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(192,57,75,0.12)",
    padding: "8px 0",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  dropdownHeader: {
    padding: "10px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  dropdownUserName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a0a0d"
  },
  dropdownEmail: {
    fontSize: "11px",
    color: "#b08090"
  },
  dropdownDivider: {
    height: "1px",
    backgroundColor: "#f0e4e6",
    margin: "6px 0"
  },
  dropdownItem: {
    padding: "10px 16px",
    fontSize: "13px",
    color: "#3d1a22",
    transition: "background 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "500"
  },

  // TRUST BAR
  trustBar: {
    background: "#3d1a22",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    padding: "9px 24px",
    flexWrap: "wrap",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  trustLabel: {
    fontSize: "11.5px",
    fontWeight: "600",
    color: "#f5d0d8",
    letterSpacing: "0.5px",
  },

  // HERO
  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "68px 24px 44px",
    display: "flex",
    alignItems: "center",
    gap: "60px",
    flexWrap: "wrap",
  },
  heroContent: { flex: "1 1 380px" },
  heroPill: {
    display: "inline-block",
    background: "#fde8ec",
    color: "#a0293a",
    borderRadius: "100px",
    padding: "5px 14px",
    fontSize: "12.5px",
    fontWeight: "700",
    marginBottom: "22px",
    letterSpacing: "0.3px",
  },
  heroH1: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(42px, 5vw, 68px)",
    fontWeight: "600",
    lineHeight: 1.05,
    letterSpacing: "-1px",
    color: "#1a0a0d",
    margin: "0 0 18px",
  },
  heroItalic: {
    fontStyle: "italic",
    color: "#c0394b",
    fontWeight: "400",
  },
  heroSub: {
    fontSize: "16px",
    color: "#7a4050",
    lineHeight: 1.7,
    marginBottom: "36px",
    maxWidth: "400px",
    fontWeight: "400",
  },
  heroCta: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "44px",
  },
  ctaPrimary: {
    background: "#c0394b",
    color: "#fff",
    border: "none",
    borderRadius: "100px",
    padding: "14px 30px",
    fontSize: "14.5px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.2s",
    letterSpacing: "0.2px",
  },
  ctaSecondary: {
    background: "#fff",
    color: "#3d1a22",
    border: "1.5px solid #e8d5d8",
    borderRadius: "100px",
    padding: "14px 26px",
    fontSize: "14.5px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  heroStats: {
    display: "flex",
    gap: "36px",
  },
  heroStat: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  heroStatVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "26px",
    fontWeight: "600",
    color: "#1a0a0d",
  },
  heroStatLabel: {
    fontSize: "12px",
    color: "#b08090",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },

  // HERO CARD
  heroVisual: {
    flex: "1 1 320px",
    maxWidth: "400px",
  },
  illustrationWrap: { position: "relative" },
  dashCard: {
    background: "#ffffff",
    border: "1px solid #f0e4e6",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 8px 40px rgba(192,57,75,0.10)",
  },
  dashHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  dashDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#c0394b",
  },
  dashTitle: {
    fontWeight: "700",
    fontSize: "14.5px",
    flex: 1,
    color: "#1a0a0d",
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: "0.2px",
  },
  dashBadge: {
    background: "#fde8ec",
    color: "#a0293a",
    borderRadius: "100px",
    padding: "3px 10px",
    fontSize: "11.5px",
    fontWeight: "700",
  },
  dashItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid #fdf0f2",
  },
  dashItemIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  dashItemName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a0a0d",
  },
  dashItemPrice: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#c0394b",
    flexShrink: 0,
  },
  dashDivider: {
    height: "1px",
    background: "#fdf0f2",
    margin: "14px 0",
  },
  dashTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  dashTotalLabel: {
    fontSize: "13px",
    color: "#7a4050",
    fontWeight: "600",
  },
  dashTotalVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a0a0d",
  },
  dashCheckout: {
    background: "linear-gradient(135deg, #c0394b, #e07080)",
    color: "#fff",
    textAlign: "center",
    borderRadius: "100px",
    padding: "12px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.2px",
  },
  floatingBadge: {
    position: "absolute",
    bottom: "-18px",
    right: "-18px",
    background: "#fff",
    border: "1px solid #f0e4e6",
    borderRadius: "16px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 20px rgba(192,57,75,0.12)",
    minWidth: "200px",
  },
  floatBadgeTitle: {
    fontSize: "12.5px",
    fontWeight: "700",
    color: "#1a0a0d",
  },
  floatBadgeSub: {
    fontSize: "11px",
    color: "#b08090",
  },

  // SECTIONS
  section: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 24px 52px",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: "600",
    color: "#1a0a0d",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  sectionSub: {
    fontSize: "13.5px",
    color: "#b08090",
    margin: "4px 0 0",
  },

  // CATEGORIES
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  catCard: {
    background: "#ffffff",
    border: "1.5px solid #f0e4e6",
    borderRadius: "16px",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
  },
  catIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  catInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  catName: {
    fontSize: "14.5px",
    fontWeight: "700",
    color: "#1a0a0d",
  },
  catCount: {
    fontSize: "12px",
    color: "#b08090",
  },
  catArrow: {
    fontSize: "22px",
    fontWeight: "300",
  },

  // DEALS
  dealsSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  dealsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  dealsTitleText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: "600",
    color: "#1a0a0d",
    margin: 0,
  },
  dealsSub: {
    fontSize: "13.5px",
    color: "#b08090",
    margin: "4px 0 0",
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#c0394b",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "color 0.15s",
    padding: 0,
  },
  dealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  dealCard: {
    background: "#ffffff",
    border: "1px solid #f0e4e6",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  dealImg: {
    height: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dealBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "800",
    padding: "4px 9px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
  },
  dealBody: { padding: "16px" },
  dealName: {
    fontSize: "14.5px",
    fontWeight: "700",
    color: "#1a0a0d",
    margin: "0 0 4px",
  },
  dealDesc: {
    fontSize: "12px",
    color: "#b08090",
    margin: "0 0 10px",
  },
  dealPrices: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginBottom: "14px",
  },
  dealNewPrice: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a0a0d",
  },
  dealOldPrice: {
    fontSize: "13px",
    color: "#c0a0a8",
    textDecoration: "line-through",
  },
  addToCartBtn: {
    width: "100%",
    background: "transparent",
    border: "1.5px solid",
    borderRadius: "100px",
    padding: "9px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    letterSpacing: "0.2px",
  },

  // BANNER
  banner: {
    background: "linear-gradient(135deg, #3d1a22 0%, #6b2535 50%, #a0293a 100%)",
    borderRadius: "22px",
    padding: "44px 52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "28px",
  },
  bannerLeft: { flex: 1 },
  bannerRight: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "flex-end",
  },
  bannerEyebrow: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    color: "#f5d0d8",
    borderRadius: "100px",
    padding: "4px 14px",
    fontSize: "11.5px",
    fontWeight: "700",
    marginBottom: "14px",
    letterSpacing: "0.5px",
  },
  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: "400",
    fontStyle: "italic",
    color: "#fff",
    margin: "0 0 22px",
    maxWidth: "360px",
    lineHeight: 1.3,
  },
  bannerBtn: {
    background: "#ffffff",
    color: "#a0293a",
    border: "none",
    borderRadius: "100px",
    padding: "12px 26px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.15s",
    letterSpacing: "0.2px",
  },
  bannerBadge: {
    background: "rgba(255,255,255,0.12)",
    color: "#fde8ec",
    borderRadius: "10px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    backdropFilter: "blur(4px)",
  },

  // FOOTER
  footer: {
    borderTop: "1px solid #f0e4e6",
    background: "#fff",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  footerBrand: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "600",
    fontSize: "16px",
    color: "#1a0a0d",
    letterSpacing: "0.3px",
  },
  footerDivider: { color: "#e0c8cc" },
  footerText: { fontSize: "12.5px", color: "#7a4050" },
  footerLink: {
    fontSize: "12.5px",
    color: "#c0394b",
    cursor: "pointer",
    fontWeight: "600",
  },


     chatContainer: { position: "fixed", bottom: "25px", right: "25px", zIndex: 9999 },
  chatButton: {
    width: "62px", height: "62px", borderRadius: "50%",
    background: "linear-gradient(135deg, #c0394b, #e07080)",
    color: "#fff", fontSize: "28px", border: "none", cursor: "pointer",
    boxShadow: "0 10px 30px rgba(192,57,75,0.4)",
  },
  chatWindow: {
    position: "absolute", bottom: "85px", right: "0", width: "360px", height: "520px",
    background: "#ffffff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #f0e4e6"
  },
  chatHeader: { 
    padding: "16px 20px", background: "#fdf2f4", borderBottom: "1px solid #f0e4e6",
    display: "flex", justifyContent: "space-between", alignItems: "center" 
  },
  closeChatBtn: { background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#c0394b" },
  chatBody: { flex: 1, padding: "20px", overflowY: "auto", background: "#fdf8f6", display: "flex", flexDirection: "column", gap: "12px" },
  botMessage: { alignSelf: "flex-start", background: "#fff", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", maxWidth: "80%", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  userMessage: { alignSelf: "flex-end", background: "#c0394b", color: "#fff", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", maxWidth: "80%" },
  chatInputArea: { padding: "12px", background: "#fff", borderTop: "1px solid #f0e4e6", display: "flex", gap: "8px" },
  chatInput: { flex: 1, padding: "12px 16px", border: "1px solid #f0e4e6", borderRadius: "30px", outline: "none", fontSize: "14px" },
  sendButton: { background: "#c0394b", color: "#fff", border: "none", padding: "0 24px", borderRadius: "30px", cursor: "pointer", fontWeight: "600" },


};