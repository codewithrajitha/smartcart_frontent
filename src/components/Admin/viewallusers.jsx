// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const ViewAllUsers = () => {
// //     const [users, setUsers] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         fetchUsers();
// //     }, []);

// //     const fetchUsers = async () => {
// //         try {
// //             setLoading(true);
// //             setError(null);

// //             const response = await axios.get('http://localhost:5000/users/getAllUsers');
            
// //             setUsers(response.data.data || response.data);
// //         } catch (err) {
// //             console.error('Error fetching users:', err);
// //             setError(
// //                 err.response?.data?.message || 
// //                 'Failed to fetch users. Please try again later.'
// //             );
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex justify-center items-center h-96">
// //                 <div className="flex flex-col items-center">
// //                     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
// //                     <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className="flex justify-center items-center h-96">
// //                 <div className="text-center">
// //                     <div className="text-red-500 text-xl mb-3">⚠️</div>
// //                     <p className="text-red-600 font-medium">{error}</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="p-8 max-w-7xl mx-auto">
// //             {/* Header */}
// //             <div className="flex justify-between items-center mb-8">
// //                 <div>
// //                     <h1 className="text-4xl font-bold text-gray-900">All Users</h1>
// //                     <p className="text-gray-600 mt-1">View and manage all registered users</p>
// //                 </div>
// //                 <button
// //                     onClick={fetchUsers}
// //                     className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
// //                 >
// //                     <span>↻</span> Refresh
// //                 </button>
// //             </div>

// //             {/* Table Container */}
// //             <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
// //                 <table className="min-w-full">
// //                     <thead>
// //                         <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
// //                             <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
// //                             <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
// //                             <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
// //                             <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody className="divide-y divide-gray-100">
// //                         {users.length === 0 ? (
// //                             <tr>
// //                                 <td colSpan="4" className="px-6 py-20 text-center text-gray-500 text-lg">
// //                                     No users found.
// //                                 </td>
// //                             </tr>
// //                         ) : (
// //                             users.map((user) => (
// //                                 <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
// //                                     <td className="px-8 py-5 whitespace-nowrap">
// //                                         <div className="font-semibold text-gray-900 text-lg">{user.name}</div>
// //                                     </td>
// //                                     <td className="px-8 py-5 whitespace-nowrap text-gray-600">{user.email}</td>
// //                                     <td className="px-8 py-5 whitespace-nowrap">
// //                                         <span className={`inline-flex px-5 py-2 text-sm font-semibold rounded-2xl ${
// //                                             user.role === 'ADMIN' 
// //                                                 ? 'bg-purple-100 text-purple-700' 
// //                                                 : 'bg-emerald-100 text-emerald-700'
// //                                         }`}>
// //                                             {user.role}
// //                                         </span>
// //                                     </td>
// //                                     <td className="px-8 py-5 whitespace-nowrap text-gray-600">
// //                                         {new Date(user.createdAt).toLocaleDateString()}
// //                                     </td>
// //                                 </tr>
// //                             ))
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>

// //             {/* Footer Info */}
// //             <div className="text-center text-sm text-gray-500 mt-6">
// //                 Total Users: <span className="font-semibold text-gray-700">{users.length}</span>
// //             </div>
// //         </div>
// //     );
// // };

// // export default ViewAllUsers;




// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ViewAllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const result = users.filter(
//       (user) =>
//         user.name?.toLowerCase().includes(search.toLowerCase()) ||
//         user.email?.toLowerCase().includes(search.toLowerCase())
//     );

//     setFilteredUsers(result);
//   }, [search, users]);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/users/getAllUsers"
//       );

//       const data = response.data.data || response.data;

//       setUsers(data);
//       setFilteredUsers(data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex justify-center items-center bg-gray-100">
//         <div className="text-center">
//           <div className="h-14 w-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">
//             Loading Users...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}

//       <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl mb-8">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold">User Management</h1>
//             <p className="mt-2 text-blue-100">
//               Manage and monitor all registered users
//             </p>
//           </div>

//           <button
//             onClick={fetchUsers}
//             className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
//           >
//             Refresh Users
//           </button>
//         </div>
//       </div>

