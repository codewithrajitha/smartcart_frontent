import React, { useState } from "react";
import axios from "axios";

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const response = await axios.post(
                "https://smartcart-server-7qs4.onrender.com/users/register",
                formData
            );

            alert(response.data.message);

            console.log(response.data);
    };

    return (

        <div style={styles.container}>

            <form style={styles.form} onSubmit={handleSubmit}>

                <h2>Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.button}>
                    Register
                </button>

            </form>

        </div>
    );
};

const styles = {

    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5"
    },

    form: {
        width: "350px",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
    },

    input: {
        width: "100%",
        padding: "12px",
        marginTop: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },

    button: {
        width: "100%",
        padding: "12px",
        marginTop: "20px",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default Register;