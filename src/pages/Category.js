import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Title from "../components/Title.js";
import { useState, useEffect } from "react";
import { 
    GetProductsByCategories,
    GetCategoryById 
} from "../services/categoryAPI.js";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Nav from 'react-bootstrap/Nav';
import { useParams } from "react-router-dom";

function Category () {
    const {id} = useParams();

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

    const [category, setCategory] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const GetCategoryById = async () => {
            const category = await GetCategoryById({id});
            setCategory(category);
        }
        GetCategoryById();
    }, [])
    useEffect(() => {
        const getProductsByCategories = async () => {
            const products = await GetProductsByCategories({category: id});
            setProducts(products);
        }
        getProductsByCategories();
    }, [])

    const title = category.name || 'KHOI NGUYEN STORE';
    document.title = title.toUpperCase();

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
                                <img 
                                    width="300" 
                                    height="300" 
                                    crossorigin="anonymous"
                                    src={process.env.REACT_APP_HOST + '/' + product.image} 
                                    alt="image product"
                                ></img>
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

export default Category;