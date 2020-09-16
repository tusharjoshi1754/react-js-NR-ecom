import React, { Component, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Breadcrumb from '../../common/breadcrumb';
import '../../../assets/css/toggle/toggle.css';
import '../../../assets/css/custom-style.css';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { apiservice } from '../../../services';

import 'antd/dist/antd.css';
import { Select } from 'antd';
import { Loader } from '../../Loader';
import CKEditors from "react-ckeditor-component";
const { Option } = Select;


class editproduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
           
            editProductData: undefined,
            productId:this.props.match.params.id
        }
        this.handleChange = this.handleChange.bind(this)
        this.onCKeditorChange = this.onCKeditorChange.bind(this)
        
    }

    handleChange(event) {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        })
      }
    componentWillMount(){
       
        apiservice.getOne('product/findbyidproduct',this.state.productId)
            .then((val)=>{
                console.log('data',val);
                this.setState({editProductData: val.result, content: val.result.description})
            })
        
    }
    onCKeditorChange(event) {
        var newContent = event.editor.getData();
        this.setState({content : newContent});
    }

   
    
    render() {
        if (!this.state.editProductData) return (<Loader />);
       
        return (
            <Fragment>
                <Breadcrumb title="Edit Product" parent="Products" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <Formik
                            initialValues={{
                                name: this.state.editProductData.name,
                                price: this.state.editProductData.price,
                                sales_tax: this.state.editProductData.sales_tax,
                                description: this.state.editProductData.description,
                        
                            }}
                            
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required('First Name is required.'),
                                price:  Yup.number().required('Product Price is required.')
                                .min(0,'Product Price allow min 0.'),
                                sales_tax:  Yup.number().required('Product sales_tax is required.')
                                .min(0,'Product sales_tax allow min 0.'),
                            })}
                            onSubmit={(values, { setStatus, setSubmitting }) => {
                                setStatus();
                                var Json = {
                                    "name":values.name,
                                    "price":values.price,
                                    "sales_tax":values.sales_tax,
                                    "description": this.state.content
                                    
                                }
                                
                                apiservice.updateOne('product/product_update', JSON.stringify(Json),this.state.productId)
                                    .then( val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('Successfully updated product.');
                                            this.props.history.push({pathname:'/purchases/products'});
                                        }else{
                                            toast.error("Something Wrong Please try again.")
                                        }
                                    }, error => {
                                        setSubmitting(false);
                                        toast.error(error,{
                                            position: toast.POSITION.TOP_CENTER
                                          })
                                    } )
                            }}
                            render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form style={{ display: "inherit", width: "100%" }}>
                                    <div className="col-xl-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>General</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    
                                                <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span>Name</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="name" id="validationCustom01" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span>Price</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="price" id="validationCustom01" type="text" className={'form-control' + (errors.price && touched.price ? ' is-invalid' : '')} />
                                            <ErrorMessage name="price" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span>sales tax</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="sales_tax" id="validationCustom01" type="text" className={'form-control' + (errors.sales_tax && touched.sales_tax ? ' is-invalid' : '')} />
                                            <ErrorMessage name="sales_tax" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Description</label>
                                        
                                        <div className="col-xl-8 col-md-7"> 
                                                            <CKEditors
                                                                activeclassName="p10"
                                                                content={this.state.content}
                                                                events={{
                                                                    "change": this.onCKeditorChange
                                                                }}
                                                            />
                                                          
                                                        </div>
                                        
                                                       
                                    </div>
                                    
                                    <div className="buttom-left">
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