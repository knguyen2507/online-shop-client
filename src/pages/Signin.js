import Navigation from "../components/Navigation.js";
import Title from "../components/Title.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import { useState } from "react";
import { Login } from "../services/userAPI.js";
import Cookies from 'js-cookie';

const title = "Login Page";

function Signin () {
    document.title = title.toUpperCase();

    const [errStatus, setErrStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await Login(username, password);
        
        if (res.code >= 400) {
            setErrStatus(true);
            setErrorMsg(res.message);
        } else {
            setErrStatus(false);
            setErrorMsg('');
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('nameUser', res.user.name);
            localStorage.setItem('idUser', res.user._id);
            localStorage.setItem('role', res.user.role);
            Cookies.set('refreshToken', res.refreshToken, {
                expires: 365
            });
            window.location.href = '/';
        }
    };

    const container = {
        borderRadius: "5px",
        padding: "20px"
    };

    const div = {
        margin: "auto",
        borderRadius: "5px",
        backgroundColor: "#f2f2f2",
        padding: "20px",
        width: "400px",
        marginBottom: "20px"
    }

    const input = {
        width: "300px",
        height: "40px",
        display: "block",
        margin: "auto",
        marginBottom: "10px"
    };

    const button = {
        width: "100px",
        height: "40px",
        display: "block",
        margin: "auto",
        backgroundColor: "MediumSeaGreen",
        border: "1px solid white",
        borderRadius: "5px"
    }

    function ErrorMessage () {
        const errDiv = {
            margin: "auto",
            borderRadius: "5px",
            backgroundColor: "crimson",
            padding: "20px",
            width: "300px",
            height: "60px",
            marginBottom: "20px"
        }

        const err = {
            textAlign: "center",
            margin: "auto",
            color: "white",
            fontSize: "15px"
        };

        return (
            <div style={errDiv}>
                <p style={err}>{errorMsg}</p>
            </div>
        )
    }

    return (
        <>
            <Navigation />
            <Title title={title} />
            <Container style={container} >
                <div style={div}>
                    <form onSubmit={handleSubmit}>
                        <input 
                            style={input} 
                            type="text" 
                            name="username" 
                            placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                        />
                        <input 
                            style={input} 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span style={{marginLeft: "178px", fontSize: "15px"}}><a href="/register">I don't have an account</a></span>
                        <input style={button} type="submit" value="Login" />
                    </form>
                </div>
                {errStatus && ErrorMessage()}
            </Container>
            <Footer />
        </>
    )
}

export default Signin;