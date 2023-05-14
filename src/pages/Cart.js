import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
    GetCartById,
    AddQtyProductInCart,
    ReduceQtyProductInCart,
    RemoveProductInCart 
} from "../services/cartAPI.js";
import { 
    PaymentCart 
} from "../services/paymentAPI.js";

const title = "Cart";

function Cart () {
    const {id} = useParams();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [urls, setUrls] = useState([]);

    const addQtyProductToCart = async (idCart) => {
        const res = await AddQtyProductInCart({id: idCart});
        if (res.code >= 400 && res.message !== 'jwt expired') {
            alert(res.message);
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
                const resp = await AddQtyProductInCart({id: idCart});
                setError(false);
                alert(resp.message);
                window.location.reload(false);
            }
        } else {
            alert(res.message);
            window.location.reload(false);
        }
    };

    const reduceQtyProductToCart = async (idCart) => {
        const res = await ReduceQtyProductInCart({id: idCart});
        if (res.code >= 400 && res.message !== 'jwt expired') {
            alert(res.message);
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
                const resp = await GetCartById({id: idCart});
                setError(false);
                alert(resp.message);
                window.location.reload(false);
            }
        } else {
            alert(res.message);
            window.location.reload(false);
        }
    };

    const removeQtyProductToCart = async (idCart) => {
        const res = await RemoveProductInCart({id: idCart});
        if (res.code >= 400 && res.message !== 'jwt expired') {
            alert(res.message);
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
                const resp = await GetCartById({id: idCart});
                setError(false);
                alert(resp.message);
                window.location.reload(false);
            }
        } else {
            alert(res.message);
            window.location.reload(false);
        }
    };

    const paymentCart = async () => {
        const carts = [];
        for (let product of products) {
            carts.push(product._id);
        }
        if (carts.length === 0) {
            alert("Not have requesting payment");
        } else {
            const res = await PaymentCart({id, carts});
            if (res.code >= 400 && res.message !== 'jwt expired') {
                alert(res.message);
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
                    const resp = await PaymentCart({id, carts});
                    setError(false);
                    alert(resp.message);
                    window.location.reload(false);
                }
            } else {
                alert(res.message);
                window.location.reload(false);
            }
        }
    };

    useEffect(() => {
        const getProducts = async () => {
            const res = await GetCartById({id});
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
                    const resp = await GetCartById({id});
                    setError(false);
                    setProducts(resp.metadata);
                }
            } else {
                setError(false);
                setProducts(res.metadata);
            }
            if (process.env.REACT_APP_ENV === 'pro' || res.metadata.length > 0) {
                const app = firebase();
                const storage = getStorage(app);
                const dict = {};
                for (let product of res.metadata) {
                    const url = await getDownloadURL(ref(storage, product.image));
                    dict[product.image.toString()] = url
                }
                setUrls(dict)
            } else {
                return true
            }
        }
        getProducts();
    }, []);



    function PaginatedItems (properties) {
        const cart = properties.products || []
        if (cart.length > 0) {
            return (
                <>
                    {cart.map(product => (
                        <Row style={{borderBottom: "solid 2px"}}>
                            <Col xs={9} md={6}>{product.name}</Col>
                            <Col xs={3} md={2}>
                                <input 
                                    style={{
                                        height: "30px",
                                        width: "30px",
                                        marginRight: "5px"
                                    }} 
                                    type="submit" 
                                    value="-" 
                                    onClick={() => reduceQtyProductToCart(product._id)}
                                />
                                {product.qty}
                                <input 
                                    style={{
                                        height: "30px",
                                        width: "30px",
                                        marginLeft: "5px"
                                    }}
                                    type="submit" 
                                    value="+" 
                                    onClick={() => addQtyProductToCart(product._id)}
                                />
                            </Col>
                            <Col xs={3} md={2}>
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
                            </Col>
                            <Col xs={3} md={2}>
                                <Button 
                                    variant="danger"
                                    style={{
                                        fontSize: "10px",
                                        height: "50px",
                                        width: "130px"
                                    }}
                                    onClick={() => removeQtyProductToCart(product._id)}
                                >Delete</Button>
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        return (
            <p>No Item in Cart</p>
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
                <Button 
                    variant="warning" 
                    style={{width: "300px"}}
                    onClick={() => paymentCart()}
                >PAYMENT PRODUCTS
                </Button>
                <Row style={{borderBottom: "solid 2px"}}>
                    <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>NAME</p></Col>
                    <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>QTY</p></Col>
                    <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>IMAGE</p></Col>
                    <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>ACTION</p></Col>
                </Row>
                {<PaginatedItems products={products} />}
            </Container>
            <Footer />
        </>
    )
}

export default Cart;