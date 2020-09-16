import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { apiservice } from '../../services';
import matchSorter from 'match-sorter';
import Moment from 'react-moment';
import * as config from '../../config.json';

export class CustomersDataTable extends Component {
    constructor(props) {
        super(props)
         this.state = {
            checkedValues: [],
            myData: this.props.myData
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

    clicktoDeleteTax(index,_id){
        confirmAlert({
            customUI: ({ onClose }) => {
                const { myData } = this.state
                return (
                  <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to this Tax?</p>
                    <button onClick={onClose}>No</button>
                    <button onClick={() => {
                            apiservice.deleteOne('customers/delete',_id)
                            .then( val => {
                                onClose();
                                let data = myData;
                                data.splice(index, 1);
                                this.setState({ myData: data });
                                toast.success("Successfully Deleted customer address.")
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
    render() {
        const { pageSize, myClass, multiSelectOption, pagination } = this.props;
        const { myData } = this.state
        const columns = [
        //   {
        //     Header: 'ID',
        //     accessor: '_id',
        //     style: {
        //         textAlign: 'center'
        //     },
        //     filterMethod: (filter, rows) =>
        //         matchSorter(rows, filter.value, { keys: ["_id"] }),
        //         filterAll: true
        //   },
          {
            id: 'name',
            Header: 'Name',
            accessor: row => `${row.firstname} ${row.middlename} ${row.lastname}`,
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["name"]}),
                 filterAll: true
          },
        //   {
        //     Header: 'Customer Group',
        //     accessor: 'customerGroup',
        //     style: {
        //         textAlign: 'center'
        //     },
        //     Cell: (row) => (
        //         row.original.customerGroup ?
        //         this.Capitalize(row.original.customerGroup.cust_grp_name)
        //         : null
        //     ),
        //     filterable: false
        //   },
          {
            Header: 'Email',
            accessor: 'email',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["email"] }),
                filterAll: true
          },
          {
            Header: 'Gender',
            accessor: 'gender',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                this.Capitalize(row.original.gender)
            ),
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["gender"] }),
                filterAll: true
          },
          {
            Header: 'Confirmed Email',
            accessor: 'email_confirmation',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                row.original.email_confirmation ?
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
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
          },

          {
            Header: 'Date of Birth',
            accessor: 'dob',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                row.original.dob ?
                <Moment format={config.Date_Format}>
                {row.original.dob}
                </Moment>
                : null
            ),
            filterable: false
          },
          {
            Header: 'Created Date',
            accessor: 'create_date',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                <Moment format={config.Date_Format}>
                {row.original.create_date}
                </Moment>
            ),
            filterable: false
          },
          {
              Header: <b>Action</b>,
              Cell: (row) => (
                    <div>
                        <span onClick={()=> this.clicktoDeleteTax(row.index,row.original._id)}>
                            <i className="fa fa-trash"  style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                            ></i>
                        </span>

                    <span><Link to={"/users/edit-customer/" + row.original._id}><i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i></Link></span>
                </div>
            ),
            style: {
                textAlign: 'center'
            },
            sortable: false,
            filterable: false
            }
        ];
        return (
            <Fragment>
                <ReactTable
                    data={myData}
                    columns={columns}
                    filterable
                    defaultPageSize={pageSize}
                    className={myClass}
                    showPagination={pagination}
                />
            </Fragment>
        )
    }
}
export default CustomersDataTable