//       {/* Stats */}

//       <div className="grid md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-3xl shadow-lg p-6">
//           <h3 className="text-gray-500">Total Users</h3>
//           <h1 className="text-4xl font-bold text-blue-600 mt-2">
//             {users.length}
//           </h1>
//         </div>

//         <div className="bg-white rounded-3xl shadow-lg p-6">
//           <h3 className="text-gray-500">Admins</h3>
//           <h1 className="text-4xl font-bold text-purple-600 mt-2">
//             {users.filter((u) => u.role === "ADMIN").length}
//           </h1>
//         </div>

//         <div className="bg-white rounded-3xl shadow-lg p-6">
//           <h3 className="text-gray-500">Users</h3>
//           <h1 className="text-4xl font-bold text-green-600 mt-2">
//             {users.filter((u) => u.role !== "ADMIN").length}
//           </h1>
//         </div>
//       </div>

//       {/* Search */}

//       <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search users by name or email..."
//           className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Table */}

//       <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 text-gray-600">
//                 <th className="p-5 text-left">User</th>
//                 <th className="p-5 text-left">Email</th>
//                 <th className="p-5 text-left">Role</th>
//                 <th className="p-5 text-left">Created</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((user) => (
//                   <tr
//                     key={user._id}
//                     className="border-t hover:bg-gray-50 transition"
//                   >
//                     <td className="p-5">
//                       <div className="flex items-center gap-3">
//                         <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold">
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>

//                         <div>
//                           <h4 className="font-semibold text-gray-800">
//                             {user.name}
//                           </h4>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-5 text-gray-600">{user.email}</td>

//                     <td className="p-5">
//                       <span
//                         className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                           user.role === "ADMIN"
//                             ? "bg-purple-100 text-purple-700"
//                             : "bg-green-100 text-green-700"
//                         }`}
//                       >
//                         {user.role}
//                       </span>
//                     </td>

//                     <td className="p-5 text-gray-600">
//                       {new Date(user.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="text-center py-12 text-gray-500"
//                   >
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewAllUsers;















import React, { useState, useEffect } from "react";
import axios from "axios";

// ─── FONT INJECTION ──────────────────────────────────────────────────────────
if (typeof document !== "undefined") {
  const id = "smartcart-admin-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }
}

