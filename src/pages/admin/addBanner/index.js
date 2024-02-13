import { useEffect, useRef, useState } from "react";
import { Row, Dropdown, Button, Form, InputGroup, DropdownButton, Col, Modal, } from "react-bootstrap";
import defaultIcon from '../../../assests/icons/defaultSort.svg';
import closeIcon from '../../../assests/icons/close.svg';
import Sidebar from "../../sidebar";
import AdminHeader from "../adminHeader";
import { deleteData, fetchData, postData, updateData } from "../../../apis/api";
import CustomLoader from "../../customLoader/customLoader";
import CropperImage from "../../common/cropperImage";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const bannerSchema = Yup.object({
    bannerImage: Yup.string().required('Banner image is required'),
    heading: Yup.string().required('Heading is required'),
    categoryId: Yup.string().required('Select category'),
    subCategoryId: Yup.string().required('Select sub categoryId'),
    subheading: Yup.string().required('Sub heading is required'),
    ctaButton: Yup.string().required('CTA button is required'),
    status: Yup.string().required('Status is required')
});

const AddBanner = () => {

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, defaultValues }
      } = useForm({ resolver: yupResolver(bannerSchema) });
      console.log(errors, 'errorserrors', getValues());

    const [image, setImage] = useState("");
    const inputRef = useRef();
    const [previewImage, setPreviewImage] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [banner, setBanner] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bannerImage: '',
        heading: '',
        categoryId: '',
        subCategoryId: '',
        subheading: '',
        ctaButton: '',
        status: '',
    });

    // for deleting the row
    const [selectedItemId, setSelectedItemId] = useState(null);

    // for fetch the data
    useEffect(() => {
        if (selectedItemId) {
            console.log("delete call", selectedItemId);
            deleteData(`/banners/${selectedItemId}`)
                .then(() => {
                    setSelectedItemId(null);
                    fetchBanner();
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
            subCategoryId: '',
            bannerImage: '',
            heading: '',
            subheading: '',
            ctaButton: '',
            status: '',
        });
    }


    const apiRefresh = () => {
        fetchBanner();
        fetchSubCategories();
        handleClose();
    }

    //for submiting data into database
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(pre => ({ ...pre, [name]: value }));
        console.log('sdsdfsd', formData);
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
            setFormData(pre => ({ ...pre, bannerImage: result.url }));
            setIsLoading(false);
            setValue("bannerImage", result.url);
            console.log('Uploading images successfully:', result.url);
        })
        .catch((error) => {
            console.error("Uploading images into api");
            setIsLoading(false);
        });
    }

    const handlePostData = (data) => {
        bannerData(data);
    };

    const bannerData = (formData) => {
        // e.preventDefault();
        console.log("Banner data ", formData.bannerImage);
        const routeName = !isEdit ? '/banners' : `/banners/${formData.id}`;
        if (!isEdit) {
            postData(routeName, formData)
                .then((result) => {
                    console.log('Banner data post successfully:', result);
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
                    console.log('Banner data edit successfully:', result);
                    apiRefresh();
                    resetFormData();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // id = null means all category else selected id category
    const fetchSubCategories = (id = '') => {
        const routeName = "/subCategories";
        fetchData(routeName)
            .then((result) => {
                if (id === '') {
                    setSubCategory(result);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const fetchCategories = async () => {
        try{
            const result = await fetchData("/categories?isPaginate=false");
            setCategory(result?.data);
        }catch(err) {
            throw err;
        }
    }

    const fetchBanner = async (id) => {
        console.log("call edit function ", id);
        const routeName = id ? `/banners/${id}` : '/banners';
        console.log("call routeName ", routeName);
        try {
            const bannerData = await fetchData(routeName)
            if (id) {
                setFormData({
                    id: bannerData._id,
                    categoryId: bannerData.categoryId,
                    subCategoryId: bannerData.subCategoryId,
                    bannerImage: bannerData.bannerImage,
                    heading: bannerData.heading,
                    subheading: bannerData.subheading,
                    ctaButton: bannerData.ctaButton,
                    status: bannerData.status
                });
                setIsEdit(true);
                handleShow();
            } else {
                setBanner(bannerData);
                setIsEdit(false);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    // for fetch the data
    useEffect(() => {
        // Call the fetchData function
        fetchBanner();
        fetchSubCategories();
        fetchCategories();
    }, []);

    return (
        <>
            <div className="admin-common-body">
                <div className="admin-header-wrapper">
                    <h1 className="admin-header-title">Add Banner</h1>
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
                            }}>Add Banner</Button>
                        </div>
                    </div>
                </div>
                <div className="list-container service-list-container">
                    <div className="table-wrapper mobile-optimised">
                        <div className="thead">
                            <div className="row tr">
                                <div className="th flex-table-column-25" >
                                    <span className="table-heading">
                                        <span>Heading</span>
                                        <span className="icon-filter-custom">
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-25" >
                                    <span className="table-heading">
                                        <span>SubHeading</span>
                                        <span className="icon-filter-custom">
                                            <img src={defaultIcon} alt="filter icon" />
                                        </span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-25" >
                                    <span className="table-heading">
                                        <span>Logo</span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-15" >
                                    <span className="table-heading">
                                        <span>CTA</span>
                                    </span>
                                </div>
                                <div className="th flex-table-column-10 text-center">
                                    <span className="table-heading">
                                        <span>Status</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="tbody">
                            {banner?.map((item, index) => (
                                <div className="row tr" key={index + 1}>
                                    <div className="td flex-table-column-25">
                                        <p className="listing-title text-capitalize">{item.heading}</p>
                                    </div>
                                    <div className="td flex-table-column-25">
                                        <p className="listing-title text-capitalize">{item.subheading}</p>
                                    </div>
                                    <div className="td flex-table-column-25">
                                        <p className="listing-normal mb-0">
                                            <img src={item.bannerImage} alt="Banner pic" width="40" />
                                        </p>
                                    </div>
                                    <div className="td flex-table-column-15">
                                        <div>
                                            <p className="listing-normal mb-0">{item.ctaButton}</p>
                                        </div>
                                    </div>
                                    <div className="td flex-table-column-10">
                                        <div className="listing-normal">
                                            <div className="listing-normal text-center">
                                                <DropdownButton className="icon-three-dot manage-three-dot">
                                                    <Dropdown.Item onClick={() => fetchBanner(item._id)}> Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={() =>
                                                        setSelectedItemId(item._id)
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
                    <Modal.Title>{isEdit ? 'Update' : 'Add'} Banner</Modal.Title>
                    <img className="btn-close" src={closeIcon} alt="close icon" onClick={() => {
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
                                        <Form.Select {...register("categoryId")} name="categoryId" onChange={handleInputChange}>
                                            {!isEdit ? <option value="" default>Select Category</option> : ''}
                                            {category?.map((cat, index) => (
                                                <option value={cat?._id} key={index + 1}>{cat?.name}</option>
                                            )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <div className="wrap-select wrap-input">
                                    <Form.Label>SubCategory</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Select {...register("subCategoryId")} name="subCategoryId" onChange={handleInputChange}>
                                            {!isEdit ? <option value="" default>Select Sub Category</option> : ''}
                                            {subCategory?.map((subCat, index) => (
                                                <option value={subCat?._id} key={index + 1}>{subCat?.name}</option>
                                            )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} className="upload-file-wrapper">
                                <Form.Group className="form-mt-space react-upload-file">
                                    <Form.Label>Banner Image</Form.Label>
                                    <Form.Control {...register('file')} type="file" name='bannerImage' id="bannerImage" onChange={UploadImage} disabled={isLoading} />
                                </Form.Group>
                                {isLoading && <CustomLoader />}
                            </Col>
                            <Col xs={12} sm={12} className="p-0">
                                {previewImage && ( <CropperImage previewImage={previewImage} croppedImage= {croppedImage} />)}
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <Form.Group className="form-mt-space">
                                    <Form.Label>Heading</Form.Label>
                                    <div className="wrap-input">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter heading"
                                            name="heading"
                                            // value={formData.heading}
                                            onChange={handleInputChange}
                                            {...register("heading")}
                                            className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <Form.Group className="form-mt-space">
                                    <Form.Label>Sub-Heading</Form.Label>
                                    <div className="wrap-input">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter heading"
                                            name="subheading"
                                            // value={formData.subheading}
                                            onChange={handleInputChange}
                                            {...register("subheading")}
                                            className={`form-control ${errors.subheading ? 'is-invalid' : ''}`}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} className=" ">
                                <Form.Group className="form-mt-space">
                                    <Form.Label>CTA Button (e.g Register/Book Now)</Form.Label>
                                    <div className="wrap-input">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter ctaButton"
                                            name="ctaButton"
                                            // value={formData.ctaButton}
                                            onChange={handleInputChange}
                                            {...register("ctaButton")}
                                            className={`form-control ${errors.ctaButton ? 'is-invalid' : ''}`}
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

export default AddBanner;