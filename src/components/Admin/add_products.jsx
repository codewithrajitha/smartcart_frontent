// import React, { useState } from "react";
// import axios from "axios";

// const AddProducts = () => {

//     const [productData, setProductData] = useState({
//         name: "",
//         category: "",
//         price: "",
//         image: null,
//         description: "",
//          skinType: "All",
//     skinConcern: "General"
//     });

//     const handleChange = (e) => {

//         if (e.target.name === "image") {

//             setProductData({
//                 ...productData,
//                 image: e.target.files[0]
//             });

//         } else {

//             setProductData({
//                 ...productData,
//                 [e.target.name]: e.target.value
//             });
//         }
//     };

//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         try {

//             const formData = new FormData();

//             formData.append(
//                 "name",
//                 productData.name
//             );

//             formData.append(
//                 "category",
//                 productData.category
//             );

//             formData.append(
//                 "price",
//                 productData.price
//             );

//             formData.append(
//                 "description",
//                 productData.description
//             );

//             formData.append(
//                 "image",
//                 productData.image
//             );
//             formData.append(
//     "skinType",
//     productData.skinType
// );

// formData.append(
//     "skinConcern",
//     productData.skinConcern
// );

//             const response = await axios.post(
//                 "http://localhost:5000/productRoutes/add",
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type":
//                             "multipart/form-data"
//                     }
//                 }
//             );

//             alert(response.data.message);

//             console.log(response.data);

// setProductData({
//     name: "",
//     category: "",
//     price: "",
//     image: null,
//     description: "",
//     skinType: "All",
//     skinConcern: "General"
// });

//         } catch (error) {

//             console.log(error);

//             alert(
//                 error.response?.data?.message ||
//                 "Product Add Failed"
//             );
//         }
//     };

//     return (

//         <div style={styles.container}>

//             <form
//                 style={styles.form}
//                 onSubmit={handleSubmit}
//             >

//                 <h2 style={styles.heading}>
//                     Add Product
//                 </h2>

//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Product Name"
//                     value={productData.name}
//                     onChange={handleChange}
//                     style={styles.input}
//                     required
//                 />

//                 <select
//                     name="category"
//                     value={productData.category}
//                     onChange={handleChange}
//                     style={styles.input}
//                     required
//                 >

//                     <option value="">
//                         Select Category
//                     </option>

//                     <option value="Makeup">
//                         Makeup
//                     </option>

//                     <option value="Skincare">
//                         Skincare
//                     </option>

//                     <option value="Haircare">
//                         Haircare
//                     </option>

//                     <option value="Fragrance">
//                         Fragrance
//                     </option>

//                     <option value="Lipstick">
//                         Lipstick
//                     </option>

//                     <option value="Foundation">
//                         Foundation
//                     </option>

//                     <option value="Face Wash">
//                         Face Wash
//                     </option>

//                     <option value="Serum">
//                         Serum
//                     </option>

//                     <option value="Moisturizer">
//                         Moisturizer
//                     </option>

//                     <option value="Sunscreen">
//                         Sunscreen
//                     </option>

//                 </select>
//                 <select
//     name="skinType"
//     value={productData.skinType}
//     onChange={handleChange}
//     style={styles.input}
// >
//     <option value="All">All Skin Types</option>
//     <option value="Oily">Oily</option>
//     <option value="Dry">Dry</option>
//     <option value="Normal">Normal</option>
//     <option value="Combination">Combination</option>
//     <option value="Sensitive">Sensitive</option>
// </select>

// <select
//     name="skinConcern"
//     value={productData.skinConcern}
//     onChange={handleChange}
//     style={styles.input}
// >
//     <option value="General">General</option>
//     <option value="Acne">Acne</option>
//     <option value="Dark Circles">Dark Circles</option>
//     <option value="Wrinkles">Wrinkles</option>
//     <option value="Dark Spots">Dark Spots</option>
//     <option value="Redness">Redness</option>
//     <option value="Dryness">Dryness</option>
//     <option value="Large Pores">Large Pores</option>
//     <option value="Dullness">Dullness</option>
// </select>

//                 <input
//                     type="number"
//                     name="price"
//                     placeholder="Product Price"
//                     value={productData.price}
//                     onChange={handleChange}
//                     style={styles.input}
//                     required
//                 />

//                 <input
//                     type="file"
//                     name="image"
//                     onChange={handleChange}
//                     style={styles.input}
//                     required
//                 />

//                 <textarea
//                     name="description"
//                     placeholder="Product Description"
//                     value={productData.description}
//                     onChange={handleChange}
//                     style={styles.textarea}
//                     required
//                 />

//                 <button
//                     type="submit"
//                     style={styles.button}
//                 >
//                     Add Product
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
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5"
//     },