// ─── AVATAR COLOR MAP ────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  ["#c0394b", "#e07080"],
  ["#a07850", "#c9a87a"],
  ["#5a3e6b", "#9b74b8"],
  ["#d4826a", "#f0aa90"],
  ["#3d7a6b", "#60b8a5"],
  ["#2a5c8a", "#4e8fc4"],
];
const avatarGradient = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  const [a, b] = AVATAR_GRADIENTS[idx];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...s.statCard,
        borderColor: hovered ? accent : "#f0e4e6",
        boxShadow: hovered
          ? `0 8px 28px ${accent}28`
          : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...s.statIconWrap, background: accent + "18" }}>
        <span style={{ fontSize: "22px" }}>{icon}</span>
      </div>
      <div>
        <p style={s.statLabel}>{label}</p>
        <p style={{ ...s.statValue, color: accent }}>{value}</p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const ViewAllUsers = () => {
  const [users, setUsers]               = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("ALL");
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [visible, setVisible]           = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let result = users;
    if (search.trim()) {
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter !== "ALL") {
      result = result.filter((u) =>
        roleFilter === "ADMIN" ? u.role === "ADMIN" : u.role !== "ADMIN"
      );
    }
    setFilteredUsers(result);
  }, [search, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("http://localhost:5000/users/getAllUsers");
      const data = response.data.data || response.data;
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div style={s.loadingScreen}>
        <div style={s.loadingInner}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Loading users…</p>
        </div>
      </div>
    );
  }

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount  = users.filter((u) => u.role !== "ADMIN").length;

  // ── RENDER ──
  return (
    <div style={s.root}>

      {/* ── HEADER BANNER ── */}
      <div
        style={{
          ...s.banner,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* decorative circles */}
        <div style={s.bannerCircle1} />
        <div style={s.bannerCircle2} />

        <div style={s.bannerContent}>
          <div>
            <p style={s.bannerEyebrow}>SmartCart Beauty · Admin</p>
            <h1 style={s.bannerTitle}>User Management</h1>
            <p style={s.bannerSub}>Monitor and manage all registered customers & admins</p>
          </div>
          <button
            style={{
              ...s.refreshBtn,
              opacity: refreshing ? 0.7 : 1,
            }}
            onClick={fetchUsers}
            disabled={refreshing}
            onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f4")}
            onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
          >
            <span style={{ display: "inline-block", animation: refreshing ? "spin 0.8s linear infinite" : "none" }}>
              ↻
            </span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div style={s.body}>

        {/* ── STAT CARDS ── */}
        <div
          style={{
            ...s.statsRow,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          <StatCard label="Total Users"  value={users.length} icon="👥" accent="#c0394b" />
          {/* <StatCard label="Admins"       value={adminCount}   icon="🛡️" accent="#5a3e6b" /> */}
          <StatCard label="Customers"    value={userCount}    icon="🌸" accent="#a07850" />
        </div>

        {/* ── SEARCH + FILTER BAR ── */}
        <div
          style={{
            ...s.toolbar,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s",
          }}
        >
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button style={s.clearBtn} onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <div style={s.filterGroup}>
            {["ALL", "USER"].map((role) => (
              <button
                key={role}
                style={{
                  ...s.filterBtn,
                  background: roleFilter === role ? "#c0394b" : "transparent",
                  color: roleFilter === role ? "#fff" : "#7a4050",
                  borderColor: roleFilter === role ? "#c0394b" : "#f0e4e6",
                }}
                onClick={() => setRoleFilter(role)}
              >
                {role === "ALL" ? "All" : role === "User" ? "🛡️ User" : "🌸 User"}
              </button>
            ))}
          </div>

          <div style={s.resultCount}>
            <span style={s.resultNum}>{filteredUsers.length}</span>
            <span style={s.resultLabel}> result{filteredUsers.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div
          style={{
            ...s.tableWrap,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease 0.26s, transform 0.6s ease 0.26s",
          }}
        >
          <div style={s.tableScroll}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["User", "Email", "Role", "Joined"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={s.emptyCell}>
                      <div style={s.emptyInner}>
                        <span style={{ fontSize: "36px" }}>🌸</span>
                        <p style={s.emptyText}>No users found</p>
                        <p style={s.emptySub}>Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <TableRow key={user._id} user={user} idx={idx} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FOOTER COUNT ── */}
        {filteredUsers.length > 0 && (
          <p style={s.footNote}>
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinnerAnim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ─── TABLE ROW ───────────────────────────────────────────────────────────────
function TableRow({ user, idx }) {
  const [hovered, setHovered] = useState(false);
  const isAdmin = user.role === "ADMIN";

  return (
    <tr
      style={{
        background: hovered ? "#fdf8f6" : idx % 2 === 0 ? "#ffffff" : "#fdfaf9",
        transition: "background 0.15s",
        borderBottom: "1px solid #fdf0f2",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* User */}
      <td style={s.td}>
        <div style={s.userCell}>
          <div style={{ ...s.avatar, background: avatarGradient(user.name) }}>
            {user.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div style={s.userName}>{user.name}</div>
            <div style={s.userHandle}>#{user._id?.slice(-6)}</div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td style={s.td}>
        <span style={s.emailText}>{user.email}</span>
      </td>

      {/* Role */}
      <td style={s.td}>
        <span style={{
          ...s.roleBadge,
          background: isAdmin ? "#f3eef8" : "#fde8ec",
          color:      isAdmin ? "#5a3e6b" : "#a0293a",
          borderColor: isAdmin ? "#d4bce8" : "#f5c0cc",
        }}>
          {isAdmin ? "🛡️ Admin" : "🌸 Customer"}
        </span>
      </td>

      {/* Joined */}
      <td style={s.td}>
        <div style={s.dateWrap}>
          <span style={s.dateText}>
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  root: {
    minHeight: "100vh",
    background: "#fdf8f6",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#1a0a0d",
  },

  // LOADING
  loadingScreen: {
    minHeight: "100vh",
    background: "#fdf8f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  loadingInner: {
    textAlign: "center",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "3px solid #f0e4e6",
    borderTop: "3px solid #c0394b",
    borderRadius: "50%",
    animation: "spinnerAnim 0.8s linear infinite",
    margin: "0 auto",
  },
  loadingText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#b08090",
    fontWeight: "600",
  },

  // BANNER
  banner: {
    background: "linear-gradient(135deg, #3d1a22 0%, #6b2535 55%, #a0293a 100%)",
    padding: "36px 40px 40px",
    position: "relative",
    overflow: "hidden",
  },
  bannerCircle1: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    pointerEvents: "none",
  },
  bannerCircle2: {
    position: "absolute",
    bottom: "-40px",
    right: "160px",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    pointerEvents: "none",
  },
  bannerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
    position: "relative",
    zIndex: 1,
  },
  bannerEyebrow: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#f5c0cc",
    marginBottom: "8px",
  },
  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: "600",
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  bannerSub: {
    fontSize: "14px",
    color: "#f5d0d8",
    margin: 0,
    fontWeight: "400",
  },
  refreshBtn: {
    background: "#ffffff",
    color: "#a0293a",
    border: "none",
    borderRadius: "100px",
    padding: "12px 24px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },

  // BODY
  body: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px 48px",
  },

  // STATS
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#ffffff",
    border: "1.5px solid #f0e4e6",
    borderRadius: "18px",
    padding: "20px 22px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "default",
    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
  },
  statIconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: "12px",
    color: "#b08090",
    fontWeight: "600",
    letterSpacing: "0.3px",
    margin: "0 0 4px",
    textTransform: "uppercase",
  },
  statValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "34px",
    fontWeight: "600",
    lineHeight: 1,
    margin: 0,
  },

  // TOOLBAR
  toolbar: {
    background: "#ffffff",
    border: "1.5px solid #f0e4e6",
    borderRadius: "16px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fdf8f6",
    border: "1px solid #f0e4e6",
    borderRadius: "100px",
    padding: "9px 16px",
  },
  searchIcon: { fontSize: "13px", flexShrink: 0 },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "13.5px",
    color: "#1a0a0d",
    fontFamily: "'DM Sans', sans-serif",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#b08090",
    padding: "0 2px",
    flexShrink: 0,
  },
  filterGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterBtn: {
    border: "1.5px solid",
    borderRadius: "100px",
    padding: "7px 16px",
    fontSize: "12.5px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  resultCount: {
    flexShrink: 0,
    marginLeft: "auto",
  },
  resultNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: "600",
    color: "#c0394b",
  },
  resultLabel: {
    fontSize: "13px",
    color: "#b08090",
    fontWeight: "600",
  },

  // TABLE
  tableWrap: {
    background: "#ffffff",
    border: "1.5px solid #f0e4e6",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(192,57,75,0.06)",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "700",
    color: "#b08090",
    letterSpacing: "1px",
    textTransform: "uppercase",
    background: "#fdf8f6",
    borderBottom: "1px solid #f0e4e6",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 20px",
    verticalAlign: "middle",
  },

  // USER CELL
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  userName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a0a0d",
    lineHeight: 1.2,
  },
  userHandle: {
    fontSize: "11px",
    color: "#c0a0a8",
    fontWeight: "500",
    marginTop: "2px",
  },

  emailText: {
    fontSize: "13.5px",
    color: "#7a4050",
    fontWeight: "500",
  },

  // ROLE BADGE
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "5px 12px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid",
    letterSpacing: "0.2px",
  },

  dateWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dateText: {
    fontSize: "13px",
    color: "#b08090",
    fontWeight: "500",
  },

  // EMPTY
  emptyCell: {
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  emptyText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a0a0d",
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
  },
  emptySub: {
    fontSize: "13px",
    color: "#b08090",
    margin: 0,
  },

  footNote: {
    textAlign: "center",
    fontSize: "13px",
    color: "#c0a0a8",
    marginTop: "20px",
    fontWeight: "500",
  },
};

export default ViewAllUsers;