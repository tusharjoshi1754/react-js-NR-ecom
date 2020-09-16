import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Datatable from './customersDataTable';
import { apiservice } from '../../services';
import { Link } from 'react-router-dom';

import { Loader } from '../Loader';

export class Customers extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            open: false,
            customerData: undefined,
        };
        
    }
    componentDidMount(){
        apiservice.getAll('customers/listing')
            .then((val)=>{
                console.log(this.props.isLoading);
                if(val){
                    this.setState({customerData: val.result})
                }else{
                    this.setState({customerData: []})
                }
                
            })
    }


    render() {
        if (!this.state.customerData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Customers List" parent="Customers" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Customer Details</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <Link to="/users/create-customer" className="btn btn-primary">Add New Customer</Link>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-list translation-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.customerData}
                                            pageSize={this.state.customerData.length > 0 ? (this.state.customerData.length < 50 ? this.state.customerData.length : 50) : 5}
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

export default Customers
