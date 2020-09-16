import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Tabset_customer from './tabset-customer';

export class Create_customer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Create New Customer" parent="Customers" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Add New Customer</h5>
                                </div>
                                <div className="card-body needs-validation">
                                    <Tabset_customer {...this.props} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Create_customer
