import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../header";
import TopHeader from "../../topHeader";
import Footer from "../../footer";
import Bestsellers from "../../bestSeller";
import { fetchData } from "../../../apis/api";

const ProductDetail = () => {
    const { id } = useParams();
    const [productInfo, setProductInfo] = useState();

    const getProfuctDetails = async (id) =>{
        const productDeatils = await fetchData(`/product/${id}`)
        setProductInfo(productDeatils);
    } 

    useEffect(() => {
        if(id){
            getProfuctDetails(id);
        }
        }, [id]);
    return (
        <>
            <TopHeader />
            <Header />
            <div className="container-custom">
                <div className="single-product">
                    <div className="row-custom">
                        <div className="col-6-custom">
                            <div className="product-image">
                                <div className="product-image-main">
                                    <img src={productInfo?.productImage} alt="" id="product-main-image" />
                                </div>
                                <div className="product-image-slider">
                                    <img src={productInfo?.productImage} alt="" className="image-list" />
                                    <img src={productInfo?.productImage} alt="" className="image-list" />
                                    <img src={productInfo?.productImage} alt="" className="image-list" />
                                    <img src={productInfo?.productImage} alt="" className="image-list" />
                                </div>
                            </div>
                        </div>
                        <div className="col-6-custom">
                            <div className="breadcrumb">
                                <span><Link to="/">Home</Link></span>
                                <span><a>Product</a></span>
                                <span className="active">{productInfo?.category?.name}</span>
                            </div>

                            <div className="product">
                                <div className="product-title">
                                    <h2>{productInfo?.productName}</h2>
                                </div>
                                <div className="product-rating">
                                    <span><i className="bx bxs-star"></i></span>
                                    <span><i className="bx bxs-star"></i></span>
                                    <span><i className="bx bxs-star"></i></span>
                                    <span><i className="bx bxs-star"></i></span>
                                    <span><i className="bx bxs-star"></i></span>
                                    <span className="review">(47 Review)</span>
                                </div>
                                <div className="product-price">
                                    <span className="offer-price">${productInfo?.totalPrice}</span>
                                    <span className="sale-price">${productInfo?.discountPrice}</span>
                                </div>

                                <div className="product-details">
                                    <h3>{productInfo?.description}</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos est magnam quibusdam maiores sit perferendis minima cupiditate iusto earum repudiandae maxime vitae nostrum, ea cumque iste ipsa hic commodi tempore.</p>
                                </div>
                                <div className="product-size">
                                    <h4>Check Pincode</h4>
                                    <div className="check-pincode">
                                        <input type="text" name="check-pincode" className="size-input" placeholder="Enter Pincode" />
                                    </div>
                                </div>
                                <div className="qty-input">
                                    <button className="qty-count qty-count--minus" data-action="minus" type="button">-</button>
                                    <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1" />
                                    <button className="qty-count qty-count--add" data-action="add" type="button">+</button>
                                </div>

                                <div className="product-btn-group">
                                    <button type="submit" className="button add-to-cart">Add to Cart</button>
                                    <button type="submit" className="button add-to-wishlist">Add to Wishlist</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Bestsellers />
            <Footer />
        </>
    )
}

export default ProductDetail;