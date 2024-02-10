import React from 'react';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home';
import Login from './pages/Login';
import Dashboard from './pages/admin/dashboard';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Category from './pages/admin/category';
import Product from './pages/admin/product';
import SubCategory from './pages/admin/subCategory';
import AddBanner from './pages/admin/addBanner';
import ProductDetail from './pages/frontend/product-detail';
import Signup from './pages/Signup';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />
//   },
//   {
//     path: "/login",
//     element: <Login />
//   },
//   {
//     path: "/dashboard",
//     element: <Dashboard />,
//   },
//   {
//     path: "/category",
//     element: <Category />,
//   },
//   {
//     path: "/product",
//     element: <Product />,
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <React.StrictMode>
        {/* <RouterProvider router={router} /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route element={<Dashboard />}>
              <Route path="/category" element={<Category />} />
              <Route path="/sub-category" element={<SubCategory />} />
              <Route path="/product" element={<Product />} />
              <Route path="/add-banner" element={<AddBanner />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
