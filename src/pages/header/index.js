import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getItemsSelector } from "../../redux/slices/cartSlice";
import { fetchData } from "../../apis/api";
import { Link } from "react-router-dom";


const Header = () => {
  const items = useSelector(getItemsSelector);
  const total = items.reduce((a, b) => a + b.price, 0);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    // Call the fetchData function
    fetchCategories();
  }, []);
  // console.log("data ", category);

  const fetchCategories = async () => {
    try {
      const result = await fetchData("/categories?isPaginate=false");
      setCategory(result?.data);
    } catch (err) {
      throw err;
    }
  }

  return (
    <>
      <div className="main-menu">
        <Nav
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          {/* <Nav.Item>
              <li>Item count: {items.length}, Total price: {total}</li>
            </Nav.Item> */}
          {
            category?.map((cat) => (
              <Nav.Item key={cat?._id} className={cat.status === "active" ? "active" : ""}>
                <Nav.Link>
                  <Link to="/">{cat.name}</Link>
                </Nav.Link>
              </Nav.Item>
            ))
          }
        </Nav>
      </div>
    </>
  )
}

export default Header;