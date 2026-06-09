// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// const ViewProducts = () => {

//     const [products, setProducts] = useState([]);

//     const navigate = useNavigate();

//     useEffect(() => {

//         fetchProducts();

//     }, []);

//     const fetchProducts = async () => {

//         const response = await axios.get(
//                 "http://localhost:5000/productRoutes/viewproducts"
//             );

//             setProducts(response.data);
//             console.log(response.data)
//     };



//     const deleteProduct = async (id) => {

//     try {

//         const confirmDelete = window.confirm(
//             "Are you sure you want to delete this product?"
//         );

//         if (!confirmDelete) return;

//         const response = await axios.delete(
//             `http://localhost:5000/productRoutes/deleteProduct/${id}`
//         );

//         alert(response.data.message);

//         fetchProducts();

//     } catch (error) {

//         console.log(error);

//         alert("Delete Failed");
//     }
// };

//     return (

//         <div style={styles.container}>

//             <h1 style={styles.heading}>
//                 All Products
//             </h1>

//             <div style={styles.productGrid}>

//                 {products.map((product) => (

//                     <div
//                         key={product._id}
//                         style={styles.card}
//                     >

//                         <img
//                             src={`http://localhost:5000/uploads/${product.image}`}
//                             alt={product.name}
//                             style={styles.image}
//                         />

//                         <h2 style={styles.name}>
//                             {product.name}
//                         </h2>

//                         <p style={styles.category}>
//                             {product.category}
//                         </p>

//                         <h3 style={styles.price}>
//                             ₹ {product.price}
//                         </h3>

//                         <p style={styles.description}>
//                             {product.description}
//                         </p>

//                         <p style={styles.skinType}>
//     <strong>Skin Type:</strong> {product.skinType}
// </p>

// <p style={styles.skinConcern}>
//     <strong>Skin Concern:</strong> {product.skinConcern}
// </p>

//                         <button style={styles.editBtn} onClick={() => navigate(`/EditProduct/${product._id}`)}>Edit</button>
// <button
//     style={styles.deleteBtn}
//     onClick={() => deleteProduct(product._id)}
// >
//     Delete
// </button>
//                     </div>
//                 ))}

//             </div>

//         </div>
//     );
// };

// const styles = {

//     container: {
//         padding: "30px",
//         backgroundColor: "#f5f5f5",
//         minHeight: "100vh"
//     },

//     heading: {
//         textAlign: "center",
//         marginBottom: "30px"
//     },

//     productGrid: {
//         display: "grid",
//         gridTemplateColumns:
//             "repeat(auto-fit, minmax(250px, 1fr))",
//         gap: "20px"
//     },

//     card: {
//         backgroundColor: "#fff",
//         borderRadius: "10px",
//         padding: "15px",
//         boxShadow:
//             "0px 0px 10px rgba(0,0,0,0.1)"
//     },

//     image: {
//         width: "100%",
//         height: "250px",
//         objectFit: "cover",
//         borderRadius: "10px"
//     },

//     name: {
//         marginTop: "15px",
//         fontSize: "20px"
//     },

//     category: {
//         color: "gray",
//         marginTop: "5px"
//     },

//     price: {
//         marginTop: "10px",
//         color: "green"
//     },

//     description: {
//         marginTop: "10px",
//         fontSize: "14px",
//         color: "#555"
//     },
//     deleteBtn: {
//     marginTop: "10px",
//     padding: "10px",
//     backgroundColor: "red",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginLeft: "10px"
// },
//     editBtn: {
//     marginTop: "10px",
//     padding: "10px",
//     backgroundColor: "green",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginLeft: "10px"
// },

// skinType: {
//     marginTop: "8px",
//     color: "#007bff",
//     fontSize: "14px"
// },

// skinConcern: {
//     marginTop: "5px",
//     color: "#e91e63",
//     fontSize: "14px"
// },



// };

// export default ViewProducts;













import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard",      path: "/admin" },
  { label: "Add Product",    path: "/AddProducts" },
  { label: "View All Users", path: "/ViewAllUsers" },
  { label: "View Products",  path: "/ViewProducts" },
  { label: "View Orders",    path: "/ViewOrders" },
];

