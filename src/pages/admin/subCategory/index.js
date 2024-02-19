import { useEffect, useRef, useState } from "react";
import { Row, Dropdown, Button, Form, InputGroup, DropdownButton, Col, Modal, } from "react-bootstrap";
import defaultIcon from '../../../assests/icons/defaultSort.svg';
import closeIcon from '../../../assests/icons/close.svg';
import Sidebar from "../../sidebar";
import AdminHeader from "../adminHeader";
import { deleteData, fetchData, postData, updateData } from "../../../apis/api";
import CustomLoader from "../../customLoader/customLoader";
import CropperImage from "../../common/cropperImage";
import { NUMBER } from "../../../constant/number";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const subCategorySchema = Yup.object({
    categoryId: Yup.string().required('Select category'),
    name: Yup.string().required('Name is required'),
    priority: Yup.string().required('Priority is required'),
    status: Yup.string().required('Status is required'),
    logo: Yup.string().required('Logo is required')
});

const SubCategory = () => {

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, defaultValues }
      } = useForm({ resolver: yupResolver(subCategorySchema) });
      console.log(errors, 'errorserrors', getValues());


    const [image, setImage] = useState("");
    const inputRef = useRef();
    const [previewImage, setPreviewImage] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryId: '',
        name: '',
        priority: '',
        status: '',
        logo: '',
    });

    // for deleting the row
    const [selectedItemId, setSelectedItemId] = useState(null);

    // for fetch the data
    useEffect(() => {
        if (selectedItemId) {
            deleteData(`/subCategories/${selectedItemId}`)
                .then(() => {
                    setSelectedItemId(null);
                    fetchSubCategories();
                })
                .catch((error) => {
                    setSelectedItemId(null);
                    console.error('Error deleting item:', error);
                });
        }
    }, [selectedItemId]);

    const resetFormData = () => {
        setFormData({
            categoryId: '',
            name: '',
            priority: '',
            status: '',
            logo: '',
        });
    }

    const apiRefresh = () => {
        fetchSubCategories();
        handleClose();
    }

    //for submiting data into database
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // setImage(inputRef.current.value);
        console.log({[name]: value}, '[name]: value[name]: value');
        setFormData(pre => ({ ...pre, [name]: value }));
    };

    // for uploading image
    const UploadImage = (e) => {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
        setPreviewImage(reader.result);
        };
        setIsLoading(false);
        reader.readAsDataURL(e.target.files[0]);
        console.log("previewImage ", previewImage);
    }

    const croppedImage = (image) => {
        console.log('----', image);
        const formDataFile = new FormData();
        formDataFile.append("file", image);
        postData("/fileUpload", formDataFile)
        .then((result) => {
            setFormData(pre => ({ ...pre, logo: result.url }));
            console.log('Uploading images successfully:', result.url);
            setIsLoading(false);
            setValue("logo", result.url);
        })
        .catch((error) => {
            console.error("Uploading images into api");
            setIsLoading(false);
        });
    }

    const handlePostData = (data) => {
        subCategoryPostData(data);
    };

    const subCategoryPostData = (formData) => {
        // e.preventDefault();
        // console.log("subcategory data ", formData.id);
        // console.log("categoryId ", formData.categoryId);
        console.log("category formData Status ", formData.status);
        const routeName = !isEdit ? '/subCategories' : `/subCategories/${formData.id}`;
        if (!isEdit) {
            postData(routeName, formData, { accept: 'application/json' })
                .then((result) => {
                    console.log('Sub category data post successfully:', result);
                    resetFormData();
                    apiRefresh();
                    console.log("formData.logo ", formData);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            updateData(routeName, formData)
                .then((result) => {
                    console.log('Sub category data edit successfully:', result);
                    resetFormData();
                    apiRefresh();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // id = null means all category else selected id category
    const fetchSubCategories = async (id) => {
        const routeName = id ? `/subCategories/${id}` : '/subCategories';
        try {
            const categoryData = await fetchData(routeName)
            if (id) {
                setFormData({
                    id: categoryData._id,
                    categoryId: categoryData.categoryId,
                    name: categoryData.name,
                    priority: categoryData.priority.toString(), // Convert to string if needed
                    status: categoryData.status,
                    logo: categoryData.logo,
                });
                setPreviewImage(categoryData.logo);
                setIsEdit(true)
                handleShow();
            } else {
                setSubCategory(categoryData);
                setIsEdit(false)
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const fetchCategories = async () => {
        try{
            const result = await fetchData("/categories?isPaginate=false");
            setCategory(result?.data);
        }catch(err) {
            throw err;
        }
    }

    // for fetch the data
    useEffect(() => {
        // Call the fetchData function
        fetchSubCategories();
        fetchCategories();
    }, []);

     // Pass the value from formData to the respective form fields using setValue
    // useEffect(() => {
    //     Object.keys(formData).forEach(key => {
    //         setValue(key, formData[key]);
    //     });
    // }, [formData]);

    return (
        <>
            <div className="admin-common-body">
                <div className="admin-header-wrapper">
                    <h1 className="admin-header-title">Sub Category</h1>
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
                                    />
                                </InputGroup>
                            </Form>
                        </div>
                        <div className="header-right">
                            <Button className="btn primary header-primary-btn" onClick={() => {
                                setIsEdit(false);
                                resetFormData();
                                handleShow();
                            }}>Add Sub Category</Button>
                        </div>
                    </div>
                </div>
                <div className="list-container service-list-container">
                    <div className="table-wrapper mobile-optimised">
                        <div className="thead">
                            <div className="row tr">
                                <div className="th flex-table-column-20" >
                                    <span className="table-heading">
                                        <span>Category</span>
                                        <span className="icon-filter-custom">
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-20" >
                                    <span className="table-heading">
                                        <span>Name</span>
                                        <span className="icon-filter-custom">
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-10" >
                                    <span className="table-heading">
                                        <span>Image</span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-20" >
                                    <span className="table-heading">
                                        <span>Priority</span>
                                        <span className="icon-filter-custom">
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-15" >
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
                            {subCategory?.map((cat, index) => (
                                <div className="row tr" key={index + 1}>
                                    <div className="td flex-table-column-20">
                                        <p className="listing-title text-capitalize">{cat.categoryId}</p>
                                    </div>
                                    <div className="td flex-table-column-20">
                                        <p className="listing-title text-capitalize">{cat.name}</p>
                                    </div>
                                    <div className="td flex-table-column-10">
                                        <img src={cat.logo} alt="logo" width="40" />
                                    </div>
                                    <div className="td flex-table-column-20">
                                        <div>
                                            <p className="listing-normal mb-0">litre</p>
                                        </div>
                                    </div>
                                    <div className="td flex-table-column-15">
                                        <p className="listing-normal mb-0">Active</p>
                                    </div>
                                    <div className="td flex-table-column-15">
                                        <div className="listing-normal">
                                            <div className="listing-normal text-center">
                                                <DropdownButton className="icon-three-dot manage-three-dot">
                                                    <Dropdown.Item onClick={() => { fetchSubCategories(cat._id) }}> Edit</Dropdown.Item>
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
                    </div>
                </div>
            </div>
            <Modal centered className="common-modal boarding-login" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{isEdit ? 'Update' : 'Add'} Sub Category</Modal.Title>
                    <img className="btn-close" src={closeIcon} alt="close icon" onClick={() => {
                        resetFormData();
                        handleClose();
                    }} />
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(handlePostData)}>
                        <Row className="modal-body-form">
                            <Col xs={12} sm={12} className=" ">
                                <div className="wrap-select wrap-input">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Select {...register("categoryId")} name="categoryId" id="categoryId" onChange={handleInputChange}>
                                            {category?.map((cat, index) => (
                                                <option value={cat?._id} key={index + 1}>{cat?.name}</option>
                                            )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <Form.Group className="form-mt-space">
                                    <Form.Label>Enter Name</Form.Label>
                                    <div className="wrap-input">
                                        <Form.Control
                                            type="type"
                                            placeholder="Enter name"
                                            name="name"
                                            id="name"
                                            autoComplete="off"
                                            // value={formData.name}
                                            // onChange={handleInputChange}
                                            {...register("name")}
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
                                            type="type"
                                            placeholder="Enter priority"
                                            name="priority"
                                            autoComplete="off"
                                            // value={formData.priority}
                                            // onChange={handleInputChange}
                                            {...register("priority")}
                                            className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
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
                                    <Form.Control {...register('file')} type="file" name='logo' id='logo' onChange={UploadImage} disabled={isLoading} />
                                </Form.Group>
                                {isLoading && <CustomLoader />}
                            </Col>
                            <Col xs={12} sm={12} className="p-0">
                                {previewImage && ( <CropperImage previewImage={previewImage} croppedImage= {croppedImage} />)}
                            </Col>
                        </Row>
                        <div className="footer-modal">
                            <Button type="submit" className="btn primary modal-btn-submit">{isEdit ? 'Update' : 'Add'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer />
            </Modal>
        </>
    )
}

export default SubCategory;