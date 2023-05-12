import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import Nav from 'react-bootstrap/Nav';
import { useState, useEffect } from "react";
// api
import { GetAllBrands } from '../services/brandAPI';
import { GetAllCategories } from '../services/categoryAPI';

export default function Footer() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getAllBrands = async () => {
            const brands = await GetAllBrands();
            setBrands(brands);
        }
        getAllBrands();
    }, []);
    useEffect(() => {
        const getAllCategories = async () => {
            const categories = await GetAllCategories();
            setCategories(categories);
        }
        getAllCategories();
    }, []);

    return (
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
            <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                {brands.map(brand => (
                    <Nav.Link href={"/brand/"+brand.id+"/products"} >
                        <img 
                            width="120" 
                            height="50" 
                            crossorigin="anonymous"
                            src={process.env.REACT_APP_HOST + '/' + brand.image} 
                            alt='image brand'
                        ></img>
                    </Nav.Link>
                ))}
            </section>

            <section className=''>
                <MDBContainer className='text-center text-md-start mt-5'>
                    <MDBRow className='mt-3'>
                        <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>
                                <MDBIcon color='secondary' icon='gem' className='me-3' />
                                KHOI NGUYEN STORE
                            </h6>
                            <p>
                                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit
                                amet, consectetur adipisicing elit.
                            </p>
                        </MDBCol>

                        <MDBCol md='4' lg='4' xl='3' className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>CATEGORIES</h6>
                            {categories.map(category => (
                                <Nav.Link href={'/category/'+category.id+'/products'} >
                                    <p>{category.name}</p>
                                </Nav.Link>
                            ))}
                        </MDBCol>

                        <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                            <p><MDBIcon color='secondary' icon='home' className='me-2' />
                                New York, NY 10012, US
                            </p>
                            <p><MDBIcon color='secondary' icon='envelope' className='me-3' />
                                info@example.com
                            </p>
                            <p><MDBIcon color='secondary' icon='phone' className='me-3' />
                                + 01 234 567 88
                            </p>
                            <p><MDBIcon color='secondary' icon='phone' className='me-3' />
                                + 01 234 567 89
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2023 Copyright
            </div>
        </MDBFooter>
    );
}