import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import { apiservice } from '../../../services';
import matchSorter from 'match-sorter';
import * as Yup from 'yup';
import Modal from 'react-responsive-modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';

export class customerGroupDataTable extends Component {
    constructor(props) {
        super(props)
         this.state = {
            checkedValues: [],
            openModal: false,
            myData: this.props.myData,
            editCustomerGroup : undefined
        }
    }
    selectRow = (e, i) => {
        if (!e.target.checked) {
            this.setState({
                checkedValues: this.state.checkedValues.filter((item, j) => i !== item)
            });
        } else {
            this.state.checkedValues.push(i);
            this.setState({
                checkedValues: this.state.checkedValues
            })
        }
    }
    handleRemoveRow = () => {
        const selectedValues = this.state.checkedValues;
        const updatedData = this.state.myData.filter(function (el) {
            return selectedValues.indexOf(el.id) < 0;
        });
        this.setState({
            myData: updatedData
        })
        toast.success("Successfully Deleted !")
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ myData: nextProps.myData });
        if (nextProps.myData !== this.state.myData) {
            const myData = nextProps.myData;
            this.setState( { myData } );
        }
      }

      clicktoEditGroup(index,_id){
        let toastId = null;
        if(toastId === null){
            toastId = toast('Fetch Customer Group Data',{
                autoClose: false
            });
        }
          apiservice.getOne('customer_group/customergrpfindbyid', _id)
            .then((val)=>{
                toast.dismiss()
                if(val){
                    this.setState({editCustomerGroup: val.result, openModal: true})
                }else{
                    toast.error("Something Wrong Please try again.")
                    this.setState({editCustomerGroup: undefined, openModal: false})
                }
                
            })
      }

    clicktoDeleteCustomerGroup(index,_id){
        confirmAlert({
            customUI: ({ onClose }) => {
                const { myData } = this.state
                return (
                  <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to this Customer Group?</p>
                    <button onClick={onClose}>No</button>
                    <button onClick={() => {
                            apiservice.deleteOne('customersgroups/customers_groups_delete',_id)
                            .then( val => {
                                onClose();
                                let data = myData;
                                data.splice(index, 1);
                                this.setState({ myData: data });
                                toast.success("Successfully Deleted Customer Group.")
                            }, error => {
                                toast.error(error)
                            });
                            }}>Yes, Delete!</button>
                  </div>
                )
              }
            });
    }
    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.myData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ myData: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.myData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    onCloseModal = () => {
        this.setState({ openModal: false, editCustomerGroup: undefined });
    };

    render() {
        const { myClass, multiSelectOption, pagination } = this.props;
        const { myData } = this.state;
        const columns = [
          {
            Header: 'Customer Group Name',
            accessor: 'cust_grp_name',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["name"] }),
                filterAll: true
          },
          {
            Header: 'Status',
            accessor: 'enable_group',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                row.original.enable_group ?
                <i className="fa fa-circle font-success f-12" />
                :
                <i className="fa fa-circle font-danger f-12" />
            ),
            filterMethod: (filter, row) => {
                if (filter.value === "all") {
                  return true;
                }
                if (filter.value === "true") {
                  return row[filter.id] == true;
                }
                return row[filter.id] == false;
              },
              Filter: ({ filter, onChange }) =>
                <select
                  onChange={event => onChange(event.target.value)}
                  style={{ width: "100%" }}
                  value={filter ? filter.value : "all"}
                >
                  <option value="all">Show All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
          },
          {
              Header: <b>Action</b>,
              Cell: (row) => (
                    <div>
                        <span onClick={()=> this.clicktoDeleteCustomerGroup(row.index,row.original._id)}>
                            <i className="fa fa-trash"  style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                            ></i>
                        </span>

                    <span onClick={()=> this.clicktoEditGroup(row.index,row.original._id)}><i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i></span>
                </div>
            ),
            style: {
                textAlign: 'center'
            },
            sortable: false,
            filterable: false
            }
        ];
        const { openModal } = this.state;
        return (
            <Fragment>
                <Modal open={openModal} onClose={this.onCloseModal} >
                    <Formik
                        initialValues={{
                            cust_grp_name: this.state.editCustomerGroup ? this.state.editCustomerGroup.cust_grp_name : '',
                            enable_group: this.state.editCustomerGroup ? (this.state.editCustomerGroup.enable_group ? 'true' : 'false') : 'true',
                        }}

                        validationSchema={Yup.object().shape({
                            cust_grp_name: Yup.string().required('Group Name is required.'),
                            enable_group: Yup.string().required('Group Status is required.')
                        })}

                        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                            setStatus();

                            var Json = {
                                "cust_grp_name": values.cust_grp_name,
                                "enable_group": values.enable_group == 'true' ? true : false,
                            }
                            apiservice.updateOne('customersgroups/customers_groups_update', JSON.stringify(Json), this.state.editCustomerGroup ? this.state.editCustomerGroup.id : null)
                                .then(val => {
                                    
                                    if(val){
                                        apiservice.getAll('customersgroups/customers_groups_listing')
                                            .then((gVal)=>{
                                                setSubmitting(false);
                                                if(gVal){
                                                    this.setState({myData: gVal.result});
                                                }else{
                                                    this.setState({myData: []})
                                                }
                                                this.onCloseModal();
                                                toast.success('Successfully update Customer Group.');
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
                <ReactTable
                    data={myData}
                    columns={columns}
                    filterable
                    pageSize={myData.length > 0 ? myData.length : 5}
                    className={myClass}
                    showPagination={pagination}
                />
            </Fragment>
        )
    }
}
export default customerGroupDataTable