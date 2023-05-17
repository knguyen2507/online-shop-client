import Navigation from "../components/Navigation.js";
import Title from "../components/Title.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
// api
import { 
    Login,
    ForgotPassord,
    PasswordSendOtp 
} from "../services/userAPI.js";

const title = "Login Page";

function Signin () {
    document.title = title.toUpperCase();

    const [errStatus, setErrStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [modalErrStatus, setModalErrStatus] = useState(false);
    const [modalErrorMsg, setModalErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpStatus, setOtpStatus] = useState(false);

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

    const ShowForm = () => {
        setShowForgot(true)
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();

        const res = await PasswordSendOtp(otp, email, newPassword, repeatPassword);
        
        if (res.code >= 400) {
            setModalErrStatus(true);
            setModalErrorMsg(res.message);
        } else {
            setModalErrStatus(false);
            setModalErrorMsg('');
            setShowForgot(false);
            alert(res.message);
        }
    };

    const submitPassword = async (e) => {
        e.preventDefault();

        const res = await ForgotPassord(email, newPassword, repeatPassword);
        
        if (res.code >= 400) {
            setModalErrStatus(true);
            setModalErrorMsg(res.message);
        } else {
            setModalErrStatus(false);
            setModalErrorMsg('');
            setOtpStatus(true);
        }
    }

    const ResendOtp = async () => {
        alert("OTP has been sent")
        const res = await ForgotPassord(email, newPassword, repeatPassword);

        if (res.code >= 400) {
            setModalErrStatus(true);
            setModalErrorMsg(res.message);
        } else {
            setModalErrStatus(false);
            setModalErrorMsg('');
            setOtpStatus(true);
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

    function ErrorMessage ({msg}) {
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
                <p style={err}>{msg}</p>
            </div>
        )
    }

    return (
        <>
            <Navigation />
            <Title title={title} />
            <Container style={container} >
                <Modal show={showForgot} onHide={() => setShowForgot(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>NEW PASSWORD</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                <form onSubmit={submitPassword}>
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
                                        type="password" 
                                        id="newPassword"
                                        name="newPassword" 
                                        placeholder="New Password"
                                        onChange={e => setNewPassword(e.target.value)}
                                        value={newPassword}
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
                                    <input style={button} type="submit" value="Create New" />
                                </form>
                            </div>
                        }
                        {modalErrStatus ? ErrorMessage({msg: modalErrorMsg}) : true}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowForgot(false)}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
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
                        <p style={{marginLeft: "178px", fontSize: "15px", marginBottom:"2px", color:"blue"}} onClick={ShowForm}><a>Forgot Password</a></p>
                        <span style={{marginLeft: "178px", fontSize: "15px"}}><a href="/register">I don't have an account</a></span>
                        <input style={button} type="submit" value="Login" />
                    </form>
                </div>
                {errStatus && ErrorMessage({msg: errorMsg})}
            </Container>
            <Footer />
        </>
    )
}

export default Signin;