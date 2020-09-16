import React, { Component, Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { apiservice } from '../../../services';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import { toast } from 'react-toastify';
import { colors } from '@material-ui/core';
import CKEditors from "react-ckeditor-component";

export class Tabset_product extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
        this.onCKeditorChange = this.onCKeditorChange.bind(this)
        this.onproCatChange = this.onproCatChange.bind(this)
    }
    onCKeditorChange(event) {
        var newContent = event.editor.getData();
        this.setState({content : newContent});
    }
   
    onproCatChange(value){
        this.setState({parent_cat:value})
    }
    // componentWillMount() {
    //     apiservice.getAll('customersgroups/customers_groups_listing')
    //         .then((val) => {
    //             this.setState({ customerGroup: val.result })
                
    //         })

    // }

    render() {
        return (
            <Fragment>
                <Formik
                    initialValues={{
                        name: '',
                        price: '',
                        sales_tax: '',
                        description: '',

                    }}

                    validationSchema={Yup.object().shape({
                        
                        name: Yup.string().required('First Name is required.'),
                        price:  Yup.number().required('Product Price is required.')
                        .min(0,'Product Price allow min 0.'),
                        sales_tax:  Yup.number().required('Product sales_tax is required.')
                        .min(0,'Product sales_tax allow min 0.'),
                     

                        
                
                       
                    })}

                    onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                        setStatus();
                        var body = {
                            name:values.name,
                            price:values.price,
                            sales_tax:values.sales_tax,
                            description: {
                                "address": [
                                       {
                                            "address_type":"acc",
                                            "address_line1":"demo",
                                            "address_line2":"demo",
                                            "state_name":"gujrat",
                                            "state_code":"364001",
                                            "city_name":"bhavnagar",
                                            "zip_code":"101010"
                                        },
                                        {
                                            "address_type":"acc",
                                            "address_line1":"demo",
                                            "address_line2":"demo",
                                            "state_name":"gujrat",
                                            "state_code":"364001",
                                            "city_name":"bhavnagar",
                                            "zip_code":"101010"
                                        }
                                   ]
                            }
                            
                        }
                        console.log("dsfsdds",body.description)
                        console.log("body data form reat from:"+JSON.stringify(body))
                        apiservice.create('product/add_product', JSON.stringify(body))
                                    .then(val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('successfully add product.');
                                            this.props.history.push({pathname:'/purchases/products'});
                                          
                                        }else{
                                            toast.error("Something Wrong Please try again.")
                                        }
                                    }, error => {
                                        setSubmitting(false);
                                        toast.error(error)
                                    })
                    }}
                    render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                        <Form style={{ display: "inherit", width: "100%" }}>
                            <Tabs>
                                <TabList className="nav nav-tabs tab-coupon" >
                                    <Tab className="nav-link">Information</Tab>
                                </TabList>
                                <TabPanel>
                                    <h4>General</h4>
                                   
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
                                                                placeholeder
                                                                content={this.state.content}
                                                                events={{
                                                                    "change": this.onCKeditorChange
                                                                }}
                                                            />
                                                        </div>
                                      
                                    </div>
                                  
                                </TabPanel>
                            </Tabs>
                            <div className="buttom-left">
                                <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                    {isSubmitting &&
                                        <div className="spinner-glow spinner-glow-danger"></div>
                                    }
                                    <span>Save</span>
                                </button>
                            </div>
                        </Form>
                    )}
                />
            </Fragment>
        )
    }
}

export default Tabset_product