import { useEffect, useState } from "react";
import { Button, Col, Container, Image, ListGroup, Nav, NavLink, Row } from "react-bootstrap";
import Slider from 'react-slick';
import { addItem } from "../../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import seller from '../../assests/img/product1.png';
import seller2 from '../../assests/img/seller2.png';
import seller3 from '../../assests/img/seller3.png';
import { fetchData } from "../../apis/api";
import { Link } from "react-router-dom";


const Bestsellers = () => {

  // const [data, setData] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    // Call the fetchData function
    fetchData('/product')
      .then((result) => {
        setProductInfo(result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, []);

  // const {category} = data;
  // console.log("category ", category);

  const dispatch = useDispatch();
  const [price, setPrice] = useState(100);
  const [name, setName] = useState(100);

  const settings2 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

    return (
        <>

        {/* for testing api's working or not ? */}
        {/* {data?.map((item)=> (
            <div key={item?._id}>
                {item.category}
            </div>
        ))} */}
        {/* for testing api's working or not ? */}

          <Container className="best-slider">
            <div className="header-title">
                <h1>Bestsellers</h1>
            </div>
            <Slider {...settings2}>
              {
                productInfo?.map((item) => (
              <Link to={`/product-detail/${item?._id}`} className="slider-item" key={item._id}>
                <div className="slider-item-pic">
                  <Image src={item.productImage} alt="Seller icon" />
                  <span className="discount">{item.discountPrice}%</span>
                </div>
                <Nav.Link className="seller-title">{item.productName}</Nav.Link>
                <div className="slider-item-wrap">
                  <div className="product-price">
                    <span className="sale-price">{item.totalPrice}</span>
                    <span className="offer-price">{item.totalPrice}</span>
                  </div>
                </div>
                <Nav.Link className="add-to-cart" onClick={(e) =>dispatch(addItem({ name: name, price}))}>Add to cart</Nav.Link>
              </Link>
                ))
              }
            </Slider>

          </Container>
        </>
    )
}

export default Bestsellers;