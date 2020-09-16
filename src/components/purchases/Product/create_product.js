import React, { Component,Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Tabset_product from './Tabset-add-product';

export class Create_product extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Create New Product" parent="Products" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Add New Product</h5>
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

export default Create_product
