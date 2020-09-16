import React, { Component, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Breadcrumb from '../../common/breadcrumb';
import '../../../assets/css/toggle/toggle.css';
import '../../../assets/css/custom-style.css'
import * as Yup from 'yup';
import CKEditors from "react-ckeditor-component";
import classNames from "classnames";
import { toast } from 'react-toastify';
import { DatePickerInput } from 'rc-datepicker';
import ImageInput from "../../common/fileUpload/ImageInput";
import { apiservice } from '../../../services';
import 'antd/dist/antd.css';
import { TreeSelect } from 'antd';
import 'rc-datepicker/lib/style.css';
import * as config from '../../../config.json';
import { Loader } from '../../Loader';
export class addproduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            file: null,
           
            receiptsData:null,
            editProductData: undefined,
            rId:this.props.match.params.id,
            payment_account: undefined,
            currency:undefined,
            category:undefined,
            currencyData :null,
            categoryData:null,
            selectedcat:null,
            accountData: [
                { name: 'Cash on Hand'},
                { name: 'Common Shares'},
                { name: 'Shareholder Loan'},
                {name: 'Taxes Payable'},
                {name: 'Taxes Recoverable/Refundable'}
             
              ]
        }
        this.handleChange = this.handleChange.bind(this)       
        this.selectacc = this.selectacc.bind(this)
        this.selectcurrency = this.selectcurrency.bind(this)
        this.selectcategory = this.selectcategory.bind(this)

      
    }


  
    componentWillMount(){
        apiservice.getOne('receipts/receipt_findbyid', this.state.rId)
            .then((val)=>{
                console.log("val",val);
                this.setState({receiptsData: val, selectedcat : val.category})
              
                
            })
            apiservice.getAll('currency/listing_currency')
            .then((val)=>{
                this.setState({currencyData: val.result})
                console.log(this.state.receiptsData.result.category)
            })
            apiservice.getAll('category/getlisting')
            .then((val)=>{
                this.setState({categoryData: val.result})
            })
            
    }
    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }
   

      
