import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { apiservice } from '../../../services';
import matchSorter from 'match-sorter';
import Moment from 'react-moment';
import * as config from '../../../config.json';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
export class ReceiptDataTable extends Component {
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
   

    clicktoDeleteProduct(index,_id){
        confirmAlert({
            customUI: ({ onClose }) => {
                const { myData } = this.state
                return (
                  <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to this recipt?</p>
                    <button onClick={onClose}>No</button>
                    <button onClick={() => {
                            apiservice.deleteOne('receipts/delete_receipt',_id)
                            .then( val => {
                                onClose();
                                let data = myData;
                                data.splice(index, 1);
                                this.setState({ myData: data });
                                toast.success("Successfully Deleted receipt.")
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
        console.log("mydata:"+myData)
       
            const columns = [{
                Header: 'Image',
                accessor: 'receipt_image',
                style: {
                    textAlign: 'center'
                },
                Cell: (row) => (
                    row.original.receipt_image ?
                    <img src={config.Resource_URL + row.original.receipt_image} style={{width:50,height:50}} />
                    :
                    <BrokenImageIcon style={{ fontSize: 55 }}/>
                ),
                filterable: false
              },
            {
            Header: 'ID',
            accessor: '_id',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["_id"] }),
                filterAll: true
          },
          {
            id: 'merchant',
            Header: 'merchant',
            accessor: 'merchant',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["merchant"]}),
                 filterAll: true
          },
          {
            id: 'date',
            Header: 'date',
            accessor: 'date',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["date"]}),
                 filterAll: true
          },
          {
            id: 'payment_account',
            Header: 'payment_account',
            accessor: 'payment_account',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["payment_account"]}),
                 filterAll: true
          },
          {
            id: 'subtotal',
            Header: 'subtotal',
            accessor: 'subtotal',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["subtotal"]}),
                 filterAll: true
          },
          {
            id: 'currency',
            Header: 'currency',
            accessor: 'currency',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["currency"]}),
                 filterAll: true
          },
          {
            id: 'total',
            Header: 'total',
            accessor: 'total',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["total"]}),
                 filterAll: true
          },
      

        
          {
              Header: <b>Action</b>,
              Cell: (row) => (
                    <div>
                        <span onClick={()=> this.clicktoDeleteProduct(row.index,row.original._id)}>
                            <i className="fa fa-trash"  style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                            ></i>
                        </span>

                    <span><Link to={"/purchases/edit-receipts/" + row.original._id}><i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i></Link></span>
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
export default ReceiptDataTable