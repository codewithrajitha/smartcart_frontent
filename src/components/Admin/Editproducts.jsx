// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     useNavigate,
//     useParams
// } from "react-router-dom";

// const EditProduct = () => {

//     const { id } = useParams();

//     const navigate = useNavigate();

//     const [productData, setProductData] = useState({

//         name: "",
//         category: "",
//         price: "",
//            image: "",
//         description: "",
//             skinType: "All",
//     skinConcern: "General"
//     });

//     // Fetch Existing Product
//     useEffect(() => {

//         fetchSingleProduct();

//     }, []);

//     const fetchSingleProduct = async () => {

//         try {

//             const response = await axios.get(
//                 `http://localhost:5000/productRoutes/getSingleProduct/${id}`
//             );
//             console.log(response.data);
//             setProductData(response.data);

//         } catch (error) {

//             console.log(error);
//         }
//     };

//     // Handle Input Change
//     const handleChange = (e) => {

//     setProductData({

//         ...productData,

//         [e.target.name]: e.target.value
//     });
// };

//     const handleFileChange = (e) => {

//     setProductData({

//         ...productData,

//         image: e.target.files[0]
//     });
// };
//     // Update Product
//    const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//         const formData = new FormData();

//         formData.append("name", productData.name);

//         formData.append("category", productData.category);

//         formData.append("price", productData.price);

//         formData.append("description", productData.description);
//         formData.append(
//     "skinType",
//     productData.skinType
// );

// formData.append(
//     "skinConcern",
//     productData.skinConcern
// );

//         // Append image only if new image selected
//         if (
//             productData.image &&
//             typeof productData.image !== "string"
//         ) {

//             formData.append(
//                 "image",
//                 productData.image
//             );
//         }

//         const response = await axios.put(

//             `http://localhost:5000/productRoutes/updateProduct/${id}`,

//             formData,

//             {
//                 headers: {
//                     "Content-Type":
//                         "multipart/form-data"
//                 }
//             }
//         );

//         alert(response.data.message);

//         navigate("/ViewProducts");

//     } catch (error) {

//         console.log(error);

//         alert("Update Failed");
//     }
// };

//     return (

//         <div style={styles.container}>

//             <form
//                 style={styles.form}
//                 onSubmit={handleSubmit}
//             >

//                 <h2 style={styles.heading}>
//                     Edit Product
//                 </h2>

//                 {/* Product Name */}

//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Product Name"
//                     value={productData.name}
//                     onChange={handleChange}
//                     style={styles.input}
//                     required
//                 />

//                 {/* Category */}

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

//                 {/* Price */}

//                 <input
//                     type="number"
//                     name="price"
//                     placeholder="Product Price"
//                     value={productData.price}
//                     onChange={handleChange}
//                     style={styles.input}
//                     required
//                 />

//                 {
//     productData.image && (

//         <img
//             src={`http://localhost:5000/uploads/${productData.image}`}
//             alt="product"
//             style={styles.image}
//         />
//     )
// }
// <input
//     type="file"
//     name="image"
//     accept="image/*"
//     onChange={handleFileChange}
//     style={styles.input}
// />

//                 {/* Description */}

//                 <textarea
//                     name="description"
//                     placeholder="Product Description"
//                     value={productData.description}
//                     onChange={handleChange}
//                     style={styles.textarea}
//                     required
//                 />


//                 {/* Submit Button */}

//                 <button
//                     type="submit"
//                     style={styles.button}
//                 >
//                     Update Product
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
//         boxShadow:
//             "0px 0px 10px rgba(0,0,0,0.1)"
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
//         height: "100px",
//         padding: "12px",
//         marginTop: "15px",
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         resize: "none"
//     },
//     image: {
//     width: "150px",
//     height: "150px",
//     objectFit: "cover",
//     borderRadius: "10px",
//     marginTop: "15px",
//     border: "1px solid #ccc"
// },
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

// export default EditProduct;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard",      path: "/admin" },
  { label: "Add Product",    path: "/AddProducts" },
  { label: "View All Users", path: "/ViewAllUsers" },
  { label: "View Products",  path: "/ViewProducts" },
  { label: "View Orders",    path: "/ViewOrders" },
];

const CATEGORIES = ["Makeup","Skincare","Haircare","Fragrance","Lipstick",
  "Foundation","Face Wash","Serum","Moisturizer","Sunscreen"];
