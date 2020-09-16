import React, { Component,Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Tabset_product from './Tabset-edit-product';

export class Edit_customer extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack(){
        this.props.history.push({ pathname: '/purchases/products' });
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Edit Product" parent="Products" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Edit Product</h5>
                                    <button className="btn btn-primary pull-right" onClick={this.goBack}>Back Product List</button>
                                </div>
                                <div className="card-body needs-validation">
                                    <Tabset_product {...this.props} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Edit_customer
