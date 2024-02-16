import { useState, useCallback } from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Image, Form, InputGroup, Dropdown } from "react-bootstrap";
import searchIcon from '../../assests/img/search-icon.svg';
import logoIcon from '../../assests/img/logo.jpeg';
import loginIcon from '../../assests/img/login.png';
import bagIcon from '../../assests/img/bag.png';
import { Link, useNavigate } from "react-router-dom";
import debounce from 'lodash/debounce';
import { fetchData } from "../../apis/api";



const TopHeader = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [query, setQuery] = useState('');

  const handleRedirectGlobal = (
      data,
      setShow,
      setQuery
    ) => {
      setShow(false);
      setQuery('');
      if (data?.productName) {
        navigate(`/product-detail/${data?._id}`);
      };
    }
    const fetchProduct = async (searchValue) => {
      let routeName = '/product';
      if(searchValue){
        routeName= routeName+ `?filter=${searchValue}`
      }
      try {
          const categoryData = await fetchData(routeName)
          setSearchData(categoryData);
      } catch (err) {
          console.error('Error fetching data:', err);
      }
    }

    function handleSearch(query) {
      setQuery(query);
      fetchProduct(query);
    }
  
    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
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
          <div className="top-slider">
            <Slider {...settings}>
              <div className="text-center slider-item">
                <h6> Share the love to enjoy 10% off </h6>
              </div>
              <div className="text-center slider-item">
                <h6> FREE US Standard Shipping </h6>
              </div>
              <div className="text-center slider-item">
                <h6> Cruelty Free & 100% Vegetarian </h6>
              </div>
            </Slider>
          </div>
          <div className="main-header">
            <Container className='main-container'>
              <div className="middle-header">
                <Image src={logoIcon} alt="Logo icon" />
              </div>
              <div className="left-header">
                <div className="header-search">
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">
                      <Image src={searchIcon} alt="Search" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search..."
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e) => debouncedHandleSearch(e.target.value)}
                    />
                  </InputGroup>
                  {query && (
              <div className={searchData.length > 3
                ? 'notification-top-arrow search-bg global-scroll-search-data'
                : 'notification-top-arrow search-bg'}
              >
                {searchData?.map((data) => (
                  <Dropdown.Item
                    onClick={() => handleRedirectGlobal(data, setShow, setQuery)}
                    className="menu-notification"
                    key={data?._id}
                  >
                    <div className="menu-notification-right">
                      {data?.productName || ''}
                    </div>
                  </Dropdown.Item>
                ))}
                {searchData?.length > 0
                && (
                <span className="total-results">
                  {searchData?.length}
                  {' '}
                  {searchData?.length > 1 ? 'results' : 'result'}

                </span>
                )}
                {query !== '' && searchData?.length === 0}
              </div>
              )}
                </div>
              </div>
              <div className="right-header">
                <div className="login">
                  <Image src={loginIcon} alt="Login icon" />
                  <Link to="/login">Log in / Join</Link>
                </div>
                <div className="bag">
                  <Image src={bagIcon} alt="Bag icon" />
                  <p>View Bag</p>
                </div>
              </div>
            </Container>
          </div>
        </>
    )
}

export default TopHeader;