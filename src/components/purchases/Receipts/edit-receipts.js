import React, { Component,Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
 import Tabset_receipts from './Tabset-edit-receipts';

export class Edit_receipt extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack(){
        this.props.history.push({ pathname: '/purchases/Receipts' });
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Edit Product" parent="Receipts" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Edit Receipts</h5>
                                    <button className="btn btn-primary pull-right" onClick={this.goBack}>Back Receipts List</button>
                                </div>
                                <div className="card-body needs-validation">
                                    <Tabset_receipts {...this.props} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Edit_receipt
