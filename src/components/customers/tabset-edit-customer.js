import React, { Component, Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { Button } from 'react-bootstrap';
import { apiservice } from '../../services';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import { toast } from 'react-toastify';
import Tabset_addresses from './tabset-addresses';
import Modal from 'react-responsive-modal';
import 'antd/dist/antd.css';
import { Select } from 'antd';

const { Option } = Select;

export class Tabset_edit_customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            customerGroup: undefined,
            countryList: undefined,
            stateList: undefined,
            passwordShow: true,
            customerId: this.props.match.params.id,
            customerData: undefined,
            changePassword: undefined,
            customerAddresses: undefined,
            defaultBillingAddress: undefined,
            defaultShippingAddress: undefined,
            addressLoader: false
        }
        this.showHide = this.showHide.bind(this);
        this.defaultBillingChange = this.defaultBillingChange.bind(this);
        this.defaultShippingChange = this.defaultShippingChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this)
        this.onStateChange = this.onStateChange.bind(this)
    }

    showHide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            passwordShow: this.state.passwordShow ? false : true
        })
    }

    onCountryChange(value){
        this.setState({selectedCountry:value});
        const sList = apiservice.getStatesOfCountry(value);
       
        this.setState({stateList : sList});
    }

    onStateChange(value){
        this.setState({selectedState:value})
    }

    defaultBillingChange(e) {
        this.setState({ defaultBillingAddress: e.currentTarget.value, addressLoader: true })
        var body = {
            "customer_id": this.state.customerData._id,
            "default_billing": e.currentTarget.value
        }
        apiservice.updateWithoutID('customers/updatebilling', JSON.stringify(body))
            .then((val) => {
                this.setState({ addressLoader: false })
                toast.success('Successfully default billing address updated.');
            })
    }

    defaultShippingChange(e) {
        this.setState({ defaultShippingAddress: e.currentTarget.value, addressLoader: true })
        var body = {
            "customer_id": this.state.customerData._id,
            "default_shipping": e.currentTarget.value
        }
        apiservice.updateWithoutID('customers/updateshipping', JSON.stringify(body))
            .then((val) => {
                this.setState({ addressLoader: false })
                toast.success('Successfully default shipping address updated.');
            })
    }


    componentWillMount() {
        const cList = apiservice.getAllCountries();
        this.setState({countryList : cList});
        apiservice.getOne('customers/findbyidcustomer', this.state.customerId)
            .then((val) => {
                console.log(val);
                this.setState({ customerData: val.result, defaultBillingAddress: val.result.default_billing, defaultShippingAddress: val.result.default_shipping })
            })
        apiservice.getAll('customersgroups/customers_groups_listing')
            .then((val) => {
                this.setState({ customerGroup: val.result })
            })
        apiservice.getOne('customersaddress/findbycustomer_address', this.state.customerId)
            .then((val) => {
                this.setState({ customerAddresses: val.result })
            })

    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        const CountryTree = (data) =>{
            return data && data.length > 0 && data.map(item =>{
                return(
                    <Option value={item.id} key={item.id}>
                        {item.name}
                    </Option>
                )
            });
        }
        const StateTree = (data) =>{
            return data && data.length > 0 && data.map(item =>{
                return(
                    <Option value={item.id} key={item.id}>
                        {item.name}
                    </Option>
                )
            });
        }
        if (!this.state.customerData) return null;
        return (
            <Fragment>
                <Tabs>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link">Account Information</Tab>
                        <Tab className="nav-link">Addresses</Tab>
                    </TabList>
                    <TabPanel>
                        <Formik
                            initialValues={{
                                enable_in_changePassword: '',
                                customer_group: this.state.customerData.customer_group,
                                prefix: this.state.customerData.prefix,
                                firstname: this.state.customerData.firstname,
                                middlename: this.state.customerData.middlename,
                                lastname: this.state.customerData.lastname,
                                email: this.state.customerData.email,
                                dob: this.state.customerData.dob,
                                gender: this.state.customerData.gender,
                                password: '',
                                passwordConfirmation: ''
                            }}

                            validationSchema={Yup.object().shape({
                                customer_group: Yup.string().required('Customer Group is required.'),
                                firstname: Yup.string().required('First Name is required.'),
                                lastname: Yup.string().required('Last Name is required.'),
                                email: Yup.string().required('Email Id is required.')
                                    .email('Enter Valid Email Id'),
                                password: Yup.string().notRequired()
                                    .when('enable_in_changePassword', {
                                        is: true,
                                        then: Yup.string().required('Password is required.')
                                            .min(8, 'Password is too short - should be 8 chars minimum.'),
                                        otherwise: Yup.string().notRequired()
                                    }),
                                passwordConfirmation: Yup.string().notRequired()
                                    .when('enable_in_changePassword', {
                                        is: true,
                                        then: Yup.string().required('Confirm Password is required.')
                                            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
                                        otherwise: Yup.string().notRequired()
                                    })
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
                                    gender: values.gender
                                }
                                if (values.password) {
                                    body.password = values.password
                                }
                                apiservice.updateOne('customers/update', JSON.stringify(body), this.state.customerId)
                                    .then(val => {
                                        setSubmitting(false);
                                        if (val) {
                                            toast.success('successfully edit Customer.');
                                            //this.props.history.push({ pathname: '/users/list-customers' });
                                        } else {
                                            toast.error("Something Wrong Please try again.")
                                        }
                                    }, error => {
                                        setSubmitting(false);
                                        toast.error(error)
                                    })
                            }}
                            render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form style={{ display: "inherit", width: "100%" }}>
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
                                            <Field name="prefix" id="prefix" type="text" className={'form-control' + (errors.prefix && touched.prefix ? ' is-invalid' : '')} />
                                            <ErrorMessage name="prefix" component="div" className="invalid-feedback" />
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> First Name</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="firstname" id="firstname" type="text" className={'form-control' + (errors.firstname && touched.firstname ? ' is-invalid' : '')} />
                                            <ErrorMessage name="firstname" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Middle Name/Initial</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="middlename" id="middlename" type="text" className={'form-control' + (errors.middlename && touched.middlename ? ' is-invalid' : '')} />
                                            <ErrorMessage name="middlename" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Last Name</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="lastname" id="lastname" type="text" className={'form-control' + (errors.lastname && touched.lastname ? ' is-invalid' : '')} />
                                            <ErrorMessage name="lastname" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4"><span>*</span> Email</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="email" id="email" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Date of Birth</label>
                                        <div className="col-xl-8 col-md-7">
                                            <Field name="dob" id="dob" render={({ field, form }) => (
                                                <DatePickerInput
                                                    value={this.state.customerData.dob}
                                                    displayFormat="DD MMMM YYYY"
                                                    placeholder="Date of Birth"
                                                    showOnInputClick
                                                    onChange={(jsDate, dateString) => {
                                                        if (dateString != 'Invalid date')
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
                                    <div className="form-group row">
                                        <label className="col-xl-3 col-md-4">Change Password</label>
                                        <div className="checkbox-container green">
                                            <label className="switch">
                                                <Field type="checkbox" name="enable_in_changePassword" onChange={e => {
                                                    this.setState({
                                                        changePassword: this.state.changePassword ? false : true
                                                    })
                                                    setFieldValue("enable_in_changePassword", this.state.changePassword ? false : true)
                                                }} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.changePassword ? (
                                        <div>
                                            <h4>Password Information</h4>
                                            <div className="form-group row">
                                                <label className="col-xl-3 col-md-4"><span>*</span> Password</label>
                                                <div className="col-xl-8 col-md-7">
                                                    <Field name="password" id="password" type={this.state.passwordShow ? 'text' : 'password'} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <button className="showhidebutton" onClick={this.showHide}>{this.state.passwordShow ? 'Hide' : 'Show'}</button>
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-xl-3 col-md-4"><span>*</span> Confirm Password</label>
                                                <div className="col-xl-8 col-md-7">
                                                    <Field name="passwordConfirmation" id="passwordConfirmation" type='password' className={'form-control' + (errors.passwordConfirmation && touched.passwordConfirmation ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="passwordConfirmation" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                        </div>) : null}
                                    <div className="pull-right">
                                        <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                            {isSubmitting &&
                                                <div className="spinner-glow spinner-glow-danger"></div>
                                            }
                                            <span>Save Information</span>
                                        </button>
                                    </div>
                                </Form>

                            )}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Tabs className={'vertical-tabs' + (this.state.addressLoader ? ' loading-parent' : '')}>
                            <div className="row">
                                <div className="col-md-3">
                                    <TabList>
                                        {this.state.customerAddresses ?
                                            this.state.customerAddresses.map((val, index) =>
                                                (<Tab key={index}>
                                                    {this.state.addressLoader ? (<div className="loading"></div>) : null}
                                                    <div>
                                                        <b>{val.firstname} {val.lastname}</b>
                                                        <br />
                                                        {val.address}, {val.landmark}
                                                        <br />
                                                        {val.city}, {val.state}, {val.country} - {val.postalcode}
                                                        <br />
                                                        <b>T - {val.telephone}</b>
                                                        <br /><br />
                                                        <div className="form-group">
                                                            <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                                <div>
                                                                    <input
                                                                        name='default_billing_address'
                                                                        id={'billing' + index}
                                                                        value={val._id}
                                                                        checked={val._id == this.state.defaultBillingAddress}
                                                                        type="radio"
                                                                        className="radio_animated"
                                                                        onChange={this.defaultBillingChange}
                                                                    />
                                                                    <label htmlFor={'billing' + index}><b>Defualt Billing Address</b></label>
                                                                </div>
                                                            </div>
                                                            <ErrorMessage name="enable_categories" style={{ display: 'block' }} component="div" className="invalid-feedback" />
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                                <div>
                                                                    <input
                                                                        name='default_shipping_address'
                                                                        id={'shipping' + index}
                                                                        value={val._id}
                                                                        checked={val._id == this.state.defaultShippingAddress}
                                                                        type="radio"
                                                                        className="radio_animated"
                                                                        onChange={this.defaultShippingChange}
                                                                    />
                                                                    <label htmlFor={'shipping' + index}><b>Defualt Shipping Address</b></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab>)
                                            )
                                            : null}
                                        <br/>
                                        <button className="btn btn-primary pull-right" onClick={this.onOpenModal} data-toggle="modal">Add New Address</button>
                                        <Modal open={open} onClose={this.onCloseModal} >
                                            <Formik
                                                initialValues={{
                                                    prefix: '',
                                                    firstname: '',
                                                    lastname: '',
                                                    email: '',
                                                    address: '',
                                                    landmark: '',
                                                    city: '',
                                                    country: '',
                                                    state: '',
                                                    postalcode: '',
                                                    telephone: ''
                                                }}

                                                validationSchema={Yup.object().shape({
                                                    firstname: Yup.string().required('First Name is required.'),
                                                    lastname: Yup.string().required('Last Name is required.'),
                                                    email: Yup.string().required('Email Id is required.')
                                                        .email('Enter Valid Email Id'),
                                                    address: Yup.string().required('Address is required.'),
                                                    city: Yup.string().required('City is required.'),
                                                    country: Yup.string().required('Country is required.'),
                                                    state: Yup.string().required('State is required.'),
                                                    postalcode: Yup.string().required('Postal Code is required.')
                                                        .matches(/[0-9]{5}(-[0-9]{4})?/, 'Enter vaild Postal Code.')
                                                })}

                                                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                                                    setStatus();
                                                    const countryName = apiservice.getCountryNameById(values.country);
                                                    const stateName = apiservice.getStateNameById(values.state);
                                                    var body = {
                                                        "customer_id": this.state.customerId,
                                                        "prefix": values.prefix,
                                                        "firstname": values.firstname,
                                                        "lastname": values.lastname,
                                                        "email": values.email,
                                                        "telephone": values.telephone,
                                                        "country": countryName,
                                                        "state": stateName,
                                                        "city": values.city,
                                                        "postalcode": values.postalcode,
                                                        "landmark": values.landmark,
                                                        "address": values.address,
                                                    }
                                                    apiservice.create('customersaddress/add', JSON.stringify(body))
                                                        .then(val => {
                                                            if(val){
                                                                apiservice.getOne('customersaddress/findbycustomer_address', this.state.customerId)
                                                                .then((addval) => {
                                                                    
                                                                    this.setState({ customerAddresses: addval.result })
                                                                    setSubmitting(false);
                                                                    if (addval) {
                                                                        this.onCloseModal();
                                                                        toast.success('Successfully added Customer address.');
                                                                    }
                                                                })
                                                            } else {
                                                                toast.error("Something Wrong Please try again.")
                                                            }
                                                            
                                                        }, error => {
                                                            setSubmitting(false);
                                                            toast.error(error)
                                                        })
                                                }}
                                                render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                                                    <Form style={{ display: "inherit", width: "100%" }}>
                                                        <div className="modal-header">
                                                            <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add New Customer Address</h5>
                                                        </div>
                                                        <div className="modal-body">
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4">Name Prefix</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="prefix" id="prefix" type="text" className={'form-control' + (errors.prefix && touched.prefix ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="prefix" component="div" className="invalid-feedback" />
                                                            </div>

                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> First Name</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="firstname" id="firstname" type="text" className={'form-control' + (errors.firstname && touched.firstname ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="firstname" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> Last Name</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="lastname" id="lastname" type="text" className={'form-control' + (errors.lastname && touched.lastname ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="lastname" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> Email</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="email" id="email" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> Address</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="address" id="address" type="text" className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4">Landmark</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="landmark" id="landmark" type="text" className={'form-control' + (errors.landmark && touched.landmark ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="landmark" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> City</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="city" id="city" type="text" className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> Country</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="country" id="validationCustom01" render={({ field, form }) => (
                                                                    this.state.countryList && this.state.countryList.length > 0 ? <Select
                                                                        showSearch
                                                                        value={this.state.selectedCountry}
                                                                        className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')}
                                                                        placeholder="Select a Country"
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                        }
                                                                        onChange={e => {
                                                                            this.onCountryChange(e)
                                                                            form.setFieldValue('country', e)
                                                                            form.setFieldValue('state', '')
                                                                        }}
                                                                    >
                                                                        {CountryTree(this.state.countryList)}
                                                                    </Select> : (<p>No any Country Found.</p>)

                                                                )} className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> State</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="state" id="validationCustom01" render={({ field, form }) => (
                                                                    this.state.stateList && this.state.stateList.length > 0 ? <Select
                                                                        showSearch
                                                                        value={this.state.selectedState}
                                                                        className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')}
                                                                        placeholder="Select a State"
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                        }
                                                                        onChange={e => {
                                                                            this.onStateChange(e)
                                                                            form.setFieldValue('state', e)
                                                                        }}
                                                                    >
                                                                        {StateTree(this.state.stateList)}
                                                                    </Select> : <Select
                                                                        showSearch
                                                                        className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')}
                                                                        placeholder="Select First Country"
                                                                    >
                                                                        </Select>

                                                                )} className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> Postal Code</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="postalcode" id="postalcode" type="text" className={'form-control' + (errors.postalcode && touched.postalcode ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="postalcode" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-md-4"><span>*</span> Telephone</label>
                                                            <div className="col-xl-8 col-md-7">
                                                                <Field name="telephone" id="telephone" type="text" className={'form-control' + (errors.telephone && touched.telephone ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="telephone" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                                                {isSubmitting &&
                                                                    <div className="spinner-glow spinner-glow-danger"></div>
                                                                }
                                                                <span>Save Address</span>
                                                            </button>
                                                            <button type="button" className="btn btn-secondary" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                                                       
                                                        </div>
                                                    </Form>
                                                )}
                                            />
                                        </Modal>
                                    </TabList>
                                </div>
                                <div className="col-md-9">
                                    {this.state.customerAddresses ?
                                        this.state.customerAddresses.map((val, index) =>
                                            (
                                                <TabPanel key={index}>
                                                    <Tabset_addresses
                                                        {...this.props}
                                                        address={val}
                                                        customerId={this.state.customerData._id} />
                                                </TabPanel>
                                            )
                                        )
                                        : null}
                                </div>
                            </div>
                        </Tabs>
                    </TabPanel>
                </Tabs>
            </Fragment>
        )
    }
}

export default Tabset_edit_customer