//     form: {
//         width: "400px",
//         padding: "30px",
//         backgroundColor: "#ffffff",
//         borderRadius: "10px",
//         boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
//     },

//     heading: {
//         textAlign: "center",
//         marginBottom: "20px"
//     },

//     input: {
//         width: "100%",
//         padding: "12px",
//         marginTop: "15px",
//         border: "1px solid #ccc",
//         borderRadius: "5px"
//     },

//     textarea: {
//         width: "100%",
//         padding: "12px",
//         marginTop: "15px",
//         height: "100px",
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         resize: "none"
//     },

//     button: {
//         width: "100%",
//         padding: "12px",
//         marginTop: "20px",
//         backgroundColor: "black",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer"
//     }
// };

// export default AddProducts;










import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NAV_ITEMS = [
  { label: "Dashboard",      path: "/admin" },
  { label: "Add Product",    path: "/AddProducts" },
  { label: "View All Users", path: "/ViewAllUsers" },
  { label: "View Products",  path: "/ViewProducts" },
  { label: "View Orders",    path: "/ViewOrders" },
];

const AddProducts = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const [productData, setProductData] = useState({
    name: "", category: "", price: "", image: null,
    description: "", skinType: "All", skinConcern: "General",
  });
  const [fileName, setFileName] = useState("Click to upload image");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setProductData({ ...productData, image: e.target.files[0] });
      setFileName(e.target.files[0]?.name || "Click to upload image");
    } else {
      setProductData({ ...productData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([k, v]) => formData.append(k, v));
      const response = await axios.post(
        "http://localhost:5000/productRoutes/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.message);
      setProductData({ name: "", category: "", price: "", image: null,
        description: "", skinType: "All", skinConcern: "General" });
      setFileName("Click to upload image");
    } catch (error) {
      alert(error.response?.data?.message || "Product Add Failed");
    }
  };

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
              <button key={path} style={{ ...s.nb, ...(active ? s.nbActive : {}) }}
                onClick={() => navigate(path)} aria-current={active ? "page" : undefined}>
                {active && <span style={s.activePip} />}
                {label}
              </button>
            );
          })}
        </nav>
        <button style={s.logoutBtn} onClick={() => navigate("/login")}>Logout</button>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>
              Add Product
              <span style={s.newBadge}>New</span>
            </div>
            <div style={s.pageSub}>Fill in the details below to list a new product</div>
          </div>
          {/* <div style={s.avatar}>RA<span style={s.onlineDot} aria-label="Online" /></div> */}
        </div>

        <div style={s.body}>
          <form style={s.card} onSubmit={handleSubmit}>

            {/* Product details */}
            <div style={s.sectionLabel}>Product details</div>

            <div style={s.field}>
              <label style={s.label} htmlFor="pname">Product name</label>
              <input id="pname" name="name" type="text" placeholder="e.g. Rose Glow Serum"
                value={productData.name} onChange={handleChange}
                style={s.input} required />
            </div>

            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label} htmlFor="pcat">Category</label>
                <select id="pcat" name="category" value={productData.category}
                  onChange={handleChange} style={{ ...s.input, ...s.select }} required>
                  <option value="">Select category</option>
                  {["Makeup","Skincare","Haircare","Fragrance","Lipstick",
                    "Foundation","Face Wash","Serum","Moisturizer","Sunscreen"]
                    .map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label} htmlFor="pprice">Price (₹)</label>
                <input id="pprice" name="price" type="number" placeholder="0.00"
                  value={productData.price} onChange={handleChange}
                  style={s.input} required />
              </div>
            </div>

            <div style={s.divider} />
            <div style={s.sectionLabel}>Skin profile</div>

            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label} htmlFor="pskin">Skin type</label>
                <select id="pskin" name="skinType" value={productData.skinType}
                  onChange={handleChange} style={{ ...s.input, ...s.select }}>
                  {["All","Oily","Dry","Normal","Combination","Sensitive"]
                    .map(t => <option key={t} value={t === "All" ? "All" : t}>
                      {t === "All" ? "All Skin Types" : t}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label} htmlFor="pconcern">Skin concern</label>
                <select id="pconcern" name="skinConcern" value={productData.skinConcern}
                  onChange={handleChange} style={{ ...s.input, ...s.select }}>
                  {["General","Acne","Dark Circles","Wrinkles","Dark Spots",
                    "Redness","Dryness","Large Pores","Dullness"]
                    .map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={s.divider} />
            <div style={s.sectionLabel}>Media &amp; description</div>

            <div style={s.field}>
              <label style={s.label}>Product image</label>
              <label htmlFor="pimg" style={s.fileLabel}>
                <span style={{ fontSize: 16, color: "#c0394b" }}>↑</span>
                {fileName}
              </label>
              <input id="pimg" name="image" type="file" accept="image/*"
                onChange={handleChange} style={{ display: "none" }} required />
            </div>

            <div style={{ ...s.field, marginBottom: 0 }}>
              <label style={s.label} htmlFor="pdesc">Description</label>
              <textarea id="pdesc" name="description"
                placeholder="Describe the product — key ingredients, benefits, how to use…"
                value={productData.description} onChange={handleChange}
                style={{ ...s.input, height: 90, resize: "none", lineHeight: 1.6 }}
                required />
            </div>

            <button type="submit" style={s.submitBtn}>Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const s = {
  wrap: {
    display: "flex", minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif", background: "#fdf8f6",
  },
  sidebar: {
    width: 220, flexShrink: 0, background: "#3d1a22",
    display: "flex", flexDirection: "column",
    padding: "28px 0", position: "relative", overflow: "hidden",
  },
  circle1: {
    position: "absolute", top: -60, right: -60, width: 180, height: 180,
    borderRadius: "50%", background: "rgba(192,57,75,0.18)", pointerEvents: "none",
  },
  circle2: {
    position: "absolute", bottom: -40, left: -40, width: 140, height: 140,
    borderRadius: "50%", background: "rgba(192,57,75,0.12)", pointerEvents: "none",
  },
  logoWrap: {
    padding: "0 24px 28px", borderBottom: "0.5px solid rgba(255,255,255,0.1)",
    marginBottom: 16, position: "relative", zIndex: 1,
  },
  logoTitle: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600,
    color: "#fdf8f6", letterSpacing: "0.02em", lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 10, fontWeight: 300, color: "rgba(253,248,246,0.45)",
    letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3,
  },
  nav: {
    display: "flex", flexDirection: "column", gap: 2,
    padding: "0 12px", flex: 1, position: "relative", zIndex: 1,
  },
  nb: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
    background: "transparent", border: "none", borderRadius: 8,
    color: "rgba(253,248,246,0.6)", fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 400, cursor: "pointer", textAlign: "left", position: "relative",
  },
  nbActive: {
    background: "rgba(192,57,75,0.35)", color: "#fdf8f6", fontWeight: 500,
  },
  activePip: {
    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
    width: 3, height: "60%", background: "#c0394b", borderRadius: "0 2px 2px 0",
  },
  logoutBtn: {
    margin: "16px 12px 0", padding: "10px 14px", background: "transparent",
    border: "0.5px solid rgba(192,57,75,0.35)", borderRadius: 8,
    color: "rgba(253,248,246,0.5)", fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, cursor: "pointer", textAlign: "left", position: "relative", zIndex: 1,
  },
  main: { flex: 1, display: "flex", flexDirection: "column", background: "#fdf8f6" },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 28px", borderBottom: "0.5px solid rgba(61,26,34,0.1)", background: "#fff",
  },
  pageTitle: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
    fontWeight: 600, color: "#3d1a22", display: "flex", alignItems: "center", gap: 8,
  },
  newBadge: {
    background: "rgba(192,57,75,0.08)", color: "#c0394b",
    fontSize: 10, fontWeight: 500, padding: "3px 9px",
    borderRadius: 20, letterSpacing: "0.04em",
  },
  pageSub: {
    fontSize: 12, color: "rgba(61,26,34,0.45)", marginTop: 1, fontWeight: 300,
  },
  avatar: {
    width: 36, height: 36, borderRadius: "50%", background: "#c0394b",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "0.04em", position: "relative",
  },
  onlineDot: {
    width: 9, height: 9, borderRadius: "50%", background: "#22c55e",
    border: "2px solid #fff", position: "absolute", bottom: 0, right: 0,
  },
  body: { padding: "24px 28px", flex: 1 },
  card: {
    background: "#fff", borderRadius: 12,
    border: "0.5px solid rgba(61,26,34,0.08)", padding: 28, maxWidth: 560,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: 500, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "rgba(61,26,34,0.4)", marginBottom: 14,
  },
  field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
  label: {
    fontSize: 11, fontWeight: 500, color: "rgba(61,26,34,0.55)",
    letterSpacing: "0.05em", textTransform: "uppercase",
  },
  input: {
    width: "100%", padding: "10px 14px",
    border: "0.5px solid rgba(61,26,34,0.18)", borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#3d1a22",
    background: "#fff", outline: "none",
  },
  select: {
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c0394b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 },
  divider: { height: "0.5px", background: "rgba(61,26,34,0.08)", margin: "18px 0" },
  fileLabel: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
    border: "0.5px dashed rgba(192,57,75,0.4)", borderRadius: 8, cursor: "pointer",
    color: "rgba(61,26,34,0.5)", fontSize: 13,
  },
  submitBtn: {
    width: "100%", padding: 13, background: "#c0394b", color: "#fff", border: "none",
    borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
    fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer", marginTop: 20,
  },
};

export default AddProducts;