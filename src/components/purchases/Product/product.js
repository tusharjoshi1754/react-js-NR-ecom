import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Datatable from './list-page';
import { apiservice } from '../../../services';
import { Link } from 'react-router-dom';

import { Loader } from '../../Loader';

export class Customers extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            open: false,
            productData: undefined,
        };
        
    }
    componentDidMount(){
        apiservice.getAll('product/productlisting')
            .then((val)=>{
                console.log(this.props.isLoading);
                if(val){
                    this.setState({productData: val.result})
                }else{
                    this.setState({productData: []})
                }
                
            })
    }
    render() {
        if (!this.state.productData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Products List" parent="Purchases" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Product Details</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <Link to="/purchases/create_product" className="btn btn-primary">Add New Product</Link>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-list translation-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.productData}
                                            pageSize={this.state.productData.length > 0 ? (this.state.productData.length < 50 ? this.state.productData.length : 50) : 5}
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
