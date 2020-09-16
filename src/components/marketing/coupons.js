import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Datatable from './couponsDataTable';
import * as Yup from 'yup';
import Modal from 'react-responsive-modal';
import { apiservice } from '../../services';
import { toast } from 'react-toastify';
import { Loader } from '../Loader';


export class Coupons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            couponList: undefined,
        };
        
    }
    componentWillMount(){
        apiservice.getAll('customersgroups/customers_groups_listing')
            .then((val)=>{
                console.log('val:',val);
                if(val){
                    this.setState({couponList: val.result})
                }else{
                    this.setState({couponList: []})
                }
                
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
        if (!this.state.couponList) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Coupons" parent="Marketing" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Coupons</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                    <button type="button" className="btn btn-primary" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add New Customer Group</button>
                                        <Modal open={open} onClose={this.onCloseModal} >
                                        <Formik
                                            initialValues={{
                                                cust_grp_name: '',
                                                enable_group: 'true',
                                            }}

                                            validationSchema={Yup.object().shape({
                                                cust_grp_name: Yup.string().required('Group Name is required.'),
                                                enable_group: Yup.string().required('Group Status is required.')
                                            })}

                                            onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                                                setStatus();

                                                var Json = {
                                                    "cust_grp_name": values.cust_grp_name,
                                                    "enable_group": values.enable_group == 'true' ? true: false,
                                                }
                                                apiservice.create('customersgroups/customers_groups_add', JSON.stringify(Json))
                                                    .then(val => {
                                                        
                                                        if(val){
                                                            apiservice.getAll('customersgroups/customers_groups_listing')
                                                                .then((gVal)=>{
                                                                    setSubmitting(false);
                                                                    if(gVal){
                                                                        this.setState({custGroups: gVal.result});
                                                                    }else{
                                                                        this.setState({custGroups: []})
                                                                    }
                                                                    this.onCloseModal();
                                                                    toast.success('Successfully add Customer Group.');
                                                                })
                                                        }else{
                                                            setSubmitting(false);
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
                                                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add New Customer Group</h5>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="form-group">
                                                            <label className="col-form-label pt-0"><span>*</span>Group Name :</label>
                                                            <Field name="cust_grp_name" id="validationCustom01" type="text" className={'form-control' + (errors.cust_grp_name && touched.cust_grp_name ? ' is-invalid' : '')} />
                                                            <ErrorMessage name="cust_grp_name" component="div" className="invalid-feedback" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="message-text" className="col-form-label"><span>*</span>Group Status :</label>
                                                            <Field component="select" className={'form-control' + (errors.enable_group && touched.enable_group ? ' is-invalid' : '')} name="enable_group">
                                                                <option value="true">Active</option>
                                                                <option value="false">Inactive</option>
                                                            </Field>
                                                            <ErrorMessage name="enable_group" component="div" className="invalid-feedback" />
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                    <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                                        {isSubmitting &&
                                                            <div className="spinner-glow spinner-glow-danger"></div>
                                                        }
                                                        <span>Save</span>
                                                    </button>
                                                    <button type="button" className="btn btn-secondary" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                                                    </div>
                                                </Form>
                                            )}
                                        />
                                        </Modal>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-list translation-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.couponList}
                                            pageSize={50}
                                            pagination={false}
                                            class="-striped -highlight"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Coupons
