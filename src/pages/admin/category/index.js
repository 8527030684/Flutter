import { useEffect, useRef, useState, useCallback } from "react";
import { Row, Dropdown, Button, InputGroup, DropdownButton, Form, Col, Modal, } from "react-bootstrap";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import defaultIcon from '../../../assests/icons/defaultSort.svg';
import closeIcon from '../../../assests/icons/close.svg';
import { deleteData, fetchData, postData, updateData } from "../../../apis/api";
import CustomLoader from "../../customLoader/customLoader";
import CropperImage from "../../common/cropperImage.js";
import debounce from 'lodash/debounce';
import CustomPagination from '../../../components/common/CustomPagination';
import { NUMBER } from "../../../constant/number";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const categorySchema = Yup.object({
    name: Yup.string().required('Name is required'),
    priority: Yup.string().required('Priority is required'),
    status: Yup.string().required('Status is required'),
    logo: Yup.string().required('Logo is required')
});

const Category = () => {

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, defaultValues }
    } = useForm({ resolver: yupResolver(categorySchema) });
    console.log(errors, 'errorserrors', getValues());

    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [category, setCategory] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        priority: '',
        status: '',
        logo: '',
    });
    const [page, setPage] = useState(1);
    const [sorted, setSorted] = useState(false);


    // for deleting the row
    const [selectedItemId, setSelectedItemId] = useState(null);

    // for fetch the data
    useEffect(() => {
        if (selectedItemId) {
            deleteData(`/categories/${selectedItemId}`)
                .then(() => {
                    setSelectedItemId(null);
                    fetchCategories();
                })
                .catch((error) => {
                    setSelectedItemId(null);
                    console.error('Error deleting item:', error);
                });
        }
    }, [selectedItemId]);

    const resetFormData = () => {
        setFormData({
            name: '',
            priority: '',
            status: '',
            logo: '',
        });
    }

    const apiRefresh = () => {
        fetchCategories(null, null, true);
        handleClose();
    }

    //for submiting data into database
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log({ [name]: value }, '[name]: value[name]: value');
        setFormData(pre => ({ ...pre, [name]: value }));
        setValue(e.target.name, e.target.value);
    };

    console.log("formData formData", formData);

    // for uploading image
    const UploadImage = (e) => {
        const { name } = e.target;
        console.log('---name-', name)
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        setIsLoading(false);
        reader.readAsDataURL(e.target.files[0]);
        setFormData(pre => ({ ...pre, logo: reader.result }));
    }

    const croppedImage = (image) => {
        console.log('----', image);
        const formDataFile = new FormData();
        formDataFile.append("file", image);
        postData("/fileUpload", formDataFile)
            .then((result) => {
                setFormData(pre => ({ ...pre, logo: result.url }));
                console.log('Uploading images successfully:', result.url);
                setValue("logo", result.url);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Uploading images into api");
                setIsLoading(false);
            });
    }

    const handlePostData = (data) => {
        categoryPostData(data);
    };

    const categoryPostData = (formData) => {
        console.log("category formData Status ", formData.status);
        const routeName = !isEdit ? '/categories' : `/categories/${formData.id}`;
        if (!isEdit) {
            postData(routeName, formData)
                .then((result) => {
                    console.log('Category data post successfully:', result);
                    resetFormData();
                    apiRefresh();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            updateData(routeName, formData)
                .then((result) => {
                    console.log('Category data edit successfully:', result);
                    resetFormData();
                    apiRefresh();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const fetchCategories = async (id, searchValue, isPaginate = true, pageData = 1, sort = 'name', sortBy = 'asc') => {
        let routeName = id ? `/categories/${id}` : '/categories';
        if (searchValue && isPaginate) {
            routeName = routeName + `?filter=${searchValue}&page=${pageData}&limit=${NUMBER.TEN}&sort=${sort}&sortBy=${sortBy}&isPaginate=true`
        } else if (isPaginate) {
            routeName = routeName + `?page=${pageData}&limit=${NUMBER.TEN}&sort=${sort}&sortBy=${sortBy}&isPaginate=true`
        } else {
            routeName = routeName + `?filter=${searchValue}&sort=${sort}&sortBy=${sortBy}`
        }
        try {
            const categoryData = await fetchData(routeName)
            if (id) {
                setFormData({
                    id: categoryData._id,
                    name: categoryData.name,
                    priority: categoryData.priority.toString(), // Convert to string if needed
                    status: categoryData.status,
                    logo: categoryData.logo,
                });
                // Set pre-filled values using setValue
                // Object.keys(formData).forEach((key) => {
                // setValue(formData);
                // });
                setIsEdit(true);
                handleShow();
            } else {
                setCategory(categoryData);
                setIsEdit(false)
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    function handleSearch(query) {
        try {
            fetchCategories(null, query);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
    const totalEntries = category?.totalCount;

    const handlePagination = (selectedPage) => {
        setPage(selectedPage);
        fetchCategories(null, null, true, selectedPage);
    };
    const countTotal = Math.ceil(totalEntries / NUMBER.TEN);
    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

    const handleSort = (name) => {
        setSorted(!sorted);
        const sortBy = sorted ? 'asc' : 'desc';
        fetchCategories(null, null, true, page, name, sortBy);
    };

    // for fetch the data
    useEffect(() => {
        // Call the fetchData function
        fetchCategories(null, null, true);
    }, []);

    // Pass the value from formData to the respective form fields using setValue
    useEffect(() => {
        Object.keys(formData).forEach(key => {
            setValue(key, formData[key]);
        });
    }, [formData]);

    return (
        <>
            <div className="admin-common-body">
                <div className="admin-header-wrapper">
                    <h1 className="admin-header-title">Category</h1>
                    <div className="header-wrapper">
                        <div className="header-left">
                            <Form className="search-sec message-search">
                                <InputGroup className="search-group">
                                    <InputGroup.Text id="basic-addon1" className="search-icon">
                                        <span className="icon-search" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        className="form-input search-input"
                                        type="search"
                                        placeholder="Search..."
                                        onChange={(e) => debouncedHandleSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </Form>
                        </div>
                        <div className="header-right">
                            <Button className="btn primary header-primary-btn" onClick={() => {
                                setIsEdit(false);
                                resetFormData();
                                handleShow();
                            }}>Add Category</Button>
                        </div>
                    </div>
                </div>
                <div className="list-container service-list-container">
                    <div className="table-wrapper mobile-optimised">
                        <div className="thead">
                            <div className="row tr">
                                <div className="th flex-table-column-20" >
                                    <span className="table-heading">
                                        <span>Name</span>
                                        <span className="icon-filter-custom" onClick={(e) => handleSort('name')}>
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-20" >
                                    <span className="table-heading">
                                        <span>Image</span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-20" >
                                    <span className="table-heading">
                                        <span>Priority</span>
                                        <span className="icon-filter-custom" onClick={(e) => handleSort('priority')}>
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-25" >
                                    <span className="table-heading">
                                        <span>Status</span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-15 text-center">
                                    <span className="table-heading">
                                        <span>Action</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="tbody">
                            {category?.data?.map((cat, index) => (
                                <div className="row tr" key={index + 1}>
                                    <div className="td flex-table-column-20">
                                        <p className="listing-title text-capitalize">{cat.name}</p>
                                    </div>
                                    <div className="td flex-table-column-20">
                                        <img src={cat.logo} alt="logo" width="40" />
                                    </div>
                                    <div className="td flex-table-column-20">
                                        <div>
                                            <p className="listing-normal mb-0">{cat.priority}</p>
                                        </div>
                                    </div>
                                    <div className="td flex-table-column-25">
                                        <p className="listing-normal mb-0">Active</p>
                                    </div>
                                    <div className="td flex-table-column-15">
                                        <div className="listing-normal">
                                            <div className="listing-normal text-center">
                                                <DropdownButton className="icon-three-dot manage-three-dot">
                                                    <Dropdown.Item onClick={() => fetchCategories(cat._id)}> Edit</Dropdown.Item>
                                                    {/* <Dropdown.Item onClick={() => setSelectedItemId(cat._id)}> Edit</Dropdown.Item> */}
                                                    <Dropdown.Item onClick={() =>
                                                        setSelectedItemId(cat._id)
                                                    }>Delete</Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                        <CustomPagination
                            countTotal={countTotal}
                            pageSelected={page}
                            setPageSelected={handlePagination}
                            totalEntries={totalEntries}
                        />
                    </div>
                </div>
            </div >
            <Modal centered className="common-modal boarding-login" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{isEdit ? 'Update' : 'Add'} Category</Modal.Title>
                    <img className="btn-close" src={closeIcon} alt="close icon" onClick={() => {
                        resetFormData();
                        handleClose();
                    }} />
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(handlePostData)}>
                        <Row className="modal-body-form">
                            <Col xs={12} sm={12} className=" ">
                                <Form.Group className="form-mt-space">
                                    <Form.Label>Enter Name</Form.Label>
                                    <div className="wrap-input">
                                        <Form.Control
                                            type="type"
                                            placeholder="Enter name"
                                            id="name"
                                            name="name"
                                            onChange={handleInputChange}
                                            {...register("name")}
                                            register="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <Form.Group className="form-mt-space">
                                    <Form.Label>Priority</Form.Label>
                                    <div className="wrap-input">
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter priority"
                                            id="priority"
                                            name="priority"
                                            // value={formData.priority}
                                            onChange={handleInputChange}
                                            {...register("priority")} className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <div className="wrap-select wrap-input">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Select {...register("status")} name="status" onChange={handleInputChange}>
                                            {!isEdit ? <option value="" default>Select Status</option> : ''}
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} className="upload-file-wrapper">
                                <Form.Group className="form-mt-space react-upload-file">
                                    <Form.Label>Logo (Optional)</Form.Label>
                                    <Form.Control {...register('file')} type='file' name='logo' id='logo' onChange={UploadImage} disabled={isLoading} />
                                </Form.Group>
                                {isLoading && <CustomLoader />}
                            </Col>
                            <Col xs={12} sm={12} className="p-0">
                                {(previewImage && isEdit) && (<CropperImage previewImage={previewImage} croppedImage={croppedImage} />)}
                            </Col>
                        </Row>
                        <div className="footer-modal">
                            <Button type="submit" className="btn primary modal-btn-submit">{isEdit ? 'Update' : 'Add'} </Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer />
            </Modal>
        </>
    )
}

export default Category;