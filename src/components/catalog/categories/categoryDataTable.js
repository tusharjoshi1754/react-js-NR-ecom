import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import * as config from '../../../config.json';
import { apiservice } from '../../../services';
import matchSorter from 'match-sorter';

import '../../../assets/css/confirm-alert/confirm-alert.css';
export class CategoryDataTable extends Component {
    constructor(props) {
        super(props);
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
    clicktoDeleteCategory(index,_id){
        confirmAlert({
            customUI: ({ onClose }) => {
                const { myData } = this.state
                return (
                  <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to this category?</p>
                    <button onClick={onClose}>No</button>
                    <button onClick={() => {
                            apiservice.deleteOne('catalog/categories/delete',_id)
                            .then( val => {
                                onClose();
                                let data = myData;
                                data.splice(index, 1);
                                this.setState({ myData: data });
                                toast.success("Successfully Delete category.",{
                                    position: toast.POSITION.TOP_CENTER
                                })
                            }, error => {
                                toast.error(error,{
                                    position: toast.POSITION.TOP_CENTER
                                  })
                            });
                                //authenticationService.logout(); 
                                //onClose();
                                //window.location.reload();
                            }}>Yes, Delete!</button>
                  </div>
                )
              }
            });
    }

    render() {
        const { pageSize, myClass, multiSelectOption, pagination } = this.props;
        const { myData } = this.state
       
        const columns = [{
            Header: 'Image',
            accessor: 'categories_image',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                row.original.categories_image ?
                <img src={config.Resource_URL + row.original.categories_image} style={{width:50,height:50}} />
                :
                <BrokenImageIcon style={{ fontSize: 55 }}/>
            ),
            filterable: false
          },
          {
            Header: 'Category Name',
            accessor: 'categories_name',
            style: {
                textAlign: 'center'
            },
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["categories_name"] }),
                filterAll: true
          },
          {
            Header: 'Status',
            accessor: 'enable_categories',
            style: {
                textAlign: 'center'
            },
            Cell: (row) => (
                row.original.enable_categories ?
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
                        <span onClick={()=> this.clicktoDeleteCategory(row.index,row.original._id)}>
                            <i className="fa fa-trash"  style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                            ></i>
                        </span>

                    <span><Link to={"/catalog/edit-catagory/" + row.original._id}><i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i></Link></span>
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

export default CategoryDataTable
