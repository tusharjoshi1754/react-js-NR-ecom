import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Tabset_customer from './tabset-edit-customer';

export class Edit_customer extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack(){
        this.props.history.push({ pathname: '/users/list-customers' });
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Edit Customer" parent="Customers" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Edit Customer</h5>
                                    <button className="btn btn-primary pull-right" onClick={this.goBack}>Back Customer List</button>
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

export default Edit_customer