const SKIN_TYPES = ["All","Oily","Dry","Normal","Combination","Sensitive"];
const SKIN_CONCERNS = ["General","Acne","Dark Circles","Wrinkles","Dark Spots",
  "Redness","Dryness","Large Pores","Dullness"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const [productData, setProductData] = useState({
    name: "", category: "", price: "", image: "",
    description: "", skinType: "All", skinConcern: "General",
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => { fetchSingleProduct(); }, []);

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get(
        `https://smartcart-server-7qs4.onrender.com/productRoutes/getSingleProduct/${id}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductData({ ...productData, image: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("category", productData.category);
      formData.append("price", productData.price);
      formData.append("description", productData.description);
      formData.append("skinType", productData.skinType);
      formData.append("skinConcern", productData.skinConcern);
      if (productData.image && typeof productData.image !== "string") {
        formData.append("image", productData.image);
      }
      const response = await axios.put(
        `https://smartcart-server-7qs4.onrender.com/productRoutes/updateProduct/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.message);
      navigate("/ViewProducts");
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  const existingImageUrl = typeof productData.image === "string" && productData.image
    ? `https://smartcart-server-7qs4.onrender.com/uploads/${productData.image}`
    : null;
  const displayImage = previewUrl || existingImageUrl;

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
            const active = currentPath.startsWith("/ViewProducts") || currentPath.startsWith("/EditProduct")
              ? path === "/ViewProducts"
              : currentPath === path;
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
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>
              Edit Product
              <span style={s.editBadge}>Editing</span>
            </div>
            <div style={s.pageSub}>
              {productData.name || "Loading…"}&nbsp;·&nbsp;
              <span style={{ fontFamily: "monospace", fontSize: 11 }}>#{id?.slice(-6)}</span>
            </div>
          </div>
          <div style={s.avatar}>RA<span style={s.onlineDot} aria-label="Online" /></div>
        </div>

        <div style={s.body}>
          <form style={s.card} onSubmit={handleSubmit}>

            {/* Image preview column */}
            <div style={s.previewCol}>
              <div style={s.imgFrame}>
                {displayImage
                  ? <img src={displayImage} alt="product preview" style={s.previewImg} />
                  : <span style={s.imgPlaceholder}>No image</span>
                }
              </div>
              <label htmlFor="ep-file" style={s.changeLabel}>
                <span style={{ color: "#c0394b", fontSize: 14 }}>↑</span>
                Change image
              </label>
              <input id="ep-file" type="file" accept="image/*"
                onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            {/* Fields column */}
            <div style={s.formCol}>
              <div style={s.sectionLabel}>Product details</div>

              <div style={s.field}>
                <label style={s.label} htmlFor="ename">Product name</label>
                <input id="ename" name="name" type="text"
                  value={productData.name} onChange={handleChange}
                  style={s.input} required />
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label} htmlFor="ecat">Category</label>
                  <select id="ecat" name="category"
                    value={productData.category} onChange={handleChange}
                    style={{ ...s.input, ...s.select }} required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label} htmlFor="eprice">Price (₹)</label>
                  <input id="eprice" name="price" type="number"
                    value={productData.price} onChange={handleChange}
                    style={s.input} required />
                </div>
              </div>

              <div style={s.divider} />
              <div style={s.sectionLabel}>Skin profile</div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label} htmlFor="eskin">Skin type</label>
                  <select id="eskin" name="skinType"
                    value={productData.skinType} onChange={handleChange}
                    style={{ ...s.input, ...s.select }}>
                    {SKIN_TYPES.map(t => (
                      <option key={t} value={t}>{t === "All" ? "All Skin Types" : t}</option>
                    ))}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label} htmlFor="econcern">Skin concern</label>
                  <select id="econcern" name="skinConcern"
                    value={productData.skinConcern} onChange={handleChange}
                    style={{ ...s.input, ...s.select }}>
                    {SKIN_CONCERNS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={s.divider} />
              <div style={s.sectionLabel}>Description</div>

              <div style={{ ...s.field, marginBottom: 0 }}>
                <label style={s.label} htmlFor="edesc">Product description</label>
                <textarea id="edesc" name="description"
                  value={productData.description} onChange={handleChange}
                  style={{ ...s.input, height: 80, resize: "none", lineHeight: 1.6 }}
                  required />
              </div>

              <div style={s.actions}>
                <button type="button" style={s.cancelBtn}
                  onClick={() => navigate("/ViewProducts")}>
                  Cancel
                </button>
                <button type="submit" style={s.saveBtn}>Update Product</button>
              </div>
            </div>

          </form>
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
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#3d1a22", display: "flex", alignItems: "center", gap: 8 },
  editBadge: { background: "rgba(245,158,11,0.1)", color: "#b45309", fontSize: 10, fontWeight: 500, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif" },
  pageSub: { fontSize: 12, color: "rgba(61,26,34,0.45)", marginTop: 1, fontWeight: 300 },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#c0394b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#fff", position: "relative" },
  onlineDot: { width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff", position: "absolute", bottom: 0, right: 0 },
  body: { padding: "24px 28px", flex: 1 },
  card: { background: "#fff", borderRadius: 12, border: "0.5px solid rgba(61,26,34,0.08)", padding: 28, maxWidth: 640, display: "flex", gap: 24 },
  previewCol: { flexShrink: 0, width: 140 },
  imgFrame: { width: 140, height: 140, borderRadius: 10, overflow: "hidden", border: "0.5px solid rgba(61,26,34,0.1)", background: "#f5e8ea", display: "flex", alignItems: "center", justifyContent: "center" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imgPlaceholder: { fontSize: 12, color: "rgba(61,26,34,0.3)" },
  changeLabel: { display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 10, padding: 7, border: "0.5px dashed rgba(192,57,75,0.4)", borderRadius: 8, cursor: "pointer", color: "rgba(61,26,34,0.45)", fontSize: 11 },
  formCol: { flex: 1, minWidth: 0 },
  sectionLabel: { fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(61,26,34,0.4)", marginBottom: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 500, color: "rgba(61,26,34,0.55)", letterSpacing: "0.05em", textTransform: "uppercase" },
  input: { width: "100%", padding: "9px 13px", border: "0.5px solid rgba(61,26,34,0.18)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#3d1a22", background: "#fff", outline: "none" },
  select: { appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c0394b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  divider: { height: "0.5px", background: "rgba(61,26,34,0.08)", margin: "12px 0" },
  actions: { display: "flex", gap: 10, marginTop: 16 },
  cancelBtn: { padding: "11px 18px", background: "transparent", border: "0.5px solid rgba(61,26,34,0.18)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(61,26,34,0.55)", cursor: "pointer" },
  saveBtn: { flex: 1, padding: 11, background: "#c0394b", color: "#fff", border: "none", borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer" },
};

export default EditProduct;