import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ErrorBoundary} from 'react-error-boundary';
// pages
import Home from './pages/Home.js';
import Category from './pages/Category.js';
import Brand from './pages/Brand.js';
import Product from './pages/Product.js';
import Signin from './pages/Signin.js';
import Signup from './pages/Signup.js';
import Search from './pages/Search.js';
import Logout from './pages/Logout.js';
import User from './pages/User.js';
import Admin from './pages/Admin.js';
import NotFound from './pages/NotFound.js';
import Cart from './pages/Cart.js';
import Payment from './pages/Payment.js';
import HistoryPayment from './pages/HistoryPayment.js';

function App() {
  function ErrorHandler({error}) {
    return (
      <div role="alert">
        <p>An error occurred:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/user/cart/:id' element={<Cart />} />
          <Route path='/user/payment/:id' element={<Payment />} />
          <Route path='/user/history-payment/:id' element={<HistoryPayment />} />
          <Route path='/user/:id' element={<User />} />
          <Route path='/login' element={<Signin />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/product/search' element={<Search />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/admin-page' element={<Admin />} />
          <Route path={'/category/:id/products'} element={<Category />} />
          <Route path={'/brand/:id/products'} element={<Brand />} />
          <Route path={'/product/:id'} element={<Product />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
