import React, { Component, Fragment } from 'react'
import { apiservice } from '../../services';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'rc-datepicker/lib/style.css';
import { toast } from 'react-toastify';

import 'antd/dist/antd.css';
import { Select } from 'antd';

const { Option } = Select;

export class Tabset_addresses extends Component {

    constructor(props) {
        console.log(props)
        super(props);
        this.state = {
            address: this.props.address,
            countryList: undefined,
            selectedCountry: undefined,
            stateList: undefined,
            selectedState: undefined,
        }
        this.onCountryChange = this.onCountryChange.bind(this)
        this.onStateChange = this.onStateChange.bind(this)
        
    }

    componentWillMount(){
        const cList = apiservice.getAllCountries();

        let country = apiservice.getCountryNameByName(this.state.address.country);
        const sList = apiservice.getStatesOfCountry(country.id);
        let state = apiservice.getStateNameByName(country.id,this.state.address.state);
        this.setState({countryList : cList, selectedCountry: country.id,stateList : sList, selectedState : state.id})
    }

    onCountryChange(value){
        console.log(value)
        this.setState({selectedCountry:value});
        const sList = apiservice.getStatesOfCountry(value);
       
        this.setState({stateList : sList,selectedState: undefined});
    }

    onStateChange(value){
        this.setState({selectedState:value})
    }

    render() {
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
        return (
            <Fragment>
                    <Formik
                            initialValues={{
                                prefix: this.state.address.prefix,
                                firstname: this.state.address.firstname,
                                lastname: this.state.address.lastname,
                                email: this.state.address.email,
                                address: this.state.address.address,
                                landmark: this.state.address.landmark,
                                city: this.state.address.city,
                                country: this.state.address.country,
                                state: this.state.address.state,
                                postalcode: this.state.address.postalcode,
                                telephone: this.state.address.telephone
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
                                postalcode:  Yup.string().required('Postal Code is required.')
                                .matches(/[0-9]{5}(-[0-9]{4})?/, 'Enter vaild Postal Code.')
                            })}

                            onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                                setStatus();
                                const countryName = apiservice.getCountryNameById(values.country);
                                const stateName = apiservice.getStateNameById(values.state);
                                var body = {
                                    "customer_id":this.props.customerId,
                                    "prefix":values.prefix,
                                    "firstname":values.firstname,
                                    "lastname":values.lastname,
                                    "email":values.email,
                                    "telephone":values.telephone,
                                    "country":countryName,
                                    "state":stateName,
                                    "city":values.city,
                                    "postalcode":values.postalcode,
                                    "landmark":values.landmark,
                                    "address":values.address,
                                }
                                apiservice.updateOne('customersaddress/update', JSON.stringify(body), this.state.address._id)
                                    .then(val => {
                                        setSubmitting(false);
                                        if (val) {
                                            toast.success('Successfully edited Customer address.');
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
                                    <h4>Address Information</h4>
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
                                        <Field name="country" id="validationCustom01" render={({ field, form })=>(
                                                            this.state.countryList && this.state.countryList.length > 0 ? <Select
                                                                showSearch
                                                                value={this.state.selectedCountry}
                                                                className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')}
                                                                placeholder="Select a Country"
                                                                optionFilterProp="children"
                                                                filterOption={(input, option) =>
                                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                onChange={e =>{this.onCountryChange(e)
                                                                    form.setFieldValue('country', e)
                                                                    form.setFieldValue('state','')}}
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
                                        <Field name="state" id="validationCustom01" render={({ field, form })=>(
                                                            this.state.stateList && this.state.stateList.length > 0 ? <Select
                                                                showSearch
                                                                value={this.state.selectedState}
                                                                className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')}
                                                                placeholder="Select a State"
                                                                optionFilterProp="children"
                                                                filterOption={(input, option) =>
                                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                onChange={e =>{this.onStateChange(e)
                                                                    form.setFieldValue('state', e)}}
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
                                    <div className="pull-right">
                                        <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                            {isSubmitting &&
                                                <div className="spinner-glow spinner-glow-danger"></div>
                                            }
                                            <span>Save Address</span>
                                        </button>
                                    </div>
                                </Form>
                            )}
                        />
            </Fragment>
        )
    }
}

export default Tabset_addresses
