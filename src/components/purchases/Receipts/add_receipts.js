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



export class addproduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            file: null,
            payment_account: undefined,
            currency:undefined,
            category:undefined,
            currencyData :null,
            categoryData:null
        }
        this.handleChange = this.handleChange.bind(this)
        this.selectacc = this.selectacc.bind(this)
        this.selectcurrency = this.selectcurrency.bind(this)
        this.selectcategory = this.selectcategory.bind(this)
      
    }

    componentWillMount(){
        apiservice.getAll('currency/listing_currency')
        .then((val)=>{
            this.setState({currencyData: val.result})
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
        
        return (
            <Fragment>
                <Breadcrumb title="Add New Product" parent="product" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <Formik
                            initialValues={{
                                merchant :'',
                                date:'',
                                notes:'',
                                category: '',
                                payment_account:'',
                                subtotal:'',
                                currency:'',
                                total:'',
                                receipt_image:''
                                
                            }}

                            validationSchema={Yup.object().shape({
                                merchant: Yup.string().required('merchant is required.'),
                                date: Yup.string().required('date is required.'),
                                // category: Yup.string().required('category is required.'),
                                // currency: Yup.string().required('currency is required.'),
                                //payment_account: Yup.mixed().required("Payment account").nullable().demo("","",(value) => { if (!value) { return true; } else {"is notvalid " }}),
                                subtotal: Yup.number().required('subtotal is required.')
                                .min(0,'Product Price allow min 0.'),
                                total: Yup.number().required('total is required.'),
                                
                                receipt_image: Yup.mixed().required('Receipt Image is Required.').test("fileFormat",
                                    "Unsupported File Format", (value) => { if (!value) { return true; } else { if (SUPPORTED_FORMATS.includes(value.type)) { return true; } else { return false; } } })
                            })}
                            onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                                if(this.state.payment_account == null){
                                    toast.error("select payment account!..");
                                }else if(this.state.category == null){
                                    toast.error("select category!..");
                                }else if(this.state.currency ==  null){

                                    toast.error("select currency!..");
                                }else{
                                setStatus();
                                let formData = new FormData();
                            
                                    formData.append("payment_account", this.state.payment_account)
                                      formData.append("merchant",values.merchant);
                                formData.append("date",values.date);
                                formData.append("notes",values.notes);
                                formData.append("category",this.state.category);
                              
                                formData.append("subtotal",values.subtotal);
                                formData.append("currency",this.state.currency);
                                formData.append("total",values.total);
                                
                               
                                if(values.receipt_image){
                                    formData.append("receipt_image", values.receipt_image);    
                                }
                                
                                
                                apiservice.createWithForm('receipts/add_receipt', formData)
                                    .then(val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('successfully add Receipts.');
                                            this.props.history.push({pathname:'/purchases/Receipts'});
                                        }else{
                                            toast.error("Something Wrong Please try again.")
                                        }
                                    }, error => {
                                        setSubmitting(false);
                                        toast.error(error)
                                    })
                               
                                }
                              
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
                                                        <Field name="merchant" id="validationCustom01" type="text" className={'form-control' + (errors.merchant && touched.merchant ? ' is-invalid' : '')} />
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
                                                                                        form.setFieldValue('date', dateString)
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
                                                        >
                                                            <option value="">None</option>
                                                           {
                                                               this.state.categoryData && this.state.categoryData.map(val =>{
                                                                   return (
                                                                       <option key={val.id} value={val.name}>{val.name}</option>
                                                                   )
                                                               })
                                                           }
                                                        </select>
                                                        {/* <Field name="category" id="validationCustom01" type="text" className={'form-control' + (errors.category && touched.category ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="category" component="div" className="invalid-feedback" /> */}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span>Payment account</label>
                                                        {/* <Field name="payment_account" id="validationCustom01" type="text" className={'form-control' + (errors.payment_account && touched.payment_account ? ' is-invalid' : '')} /> */}
                                                        <select
                                                            onChange={this.selectacc}
                                                            name="payment_account" 
                                                            className={'form-control' + (errors.payment_account && touched.payment_account ? ' is-invalid' : '')}
                                                        >
                                                            <option value="null">None</option>
                                                            <option value="Cash on Hand">Cash on Hand</option>
                                                            <option value="Common Shares">Common Shares</option>
                                                            <option value="Shareholder Loan">Shareholder Loan</option>
                                                            <option value="Taxes Payable">Taxes Payable</option>
                                                            <option value="Taxes Recoverable/Refundable">Taxes Recoverable/Refundable</option>
                                                            


                                                          
                                                        </select>
                                                        <ErrorMessage name="payment_account" component="div" className="invalid-feedback" />
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
                                                            className={'form-control' + (errors.tax_id && touched.tax_id ? ' is-invalid' : '')}
                                                        >
                                                            <option value="">None</option>
                                                           {
                                                               this.state.currencyData && this.state.currencyData.map(val =>{
                                                                   return (
                                                                       <option key={val.id} value={val.name}>{val.name}</option>
                                                                   )
                                                               })
                                                           }
                                                        </select>
                                                    {/* <Field name="currency" id="validationCustom01" type="text" className={'form-control' + (errors.currency && touched.currency ? ' is-invalid' : '')} /> */}
                                                        {/* <ErrorMessage name="currency" component="div" className="invalid-feedback" /> */}
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
                                                    <br></br>
                                                    <div className="form-group mb-0">
                                                        <div className="product-buttons text-center">
                                                            <button type="submit" className='btn btn-primary'  >
                                                              
                                                                <span>Add</span>
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
