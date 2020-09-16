import React, { Component, Fragment} from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Modal from 'react-responsive-modal';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from './productDataTable';
import { Link } from 'react-router-dom';
import { apiservice } from '../../../services';
import { Loader } from '../../Loader';

export class Product extends Component{
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            productData: undefined,
        };
        
    }

    componentWillMount(){
        apiservice.getAll('catalog/products/productslisting')
            .then((val)=>{
                this.setState({productData: val})
            })
    }
    
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };
    render() {
        const { open } = this.state;
        
        
        if (!this.state.productData) return (<Loader />);
        
        return (
            
            <Fragment>
                <Breadcrumb title="catalog" parent="Product" />
                {this.state && this.state.data}
                {/* <!-- Container-fluid starts--> */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products List</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <div className="btn-popup pull-right">
                                            <Link to="/catalog/add-new-product" className="btn btn-primary">Add New product</Link>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">

                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.productData} 
                                            pageSize={this.state.productData.length > 0 ? (this.state.productData.length < 50 ? this.state.productData.length : 50) : 5} 
                                            pagination={true}
                                            class="-striped -highlight" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Container-fluid Ends--> */}
            </Fragment>
        )
    }
}
export default Product