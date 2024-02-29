import { Container, Image, Row, Nav, Button, Col, ListGroup, NavLink } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
// import './assests/scss/main.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import searchIcon from '../assests/img/search-icon.svg';
import banner from '../assests/img/pic1.webp';
import bagIcon from '../assests/img/bag.png';
import find1Icon from '../assests/img/find1.png';
import find3Icon from '../assests/img/find3.png';
import find4Icon from '../assests/img/find4.png';
import find5Icon from '../assests/img/find5.png';
import FontAwesome from 'react-fontawesome'
import faStyles from 'font-awesome/css/font-awesome.css'
import { Link } from 'react-router-dom';
import TopHeader from './topHeader';
import Header from './header';
import Footer from './footer';
import Bestsellers from './bestSeller';
import seller from '../assests/img/seller.png';
import seller2 from '../assests/img/seller2.png';
import seller3 from '../assests/img/seller3.png';
import ExtraProduct from './extraproduct';
import { fetchData } from '../apis/api';

const Home = () => {

  const [show, setShow] = useState(false);

  const searchClose = () => setShow(false);
  const searchShow = () => setShow(true);
  const [homeBanners, setHomeBanners] = useState(null);

  const settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
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

  useEffect(() => {
    // Call the fetchData function
    fetchData('/banners')
      .then((result) => {
        setHomeBanners(result?.data);
      })
      .catch((error) => {
        console.error('Error while fetching banners:', error);
      });
  }, []);

  return (
    <>
      <div>
        <TopHeader />
      </div>
      <Header />
      {/* main section  */}
      <div className="main-section">
        <div className="main-pc">
          {/* <Image src={banner} alt="Banner icon" className="banner-sec w-100" /> */}
          {/* <div className="on-banner">
            <h1>Fragrances To Love</h1>
            <Button className="btn-primary active">Shop Now</Button>
          </div> */}
          <div className="main-slider">
            <Slider {...settings1}>
              {
                homeBanners?.map((item) => (
                <div className="slider-item" key={item?._id} >
                  <Image src={item.bannerImage} alt="Seller icon" className="w-100" height={500} />
                </div>
                ))
              }
            </Slider>
          </div>
        </div>
      </div>

      {/* best seller  */}
      <Bestsellers />
      <ExtraProduct />

      {/* find out more  */}
      <div className="find-out-more">
        <div className="find-out-more-wrap">
          <div className="find-out-more-list">
            <Image src={find1Icon} alt="Icon" />
            <p>Cruelty Free</p>
          </div>
          <div className="find-out-more-list">
            <Image src={find3Icon} alt="Icon" />
            <p>100% Vegetarian</p>
          </div>
          <div className="find-out-more-list">
            <Image src={find4Icon} alt="Icon" />
            <p>Free From Parabens</p>
          </div>
          <div className="find-out-more-list">
            <Image src={find5Icon} alt="Icon" />
            <p>Made In India</p>
          </div>
          <div className="find-out-more-list">
            <Image src={find1Icon} alt="Icon" />
            <p>Refillable Packaging</p>
          </div>
        </div>
        <div className="find-out-btn">
          <Button className="btn-secondary">Find Out More</Button>
        </div>
      </div>

      {/* footer  */}
      <Footer />
    </>
  );
}

export default Home;
