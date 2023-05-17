import Navigation from "../components/Navigation.js";
import Title from "../components/Title.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import { useState } from "react";
import { 
    Register,
    RegisterSendOtp 
} from "../services/userAPI.js";

const title = "Register Page";

function Signup () {
    document.title = title.toUpperCase();

    const [errStatus, setErrStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [status, setStatus] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpStatus, setOtpStatus] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await Register(username, password, email, name, repeatPassword);
        
        if (res.code >= 400) {
            setErrStatus(true);
            setErrorMsg(res.message);
        } else {
            setErrStatus(false);
            setErrorMsg('');
            setOtpStatus(true);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        const res = await RegisterSendOtp(otp, username, password, email, name);
        
        if (res.code >= 400) {
            setErrStatus(true);
            setErrorMsg(res.message);
        } else {
            setErrStatus(false);
            setErrorMsg('');
            setStatus(true);
            setOtpStatus(false);
        }
    };

    const ResendOtp = async () => {
        const res = await Register(username, password, email, name, repeatPassword);
        
        if (res.code >= 400) {
            setErrStatus(true);
            setErrorMsg(res.message);
        } else {
            setErrStatus(false);
            setErrorMsg('');
            setOtpStatus(true);
            setPassword('');
            setRepeatPassword('');
            alert("OTP has been sent")
        }
    }

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

    function SuccessMessage () {
        const successDiv = {
            margin: "auto",
            borderRadius: "5px",
            backgroundColor: "#14A44D",
            padding: "20px",
            width: "300px",
            height: "80px",
            marginBottom: "20px"
        }

        const success = {
            textAlign: "center",
            margin: "auto",
            color: "white",
            fontSize: "15px"
        };

        return (
            <div style={successDiv}>
                <p style={success}>Your account has been successfully created</p>
            </div>
        )
    }

    return (
        <>
            <Navigation />
            <Title title={title} />
            <Container style={container} >
                {
                    otpStatus ?
                    <div style={div}>
                        <form onSubmit={handleSendOtp}>
                            <input 
                                style={input} 
                                type="text" 
                                id="otp"
                                name="otp" 
                                placeholder="Otp"
                                onChange={e => setOtp(e.target.value)}
                                value={otp}
                            />
                            <p onClick={ResendOtp}><a>Resend OTP</a></p>
                            <input style={button} type="submit" value="Send OTP" />
                        </form>
                    </div> :
                    <div style={div}>
                        <form onSubmit={handleSubmit}>
                            <input 
                                style={input} 
                                type="text" 
                                id="name"
                                name="name" 
                                placeholder="Name"
                                onChange={e => setName(e.target.value)}
                                value={name}
                            />
                            <input 
                                style={input} 
                                type="text" 
                                id="email"
                                name="email" 
                                placeholder="Email"
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                            <input 
                                style={input} 
                                type="text" 
                                id="username"
                                name="username" 
                                placeholder="Username"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                            />
                            <input 
                                style={input} 
                                type="password" 
                                id="password"
                                name="password" 
                                placeholder="Password"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                            />
                            <input 
                                style={input} 
                                type="password" 
                                id="re-password"
                                name="re-password" 
                                placeholder="Repeat Password"
                                onChange={e => setRepeatPassword(e.target.value)}
                                value={repeatPassword}
                            />
                            <span style={{marginLeft: "178px", fontSize: "15px"}}><a href="/login">I already have an account</a></span>
                            <input style={button} type="submit" value="Register" />
                        </form>
                    </div>
                }
                {errStatus ? ErrorMessage() : (status ? SuccessMessage() : true)}
            </Container>
            <Footer />
        </>
    )
}

export default Signup;