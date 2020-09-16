import React, { Component, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Breadcrumb from '../../common/breadcrumb';
import '../../../assets/css/toggle/toggle.css';
import * as Yup from 'yup';
import CKEditors from "react-ckeditor-component";
import classNames from "classnames";
import { toast } from 'react-toastify';

import ImageInput from "../../common/fileUpload/ImageInput";
import { apiservice } from '../../../services';
import 'antd/dist/antd.css';
import { TreeSelect } from 'antd';
import * as config from '../../../config.json';
import { Loader } from '../../Loader';

const { TreeNode } = TreeSelect;
const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    ...props
}) => {
    return (
        <div>
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === value}
          onChange={onChange}
          onBlur={onBlur}
          className={classNames("radio_animated")}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
};

const Tree = (data) =>{
    return data && data.map(item =>{
        return(
            <TreeNode value={item.id} title={item.categories_name} key={item.id} disabled={!item.enable_categories}>
                {item.children && Tree(item.children)}
            </TreeNode>
        )
    });
}

export class editproduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            file: null,
            categoryData: undefined,
            proId: this.props.match.params.id,
            taxData: undefined,
            taxSelected: undefined,
            proCategories: undefined,
            productData: undefined
        }
        this.handleChange = this.handleChange.bind(this)
        this.selectTax = this.selectTax.bind(this)
        this.onCKeditorChange = this.onCKeditorChange.bind(this)
        this.onproCatChange = this.onproCatChange.bind(this)
    }

    componentWillMount(){
        apiservice.getOne('catalog/products/productbyid', this.state.proId)
            .then((val)=>{
                console.log(val);
                this.setState({productData: val, content: val.list.description, proCategories:val.categories_id})
            })
        apiservice.getAll('taxs/taxslisting')
            .then((val)=>{
                this.setState({taxData: val.result})
            })
        apiservice.getAll('catalog/categories/categoriestree')
            .then((val)=>{
                this.setState({categoryData: val})  
            })
            
    }

    onproCatChange(value){
        console.log(value);
        this.setState({proCategories:value})
    }

    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }
    selectTax(event){
        this.setState({taxSelected: event.target.value});
    }

    onCKeditorChange(event) {
        var newContent = event.editor.getData();
        this.setState({ content: newContent });
    }
    
   
    render() {
        const SUPPORTED_FORMATS = [
            "image/jpg",
            "image/jpeg",
            "image/gif",
            "image/png"
        ];
        if (!this.state.productData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="edit Product" parent="product" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <Formik
                            initialValues={{
                                enable_product: this.state.productData.list.status.toString(),
                                product_name: this.state.productData.list.product_name,
                                product_sku: this.state.productData.list.sku,
                                product_categories: this.state.productData.categories_id,
                                sort_summery: this.state.productData.list.sort_summery,
                                description: this.state.productData.list.description,
                                meta_title: this.state.productData.list.meta_title,
                                meta_description: this.state.productData.list.meta_description,
                                product_price: this.state.productData.list.product_price,
                                url: this.state.productData.list.url,
                                product_image: null,
                                tax_id: this.state.productData.list.tax_id,
                                product_quantity:this.state.productData.list.product_qty,
                                meta_value:this.state.productData.list.meta_value
                            }}

                            validationSchema={Yup.object().shape({
                                enable_product: Yup.string().required('Status is required.'),
                                product_name: Yup.string().required('Product Name is required.'),
                                product_categories: Yup.string().required('Product Categories is required.'),
                                product_sku: Yup.string().required('Product SKU is required')
                                .trim()
                                .matches(/^[a-z0-9-]+$/,"Please input alphabet and numeric characters only"),
                                product_price: Yup.number().required('Product Price is required.')
                                .min(0,'Product Price allow min 0.'),
                                product_quantity: Yup.number().required('Product Qty is required.')
                                .min(0,'Product Qty allow min 0.'),
                                url: Yup.string().required('URL is required.')
                                .trim()
                                .matches(/^[a-z]+$/,"Please input alphabet characters only"),
                                product_image: Yup.mixed().nullable().test("fileFormat",
                                    "Unsupported File Format", (value) => { if (!value) { return true; } else { if (SUPPORTED_FORMATS.includes(value.type)) { return true; } else { return false; } } })
                            })}
                            onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                                setStatus();
                                let formData = new FormData();


                                if(this.state.taxSelected){
                                    formData.append("tax_id", this.state.taxSelected)
                                }else{
                                    formData.append("tax_id", "")
                                }

                                if(values.enable_product == "false"){
                                    formData.append("status", false)
                                }else{
                                    formData.append("status", true)
                                }
                                formData.append("product_name",values.product_name);
                                formData.append("sku",values.product_sku);
                                formData.append("sort_summery",values.sort_summery);
                                formData.append("description",this.state.content);
                                formData.append("meta_title",values.meta_title);
                                formData.append("meta_description",values.meta_description);
                                formData.append("product_price",values.product_price);
                                formData.append("url",values.url);
                                formData.append("categories", values.product_categories.join(","));
                                formData.append("qty",values.product_quantity);

                                if(values.product_image){
                                    formData.append("product_image", values.product_image);    
                                }
                                
                                
                                apiservice.updateOnewithForm('catalog/products/update', formData, this.state.proId)
                                    .then(val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('successfully update Product.');
                                            this.props.history.push({pathname:'/catalog/products'});
                                        }else{
                                            toast.error("Something Wrong Please try again.")
                                        }
                                    }, error => {
                                        setSubmitting(false);
                                        toast.error(error, {
                                            position: toast.POSITION.TOP_CENTER
                                        })
                                    })
                            }}
                            render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form style={{ display: "inherit", width: "100%" }}>
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>General</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    <div className="form-group">
                                                        <label className="col-form-label"><span>*</span> Status</label>
                                                        <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                            <Field
                                                                component={RadioButton}
                                                                name="enable_product"
                                                                id="true"
                                                                label="Enable"
                                                            />
                                                            <Field
                                                                component={RadioButton}
                                                                name="enable_product"
                                                                id="false"
                                                                label="Disable"
                                                            />
                                                        </div>
                                                        <ErrorMessage name="enable_product" style={{ display: 'block' }} component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Categories</label>
                                                        
                                                        <Field name="product_categories" id="validationCustom01" render={({ field, form })=>(
                                                            this.state.categoryData ? <TreeSelect
                                                                showSearch
                                                                value={this.state.proCategories}
                                                                className={'form-control' + (errors.product_categories && touched.product_categories ? ' is-invalid' : '')}
                                                                dropdownStyle={{ overflow: 'auto' }}
                                                                placeholder="Please select"
                                                                allowClear
                                                                multiple
                                                                treeDefaultExpandAll
                                                                onChange={e =>{this.onproCatChange(e)
                                                                    form.setFieldValue('product_categories', e)}}
                                                            >
                                                                {Tree(this.state.categoryData)}
                                                            </TreeSelect> : ('Loading Categories....')
                                                            
                                                        )} className={'form-control' + (errors.product_categories && touched.product_categories ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="product_categories" component="div" className="invalid-feedback" />
                                                    </div>
                                                    
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Product Name</label>
                                                        <Field name="product_name" id="validationCustom01" type="text" className={'form-control' + (errors.product_name && touched.product_name ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="product_name" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Product sku</label>
                                                        <Field name="product_sku" id="validationCustom01" type="text" className={'form-control' + (errors.product_sku && touched.product_sku ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="product_sku" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Product Price</label>
                                                        <Field name="product_price" id="validationCustom01" type="text" min="1" className={'form-control' + (errors.product_price && touched.product_price ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="product_price" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                  <label className="col-form-label pt-0"><span>*</span>Product Quantity</label>
                                                  <Field name="product_quantity" id="validationCustom01" type="text" min="0" className={'form-control' + (errors.product_quantity && touched.product_quantity ? ' is-invalid' : '')} />
                                                  <ErrorMessage name="product_quantity" component="div" className="invalid-feedback" />
                                              </div> 
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0">Tax Class</label>
                                                        <select
                                                            onChange={this.selectTax}
                                                            name="tax_id" 
                                                            className={'form-control' + (errors.tax_id && touched.tax_id ? ' is-invalid' : '')}
                                                            value={this.state.productData.list.tax_id}
                                                        >
                                                            <option value="">None</option>
                                                           {
                                                               this.state.taxData && this.state.taxData.map(val =>{
                                                                   return (
                                                                       <option key={val.id} value={val._id}>{val.name}</option>
                                                                   )
                                                               })
                                                           }
                                                        </select>
                                                        <ErrorMessage name="tax_id" component="div" className="invalid-feedback" />
                                                    </div>


                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span> URL</label>
                                                        <Field name="url" id="validationCustom01" type="text" className={'form-control' + (errors.url && touched.url ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="url" component="div" className="invalid-feedback" />
                                                    </div>


                                                    <label className="col-form-label pt-0"> Image Upload</label>
                                                    <Field
                                                        name="product_image"
                                                        component={ImageInput}
                                                        title="Select a image"
                                                        setFieldValue={setFieldValue}
                                                        errorMessage={errors["product_image"] ? errors["product_image"] : undefined}
                                                        touched={touched["file"]}
                                                        style={{ display: "flex" }}
                                                    />
                                                    <ErrorMessage name="product_image" component="div" className="invalid-feedback" />
                                                </div>
                                                {this.state.productData.list.product_image ?
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"> Old Product Image</label>
                                                        <img src={config.Resource_URL + this.state.productData.list.product_image} style={{ width: "100%" }}/>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Content</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    <div className="form-group">
                                                        <label className="col-form-label">Short Summery</label>
                                                        <Field name="sort_summery" component="textarea" rows="4" cols="12" className={(errors.sort_summery && touched.sort_summery ? 'is-invalid' : '')} />
                                                        <ErrorMessage name="sort_summery" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <div className="description-sm">
                                                            <CKEditors
                                                                activeclassName="p10"
                                                                content={this.state.content}
                                                                events={{
                                                                    "change": this.onCKeditorChange
                                                                }}
                                                            />
                                                        </div>
                                                        <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Meta Data</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"> Meta Title</label>
                                                        <Field className={'form-control' + (errors.meta_title && touched.meta_title ? ' is-invalid' : '')} name="meta_title" id="validationCustom05" type="text" />
                                                        <ErrorMessage name="meta_title" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"> Meta Value</label>
                                                        <Field className={'form-control' + (errors.meta_value && touched.meta_value ? ' is-invalid' : '')} name="meta_value" id="validationCustom05" type="text"  />
                                                        <ErrorMessage name="meta_value" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label">Meta Description</label>
                                                        <Field name="meta_description" component="textarea" rows="4" cols="12" className={(errors.meta_description && touched.meta_description ? 'is-invalid' : '')} />
                                                        <ErrorMessage name="meta_description" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <div className="product-buttons text-center">
                                                        <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                                            {isSubmitting &&
                                                                <div className="spinner-glow spinner-glow-danger"></div>
                                                            }
                                                            <span>Update</span>
                                                        </button>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default editproduct;