const CATEGORIES = [
  "Makeup","Skincare","Haircare","Fragrance","Lipstick",
  "Foundation","Face Wash","Serum","Moisturizer","Sunscreen",
];
const SKIN_TYPES = ["Oily","Dry","Normal","Combination","Sensitive"];

const ViewProducts = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const [products, setProducts]       = useState([]);
  const [search, setSearch]           = useState("");
  const [catFilter, setCatFilter]     = useState("");
  const [skinFilter, setSkinFilter]   = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://smartcart-server-7qs4.onrender.com/productRoutes/viewproducts");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.delete(
        `https://smartcart-server-7qs4.onrender.com/productRoutes/deleteProduct/${id}`
      );
      alert(response.data.message);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  };

  const filtered = useMemo(() => products.filter((p) => {
    const q = search.toLowerCase();
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchCat = !catFilter  || p.category === catFilter;
    const matchSkin= !skinFilter || p.skinType === skinFilter || p.skinType === "All";
    return matchQ && matchCat && matchSkin;
  }), [products, search, catFilter, skinFilter]);

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.circle1} aria-hidden="true" />
        <div style={s.circle2} aria-hidden="true" />
        <div style={s.logoWrap}>
          <div style={s.logoTitle}>SmartCart Beauty</div>
          <div style={s.logoSub}>Admin Panel</div>
        </div>
        <nav style={s.nav}>
          {NAV_ITEMS.map(({ label, path }) => {
            const active = currentPath === path;
            return (
              <button key={path}
                style={{ ...s.nb, ...(active ? s.nbActive : {}) }}
                onClick={() => navigate(path)}
                aria-current={active ? "page" : undefined}>
                {active && <span style={s.pip} />}
                {label}
              </button>
            );
          })}
        </nav>
        <button style={s.logoutBtn} onClick={() => navigate("/login")}>Logout</button>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>All Products</div>
            <div style={s.pageSub}>Manage your product catalogue</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={s.countBadge}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
            {/* <div style={s.avatar}>Admin<span style={s.onlineDot} aria-label="Online" /></div> */}
          </div>
        </div>

        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <span style={s.searchIcon}>⌕</span>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select style={s.filterSelect} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={s.filterSelect} value={skinFilter} onChange={(e) => setSkinFilter(e.target.value)}>
            <option value="">All skin types</option>
            {SKIN_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Grid */}
        <div style={s.body}>
          {filtered.length === 0 ? (
            <div style={s.empty}>No products match your filters.</div>
          ) : (
            <div style={s.grid}>
              {filtered.map((product) => (
                <div key={product._id} style={s.card}>
                  {/* Image */}
                  <div style={s.imgWrap}>
                    <img
                      src={`https://smartcart-server-7qs4.onrender.com/uploads/${product.image}`}
                      alt={product.name}
                      style={s.img}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <span style={s.catBadge}>{product.category}</span>
                  </div>

                  {/* Body */}
                  <div style={s.cardBody}>
                    <div style={s.cardName}>{product.name}</div>
                    <div style={s.cardPrice}>₹ {Number(product.price).toLocaleString("en-IN")}</div>
                    <div style={s.cardDesc}>{product.description}</div>
                    <div style={s.tags}>
                      <span style={s.tagSkin}>{product.skinType}</span>
                      <span style={s.tagConcern}>{product.skinConcern}</span>
                    </div>
                    <div style={s.actions}>
                      <button style={s.editBtn} onClick={() => navigate(`/EditProduct/${product._id}`)}>
                        Edit
                      </button>
                      <button style={s.deleteBtn} onClick={() => deleteProduct(product._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  wrap: { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#fdf8f6" },

  sidebar: { width: 220, flexShrink: 0, background: "#3d1a22", display: "flex", flexDirection: "column", padding: "28px 0", position: "relative", overflow: "hidden" },
  circle1: { position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(192,57,75,0.18)", pointerEvents: "none" },
  circle2: { position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(192,57,75,0.12)", pointerEvents: "none" },
  logoWrap: { padding: "0 24px 28px", borderBottom: "0.5px solid rgba(255,255,255,0.1)", marginBottom: 16, position: "relative", zIndex: 1 },
  logoTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#fdf8f6", letterSpacing: "0.02em" },
  logoSub: { fontSize: 10, fontWeight: 300, color: "rgba(253,248,246,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 },
  nav: { display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", flex: 1, position: "relative", zIndex: 1 },
  nb: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "transparent", border: "none", borderRadius: 8, color: "rgba(253,248,246,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, cursor: "pointer", textAlign: "left", position: "relative" },
  nbActive: { background: "rgba(192,57,75,0.35)", color: "#fdf8f6", fontWeight: 500 },
  pip: { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "60%", background: "#c0394b", borderRadius: "0 2px 2px 0" },
  logoutBtn: { margin: "16px 12px 0", padding: "10px 14px", background: "transparent", border: "0.5px solid rgba(192,57,75,0.35)", borderRadius: 8, color: "rgba(253,248,246,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer", position: "relative", zIndex: 1 },

  main: { flex: 1, display: "flex", flexDirection: "column", background: "#fdf8f6" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "0.5px solid rgba(61,26,34,0.1)", background: "#fff" },
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#3d1a22" },
  pageSub: { fontSize: 12, color: "rgba(61,26,34,0.45)", marginTop: 1, fontWeight: 300 },
  countBadge: { fontSize: 11, fontWeight: 500, background: "rgba(192,57,75,0.08)", color: "#c0394b", padding: "4px 10px", borderRadius: 20, letterSpacing: "0.04em" },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#c0394b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#fff", position: "relative" },
  onlineDot: { width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff", position: "absolute", bottom: 0, right: 0 },

  toolbar: { display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", background: "#fff", borderBottom: "0.5px solid rgba(61,26,34,0.06)" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, flex: 1, background: "#fdf8f6", border: "0.5px solid rgba(61,26,34,0.14)", borderRadius: 8, padding: "7px 12px" },
  searchIcon: { fontSize: 16, color: "rgba(61,26,34,0.35)", lineHeight: 1 },
  searchInput: { border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#3d1a22", outline: "none", flex: 1 },
  filterSelect: { padding: "7px 12px", background: "#fdf8f6", border: "0.5px solid rgba(61,26,34,0.14)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3d1a22", cursor: "pointer", outline: "none" },

  body: { padding: "20px 28px", flex: 1 },
  empty: { textAlign: "center", padding: "60px 20px", color: "rgba(61,26,34,0.35)", fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 },

  card: { background: "#fff", borderRadius: 12, border: "0.5px solid rgba(61,26,34,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" },
  imgWrap: { position: "relative", height: 180, background: "#f5e8ea", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  catBadge: { position: "absolute", top: 10, left: 10, background: "rgba(61,26,34,0.72)", color: "#fdf8f6", fontSize: 10, fontWeight: 500, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.04em" },
  cardBody: { padding: 14, flex: 1, display: "flex", flexDirection: "column" },
  cardName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#3d1a22", lineHeight: 1.3, marginBottom: 5 },
  cardPrice: { fontSize: 15, fontWeight: 500, color: "#c0394b", marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" },
  cardDesc: { fontSize: 12, color: "rgba(61,26,34,0.5)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 },
  tags: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 },
  tagSkin: { background: "#eef2ff", color: "#4338ca", fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 20 },
  tagConcern: { background: "#fff0f3", color: "#9d174d", fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 20 },
  actions: { display: "flex", gap: 8, borderTop: "0.5px solid rgba(61,26,34,0.06)", paddingTop: 12 },
  editBtn: { flex: 1, padding: "8px", background: "rgba(61,26,34,0.04)", border: "0.5px solid rgba(61,26,34,0.12)", borderRadius: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#3d1a22", cursor: "pointer" },
  deleteBtn: { flex: 1, padding: "8px", background: "rgba(192,57,75,0.05)", border: "0.5px solid rgba(192,57,75,0.2)", borderRadius: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#c0394b", cursor: "pointer" },
};

export default ViewProducts;