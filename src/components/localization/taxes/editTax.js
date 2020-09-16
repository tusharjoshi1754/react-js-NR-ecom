import React, { Component, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Breadcrumb from '../../common/breadcrumb';
import '../../../assets/css/toggle/toggle.css';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { apiservice } from '../../../services';

import 'antd/dist/antd.css';
import { Select } from 'antd';
import { Loader } from '../../Loader';

const { Option } = Select;


class editTax extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            countryList: undefined,
            selectedCountry: undefined,
            stateList: undefined,
            selectedState: undefined,
            editTaxData: undefined,
            taxId:this.props.match.params.id
        }
        this.handleChange = this.handleChange.bind(this)
        this.onCKeditorChange = this.onCKeditorChange.bind(this)
        this.onCountryChange = this.onCountryChange.bind(this)
        this.onStateChange = this.onStateChange.bind(this)
    }

    handleChange(event) {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        })
      }
    componentWillMount(){
        const cList = apiservice.getAllCountries();
        this.setState({countryList : cList});
        apiservice.getOne('taxs/findbyidtax',this.state.taxId)
            .then((val)=>{
                console.log('data',val);
                
                let country = apiservice.getCountryNameByName(val.result.country);
                const sList = apiservice.getStatesOfCountry(country.id);
                let state = apiservice.getStateNameByName(country.id,val.result.state);
                this.setState({editTaxData: val.result, selectedCountry: country.id,stateList : sList, selectedState : state.id})
            })
        
    }
    onCKeditorChange(event) {
        var newContent = event.editor.getData();
        this.setState({content : newContent});
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
        if (!this.state.editTaxData) return (<Loader />);
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
                <Breadcrumb title="Edit Tax" parent="Taxes" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <Formik
                            initialValues={{
                                name: this.state.editTaxData.name,
                                rate: this.state.editTaxData.rate,
                                country: this.state.editTaxData.country,
                                state: this.state.editTaxData.state,
                                detail: this.state.editTaxData.detail
                            }}
                            
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required('Tax Name is required.'),
                                rate: Yup.number().required('Tax Rate is required.')
                                .min(0,'Rate allow min 0.')
                                .max(100,'Rate allow min 100. '),
                                country: Yup.string().required('Country is required.'),
                                state: Yup.string().required('State is required.'),
                                detail: Yup.string().required('Details is required.')
                            })}
                            onSubmit={(values, { setStatus, setSubmitting }) => {
                                setStatus();
                                const countryName = apiservice.getCountryNameById(values.country);
                                const stateName = apiservice.getStateNameById(values.state);
                               
                                var Json = {
                                    "name": values.name,
                                    "country": countryName,
                                    "detail": values.detail,
                                    "state": stateName,
                                    "rate": Number(values.rate)
                                }
                                
                                apiservice.updateOne('taxs/update', JSON.stringify(Json),this.state.taxId)
                                    .then( val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('Successfully updated tax.');
                                            this.props.history.push({pathname:'/localization/taxes'});
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
                                                    
                                                    <div className="form-group">
                                                        <label className="col-form-label"><span>*</span> Tax Name</label>
                                                        <Field name="name" id="validationCustom01" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="name" style={{ display: 'block'}} component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label"><span>*</span> Tax Rate (%)</label>
                                                        <Field name="rate" id="validationCustom01" type="text" className={'form-control' + (errors.rate && touched.rate ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="rate" style={{ display: 'block'}} component="div" className="invalid-feedback" />
                                                    </div>
                                                    
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span> Country</label>
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
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span> State</label>
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
                                                    <div className="form-group">
                                                        <label className="col-form-label"><span>*</span> Details</label>
                                                        <Field name="detail" component="textarea" rows="4" cols="12" className={'form-control ' +(errors.detail && touched.detail ? 'is-invalid' : '')} />
                                                        <ErrorMessage name="detail" component="div" className="invalid-feedback" />
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
export default editTax;