selectacc(event){
    this.setState({payment_account: event.target.value});
}
selectcurrency(event){
    this.setState({currency: event.target.value});
}
selectcategory(event){
    this.setState({category: event.target.value});
}
    
   
    render() {
        const SUPPORTED_FORMATS = [
            "image/jpg",
            "image/jpeg",
            "image/gif",
            "image/png"
        ];
        if (!this.state.receiptsData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Edit Receipts" parent="Receipts" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <Formik
                            initialValues={{
                                
                                merchant :this.state.receiptsData.result.merchant,
                                date:this.state.receiptsData.result.date,
                                notes:this.state.receiptsData.result.notes,
                                category: this.state.receiptsData.result.category,
                                payment_account:this.state.receiptsData.result.payment_account,
                                subtotal:this.state.receiptsData.result.subtotal,
                                currency:this.state.receiptsData.result.currency,
                                total:this.state.receiptsData.result.total,
                                receipt_image:null
                                
                            }}

                            validationSchema={Yup.object().shape({
                                merchant: Yup.string().required('merchant is required.'),
                                date: Yup.string().required('date is required.'),
                                // category: Yup.string().required('category is required.'),
                                // currency: Yup.string().required('currency is required.'),
                                // payment_account: Yup.string().required('payment account is required.'),
                                subtotal: Yup.number().required('subtotal is required.')
                                .min(0,'Product Price allow min 0.'),
                                total: Yup.number().required('total is required.'),
                                
                                receipt_image: Yup.mixed().test("fileFormat",
                                    "Unsupported File Format", (value) => { if (!value) { return true; } else { if (SUPPORTED_FORMATS.includes(value.type)) { return true; } else { return false; } } })
                            })}
                            onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                                setStatus();
                                let formData = new FormData();
                             
                                formData.append("merchant",values.merchant);
                                formData.append("date",values.date);
                                formData.append("notes",values.notes);
                                formData.append("category",this.state.category);
                                formData.append("payment_account",this.state.payment_account);
                                formData.append("subtotal",values.subtotal);
                                formData.append("currency",this.state.currency);
                                formData.append("total",values.total);
                                console.log(values.receipt_image)
                                if(values.receipt_image){
                                    formData.append("receipt_image", values.receipt_image);    
                                }
                                apiservice.updateOnewithForm('receipts/receipt_update', formData, this.state.rId)
                                .then(val => {
                                    setSubmitting(false);
                                    if(val){
                                        toast.success('successfully update Receipts.');
                                        this.props.history.push({pathname:'/purchases/Receipts'});
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
                                                        <label className="col-form-label pt-0"><span>*</span>Merchant</label>
                                                        <Field name="merchant" id="validationCustom01"  type="text" className={'form-control' + (errors.merchant && touched.merchant ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="merchant" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Date</label>
                                                     
                                                                            <Field name="date" id="validationCustom01" render={({ field, form })=>(
                                                                                <DatePickerInput
                                                                                displayFormat= "DD MMMM YYYY"
                                                                                placeholder="Enter Date"
                                                                                showOnInputClick
                                                                                onChange={(jsDate, dateString) =>{
                                                                                    if(dateString != 'Invalid date')
                                                                                        Form.setFieldValue('date', dateString)
                                                                                        console.log('hii',Date)
                                                                                }}
                                                                                className='my-custom-datepicker-component'
                                                                                />
                                                                            )} className={'form-control' + (errors.date && touched.date ? ' is-invalid' : '')} />
                                                                            <ErrorMessage name="date" component="div" className="invalid-feedback" />
                                                   
                                                    </div>
                                                      
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>category</label>
                                                        <select
                                                            onChange={this.selectcategory}
                                                            name="category" 
                                                            className={'form-control' + (errors.tax_id && touched.tax_id ? ' is-invalid' : '')}
                                                            // value={this.state.receiptsData.result.category } 
                                                        >
                                                            
                                                            <option value="">None</option>
                                                           {
                                                               
                                                               
                                                               this.state.categoryData && this.state.categoryData.map(val =>{
                                                                // selected={this.state.receiptsData.result.category == val.id ? "true":'' }
                                                                   return (
                                                                       <option key={val.id} value={val.name}  selected={val.name==this.state.receiptsData.result.category}>{val.name}</option>
                                                                   )
                                                               })
                                                           }
                                                        </select>
                                                        {/* <Field name="category" id="validationCustom01" type="text" className={'form-control' + (errors.category && touched.category ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="category" component="div" className="invalid-feedback" /> */}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Payment account</label>
                                                        <select
                                                            onChange={this.selectacc}
                                                            name="payment_account" 
                                                            // value={this.state.receiptsData.result.payment_account}
                                                          
                                                            className={'form-control' + (errors.payment_account && touched.payment_account ? ' is-invalid' : '')}
                                                        >
                                                            <option value="null">None</option>
                                                            {
                                                               
                                                               
                                                               this.state.accountData && this.state.accountData.map(val =>{
                                                                // selected={this.state.receiptsData.result.category == val.id ? "true":'' }
                                                                   return (
                                                                       <option key={val.id} value={val.name}  selected={val.name==this.state.receiptsData.result.payment_account}>{val.name}</option>
                                                                   )
                                                               })
                                                           }
                                                           


                                                          
                                                        </select>
                                                        {/* <Field name="payment_account" id="validationCustom01" type="text" className={'form-control' + (errors.payment_account && touched.payment_account ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="payment_account" component="div" className="invalid-feedback" /> */}
                                                    </div>                          
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>subtotal</label>
                                                        <Field name="subtotal" id="validationCustom01" type="text" min="1" className={'form-control' + (errors.subtotal && touched.subtotal ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="subtotal" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>currency</label>
                                                          <select
                                                            onChange={this.selectcurrency}
                                                            name="currency" 
                                                            // value={this.state.receiptsData.result.currency}
                                                            className={'form-control' + (errors.tax_id && touched.tax_id ? ' is-invalid' : '')}
                                                        >
                                                            <option value="">None</option>
                                                           {
                                                               this.state.currencyData && this.state.currencyData.map(val =>{
                                                                   return (
                                                                       <option key={val.id} value={val.name} selected={val.name==this.state.receiptsData.result.currency}>{val.name}</option>
                                                                   )
                                                               })
                                                           }
                                                        </select>
                                                        {/* <Field name="currency" id="validationCustom01" type="text" className={'form-control' + (errors.currency && touched.currency ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="currency" component="div" className="invalid-feedback" /> */}
                                                    </div> 
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>total</label>
                                                        <Field name="total" id="validationCustom01" type="text" min="1" className={'form-control' + (errors.total && touched.total ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="total" component="div" className="invalid-feedback" />
                                                    </div>
                                                    



                                                   
                                                </div>
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
                                                        <label className="col-form-label">Note</label>
                                                        <Field name="notes" component="textarea" rows="4" cols="12"  />
                                                       
                                                    </div>
                                                           
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Upload a receipt</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                <label className="col-form-label pt-0"> Image Upload</label>
                                                    <Field
                                                        name="receipt_image"
                                                        component={ImageInput}
                                                        title="Select a Image"
                                                        setFieldValue={setFieldValue}
                                                        errorMessage={errors["receipt_image"] ? errors["receipt_image"] : undefined}
                                                        touched={touched["file"]}
                                                        style={{ display: "flex" }}
                                                    />
                                                    <ErrorMessage name="receipt_image" component="div" className="invalid-feedback" />
                                                    {this.state.receiptsData.result.receipt_image ?
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"> Old Receipt Image</label><br></br>
                                                        <img src={config.Resource_URL + this.state.receiptsData.result.receipt_image} style={{ width: "40%" }}/>
                                                    </div>
                                                    : null}
                                                    <br></br>
                                                    <div className="form-group mb-0">
                                                        <div className="product-buttons text-center">
                                                            <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                                                {isSubmitting &&
                                                                    <div className="spinner-glow spinner-glow-danger"></div>
                                                                }
                                                                <span>Edit</span>
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
export default addproduct;
