import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Datatable from './list-receipts';
import { apiservice } from '../../../services';
import { Link } from 'react-router-dom';

import { Loader } from '../../Loader';

export class Receipt extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            open: false,
            receiptData: undefined,
        };
        
    }
    componentDidMount(){
        apiservice.getAll('receipts/listing_receipt')
            .then((val)=>{
                // console.log(this.props.isLoading);
                if(val){
                    // console.log(val.result)
                    this.setState({receiptData: val.result})
                }else{
                    this.setState({receiptData: []})
                }
                
            })
    }
    render() {
        if (!this.state.receiptData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Recipts List" parent="Purchases" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Receipt Details</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <Link to="/purchases/add_receipts" className="btn btn-primary">Add New Receipt</Link>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-list translation-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.receiptData}
                                            pageSize={this.state.receiptData.length > 0 ? (this.state.receiptData.length < 50 ? this.state.receiptData.length : 50) : 5}
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

export default Receipt
