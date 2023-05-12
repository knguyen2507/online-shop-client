import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { 
    RefreshToken 
} from "../services/userAPI.js";
import { 
    GetProductById 
} from '../services/productAPI.js';
import { AddProductToCart } from "../services/cartAPI.js";

const title = "Product";

function Product () {
    const {id} = useParams();
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const getProductById = async () => {
            const product = await GetProductById({id});
            setProduct(product);
        }
        getProductById();
    }, [])

    const itemImage = {
        width: "300px", 
        height: "auto",
        backgroundColor: "white",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        marginBottom: "25px"
    };

    function CheckAvaiable (properties) {
        if (properties.qty === 0) return <p style={{color:"red", fontWeight: "bold"}}>Out Of Stock</p>
        return true
    };

    const btn_AddToCart = {
        backgroundColor: '#14A44D',
        color: "white",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
        width: "200px"
    };

    const btn_OutStock = {
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
        width: "200px"
    };

    const addProductToCart = async () => {
        const res = await AddProductToCart({idProduct: id});
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
            }
        } else {
            alert(res.message);
        }
    };

    function AddToCart() {
        return (
            <input style={btn_AddToCart} type="submit" value="ADD TO CART" onClick={addProductToCart} />
        )
    };

    function OutStock() {
        return (
            <input style={btn_OutStock} type="submit" value="OUT OF STOCK" />
        )
    };

    function StatusProduct(properties) {
        if (!localStorage.getItem('nameUser')) {
            return (
                <CheckAvaiable qty={properties.qty} />
            )
        }
        if (properties.qty === 0) {
            return (
                <OutStock />
            )
        }
        return (
            <AddToCart />
        )
    };

    return (
        <>
            <Navigation />
            <Container>
                <Row style={{marginTop: "25px", marginBottom: "25px"}}>
                    <Col sm={4}>
                        <div style={itemImage}>
                            <img 
                                width="300" 
                                height="300" 
                                crossorigin="anonymous"
                                src={process.env.REACT_APP_HOST + '/' + product.image} 
                                alt="image product"
                            ></img>
                        </div>
                    </Col>
                    <Col sm={8}>
                        <div style={{textAlign: "left"}}>
                            <p><span style={{fontWeight: "bold"}}>PRODUCT NAME: </span>{product.name}</p>
                            <p><span style={{fontWeight: "bold"}}>CATEGORY: </span>{product.category}</p>
                            <p><span style={{fontWeight: "bold"}}>BRAND: </span>{product.brand}</p>
                            <p><span style={{fontWeight: "bold"}}>PRICE: </span>{product.price}</p>
                            <StatusProduct qty={product.qty} />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    )
}

export default Product;