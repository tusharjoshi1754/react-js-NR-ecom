import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Datatable from './taxDataTable';
import { apiservice } from '../../../services';
import { Link } from 'react-router-dom';
import { Loader } from '../../Loader';

export class Taxes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            taxData: undefined,
        };
        
    }
    componentWillMount(){
        apiservice.getAll('taxs/taxslisting')
            .then((val)=>{
                console.log(val.result);
                if(val){
                    this.setState({taxData: val.result})
                }else{
                    this.setState({taxData: []})
                }
                
            })
    }


    render() {
        if (!this.state.taxData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Taxes" parent="Localization" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Tax Details</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <Link to="/localization/add-new-tax" className="btn btn-primary">Add New Tax</Link>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-list translation-list">
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.taxData}
                                            pageSize={this.state.taxData.length > 0 ? this.state.taxData.length : 5}
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

export default Taxes
