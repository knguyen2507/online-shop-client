import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// firebase
import { firebase } from '../services/firebase';
// api
import {
    RefreshToken
} from '../services/userAPI.js';
import { 
    GetHistoryPaymentsByIdUser
} from "../services/paymentAPI.js";

const title = "Payment History";

function HistoryPayment () {
    const {id} = useParams();
    const [carts, setCarts] = useState({});
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showView, setShowView] = useState(false);
    const [cartView, setCartView] = useState([]);
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const getPayment = async () => {
            const res = await GetHistoryPaymentsByIdUser({id});
            if (res.code >= 400 && res.message !== 'jwt expired') {
                setError(true);
                setErrorMsg(res.message);
            } else if (res.code >= 400 && res.message === 'jwt expired') {
                const response = await RefreshToken();
                if (response.code >= 400) {
                    alert(response.message);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('idUser');
                    localStorage.removeItem('nameUser');
                    localStorage.removeItem('role');
                    Cookies.remove('refreshToken');
                } else {
                    const accessToken = response.accessToken;
                    localStorage.setItem('accessToken', accessToken);
                    const resp = await GetHistoryPaymentsByIdUser({id});
                    setError(false);
                    setCarts(resp.metadata);
                }
            } else {
                setError(false);
                setCarts(res.metadata);
            }
        }
        getPayment();
    }, []);

    useEffect(() => {
        const getUrls = async () => {
            if (process.env.REACT_APP_ENV === 'pro' && carts.length > 0) {
                const app = firebase();
                const storage = getStorage(app);
                const dict = {};
                for (let cart of carts) {
                    for (let product of cart.carts) {
                        const url = await getDownloadURL(ref(storage, product.image));
                        dict[product.image.toString()] = url
                    }
                }
                setUrls(dict)
            } else {
                return true
            }
        };
        getUrls();
    }, [carts])

    const TotalPrice = (cart) => {
        let total = 0;
        for (let c of cart) {
            total = total + c.price*c.qty;
        }
        return total;
    }

    const TotalQty = (cart) => {
        let total = 0;
        for (let c of cart) {
            total = total + c.qty;
        }
        return total;
    }

    function PaginatedItems (properties) {
        const carts = properties.carts || []
        if (carts.length > 0) {
            return (
                <>
                    {carts.map(cart => (
                        <Row style={{borderBottom: "solid 2px"}}>
                            <Col xs={9} md={6}>{cart._id}</Col>
                            <Col xs={3} md={2}>{TotalQty(cart.carts)}</Col>
                            <Col xs={3} md={2}>{TotalPrice(cart.carts)}</Col>
                            <Col xs={3} md={2}>
                                <Button 
                                    variant="info"
                                    style={{
                                        fontSize: "10px",
                                        height: "50px",
                                        width: "130px"
                                    }}
                                    onClick={() => {
                                        setShowView(true)
                                        setCartView(cart.carts)
                                    }}
                                >View</Button>
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        return (
            <p>Haven't bought any products yet</p>
        )
    }      

    if (error) {
        return (
            <>
                <p>{errorMsg}</p>
                <p><a href='/'>Back to Home Page</a></p>
            </>
        )
    }

    return (
        <>
            <Navigation />
            <Container>
            <Modal show={showView} onHide={() => setShowView(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>VIEW</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {cartView.map(product => (
                            <div style={{borderBottom: "solid 2px"}}>
                                <p>Name: {product.name}</p>
                                <p>Qty: {product.qty}</p>
                                <p>Price: {product.price}</p>
                                {process.env.REACT_APP_ENV === 'pro' ? 
                                    <img 
                                        width="100" 
                                        height="100"
                                        style={{marginTop: "10px"}}
                                        src={urls[product.image]} 
                                        alt='image product'
                                    /> :
                                    <img 
                                        width="100" 
                                        height="100"
                                        style={{marginTop: "10px"}}
                                        crossorigin="anonymous"
                                        src={process.env.REACT_APP_HOST + '/' + product.image} 
                                        alt='image product'
                                    />
                                }
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowView(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Row style={{borderBottom: "solid 2px"}}>
                    <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>ID</p></Col>
                    <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>TOTAL PRODUCT</p></Col>
                    <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>PRICE</p></Col>
                    <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>ACTION</p></Col>
                </Row>
                <PaginatedItems carts={carts} />
            </Container>
            <Footer />
        </>
    )
}

export default HistoryPayment;