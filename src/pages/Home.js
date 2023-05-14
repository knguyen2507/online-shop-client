import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Title from "../components/Title.js";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Nav from 'react-bootstrap/Nav';
import { useState, useEffect } from "react";
import { GetAllProducts } from "../services/productAPI.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// firebase
import { firebase } from '../services/firebase';

const title = "HOME";

function Home () {
    document.title = title;
    const [products, setProducts] = useState([]);
    const [urls, setUrls] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const getAllProducts = async () => {
            const products = await GetAllProducts();
            if (process.env.REACT_APP_ENV === 'pro') {
                const app = firebase();
                const storage = getStorage(app);
                const dict = {};
                for (let product of products) {
                    const url = await getDownloadURL(ref(storage, product.image));
                    dict[product.image.toString()] = url
                }
                setUrls(dict)
            }
            setProducts(products);
            setLoad(true)
        }
        getAllProducts();
    }, [])

    const itemImage = {
        width: "300px", 
        height: "auto",
        backgroundColor: "white",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        marginBottom: "25px"
    };

    const itemInfo = {
        textAlign: "center",
        color: "black",
        textTransform: "uppercase"
    };  
    
    if (load === false) {
        return (
            <>
                <Navigation />
                <Title title={title} />
                <Container>
                    <p style={{textAlign: "center", fontWeight: "Bold"}}>Loading...</p>
                </Container>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navigation />
            <Title title={title} />
            <Container>
                <Row md={3}>
                {products.map(product => (
                    <Col style={{marginTop: "25px", marginBottom: "25px"}}>
                        <div style={itemImage}>
                            <Nav.Link href={"/product/" + product.id} >
                                {process.env.REACT_APP_ENV === 'pro' ? 
                                    <img 
                                        width="300" 
                                        height="300"
                                        src={urls[product.image]} 
                                        alt='image product'
                                    ></img> :
                                    <img 
                                        width="300" 
                                        height="300" 
                                        crossorigin="anonymous"
                                        src={process.env.REACT_APP_HOST + '/' + product.image} 
                                        alt='image product'
                                    ></img>
                                }
                            </Nav.Link>
                        </div>
                        <div style={itemInfo}>
                            <p>{product.name}</p>
                        </div>
                    </Col>
                ))}
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default Home;