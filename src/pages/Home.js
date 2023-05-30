import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Title from "../components/Title.js";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Nav from 'react-bootstrap/Nav';
import { useState, useEffect } from "react";
import { GetAllProducts } from "../services/productAPI.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// firebase
import { firebase } from '../services/firebase';
// Pagination
import { Pagination } from "../components/Pagination.js";

const title = "HOME";

function Home () {
    document.title = title;
    const [products, setProducts] = useState([]);
    const [urls, setUrls] = useState([]);
    const [load, setLoad] = useState(false);
    const [numPage, setNumPage] = useState(1);

    useEffect(() => {
        const getAllProducts = async () => {
            const products = await GetAllProducts();
            // if (process.env.REACT_APP_ENV === 'pro') {
            //     const app = firebase();
            //     const storage = getStorage(app);
            //     const dict = {};
            //     for (let product of products) {
            //         const url = await getDownloadURL(ref(storage, product.image));
            //         dict[product.image.toString()] = url
            //     }
            //     setUrls(dict)
            // }
            setProducts(products);
            setLoad(true)
        }
        getAllProducts();
    }, [])

    const {page, ItemsPaging} = Pagination({items: products, numItemsInOnePage: 6})

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

    return (
        <>
            <Navigation />
            <Title title={title} />
            <Container>
                { 
                    load === false ?
                    <p 
                        style={{textAlign: "center", fontWeight: "Bold"}}
                    >Loading...</p> :
                    <>
                        <Row md={3}>
                            {ItemsPaging[numPage - 1].map(product => (
                                <Col style={{marginTop: "25px", marginBottom: "25px"}}>
                                    <div style={itemImage}>
                                        <Nav.Link href={"/product/" + product.id} >
                                            {process.env.REACT_APP_ENV === 'pro' ? 
                                                <img 
                                                    width="300" 
                                                    height="300"
                                                    src={product.firebase} 
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
                        <Button 
                            variant="primary" 
                            style={{width: "200px"}} 
                            onClick={() => numPage === 1 ? setNumPage(numPage) : setNumPage(numPage - 1)}
                        >Previous</Button>
                        <p style={{display: "inline-block"}}>{numPage}</p>
                        <Button 
                            variant="success" 
                            style={{width: "200px"}} 
                            onClick={() => numPage === page ? setNumPage(numPage) : setNumPage(numPage + 1)}
                        >Next</Button>
                    </>
                }
            </Container>
            <Footer />
        </>
    );
}

export default Home;