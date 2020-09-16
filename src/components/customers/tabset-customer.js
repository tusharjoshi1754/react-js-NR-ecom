import React, { Component, Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { apiservice } from '../../services';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import { toast } from 'react-toastify';


export class Tabset_customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerGroup: undefined,
            passwordShow: true
        }
        this.showHide = this.showHide.bind(this);
    }

    showHide(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            passwordShow: this.state.passwordShow ? false : true
        })  
      }
    

    componentWillMount() {
        apiservice.getAll('customersgroups/customers_groups_listing')
            .then((val) => {
                this.setState({ customerGroup: val.result })
            })

    }

    render() {
        return (
            <Fragment>
                <Formik
                    initialValues={{
                        customer_group: '',
                        prefix: '',
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        email: '',
                        dob: '',
                        gender: '',
                        password: '',
                        passwordConfirmation: ''
                    }}

                    validationSchema={Yup.object().shape({
                        customer_group: Yup.string().required('Customer Group is required.'),
                        firstname: Yup.string().required('First Name is required.'),
                        lastname: Yup.string().required('Last Name is required.'),
                        email: Yup.string().required('Email Id is required.')
                                .email('Enter Valid Email Id'),
                        password: Yup.string().required('Password is required.')
                            .min(8, 'Password is too short - should be 8 chars minimum.'),
                        passwordConfirmation: Yup.string().required('Confirm Password is required.')
                            .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    })}

                    onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                        setStatus();
                        var body = {
                            customer_group: values.customer_group,
                            prefix: values.prefix,
                            firstname: values.firstname,
                            middlename: values.middlename,
                            lastname: values.lastname,
                            email: values.email,
                            dob: values.dob,
                            gender: values.gender,
                            password: values.password
                        }
                        apiservice.create('customers/add', JSON.stringify(body))
                                    .then(val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('successfully add Customer.');
                                            this.props.history.push({pathname:'/users/list-customers'});
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
                                    <Tab className="nav-link">Account Information</Tab>
                                </TabList>
                                <TabPanel>
                                    <h4>Account Information</h4>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Customer Group</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field component="select" name="customer_group"
                                                className={'form-control' + (errors.customer_group && touched.customer_group ? ' is-invalid' : '')}>
                                            
                                                <option value=""></option>
                                                {
                                                    this.state.customerGroup && this.state.customerGroup.map(val => {
                                                        return (
                                                            <option key={val.id} value={val._id}>{val.cust_grp_name}</option>
                                                        )
                                                    })
                                                }
                                            </Field>
                                            <ErrorMessage name="customer_group" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Name Prefix</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="prefix" id="validationCustom01" type="text" className={'form-control' + (errors.prefix && touched.prefix ? ' is-invalid' : '')} />
                                            <ErrorMessage name="prefix" component="div" className="invalid-feedback" />
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> First Name</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="firstname" id="validationCustom01" type="text" className={'form-control' + (errors.firstname && touched.firstname ? ' is-invalid' : '')} />
                                            <ErrorMessage name="firstname" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Middle Name/Initial</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="middlename" id="validationCustom01" type="text" className={'form-control' + (errors.middlename && touched.middlename ? ' is-invalid' : '')} />
                                            <ErrorMessage name="middlename" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Last Name</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="lastname" id="validationCustom01" type="text" className={'form-control' + (errors.lastname && touched.lastname ? ' is-invalid' : '')} />
                                            <ErrorMessage name="lastname" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Email</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="email" id="validationCustom01" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Date of Birth</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="dob" id="validationCustom01" render={({ field, form })=>(
                                                <DatePickerInput
                                                displayFormat= "DD MMMM YYYY"
                                                placeholder="Date of Birth"
                                                showOnInputClick
                                                onChange={(jsDate, dateString) =>{
                                                    if(dateString != 'Invalid date')
                                                        form.setFieldValue('dob', dateString)
                                                }}
                                                className='my-custom-datepicker-component'
                                                />
                                            )} className={'form-control' + (errors.dob && touched.dob ? ' is-invalid' : '')} />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
                                        
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Gender</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field component="select" name="gender"
                                                className={'form-control' + (errors.gender && touched.gender ? ' is-invalid' : '')}>
                                                <option value=""></option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Not Specified">Not Specified</option>
                                            </Field>
                                            <ErrorMessage name="gender" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <h4>Password Information</h4>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Password</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="password" id="validationCustom01" type={this.state.passwordShow ? 'text' : 'password'} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                            <button className="showhidebutton" onClick={this.showHide}>{this.state.passwordShow ? 'Hide' : 'Show'}</button>
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Confirm Password</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="passwordConfirmation" id="validationCustom01" type='password' className={'form-control' + (errors.passwordConfirmation && touched.passwordConfirmation ? ' is-invalid' : '')} />
                                            <ErrorMessage name="passwordConfirmation" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                            <div className="pull-right">
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

export default Tabset_customer
