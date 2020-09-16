import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { apiservice } from '../../../services';
import matchSorter from 'match-sorter';

export class TaxDataTable extends Component {
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
                            apiservice.deleteOne('taxs/delete',_id)
                            .then( val => {
                                onClose();
                                let data = myData;
                                data.splice(index, 1);
                                this.setState({ myData: data });
                                toast.success("Successfully Deleted Tax.")
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
          {
            Header: 'Tax Name',
            accessor: 'name',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["name"] }),
                filterAll: true
          },
          {
            Header: 'Country',
            accessor: 'country',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["country"] }),
                filterAll: true
          },
          {
            Header: 'State',
            accessor: 'state',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["state"] }),
                filterAll: true
          },
          {
            Header: 'Rate (In percentage)',
            accessor: 'rate',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["rate"] }),
                filterAll: true
          },
          {
              Header: <b>Action</b>,
              Cell: (row) => (
                    <div>
                        <span onClick={()=> this.clicktoDeleteTax(row.index,row.original._id)}>
                            <i className="fa fa-trash"  style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                            ></i>
                        </span>

                    <span><Link to={"/localization/edit-tax/" + row.original._id}><i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i></Link></span>
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
export default TaxDataTable