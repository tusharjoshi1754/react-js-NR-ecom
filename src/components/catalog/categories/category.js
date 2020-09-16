import React, { Component, Fragment} from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Modal from 'react-responsive-modal';
import 'react-toastify/dist/ReactToastify.css';
import data from '../../../assets/data/category';
import Datatable from './categoryDataTable';
import { Link } from 'react-router-dom';
import { apiservice } from '../../../services';
import { Loader } from '../../Loader';

export class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            categoryData: undefined
        };
    }
    componentWillMount(){
        apiservice.getAll('catalog/categories/categorieslisting/')
            .then((val)=>{
                this.setState({categoryData: val})
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
        if (!this.state.categoryData) return (<Loader />);
        return (
            <Fragment>
                <Breadcrumb title="Categories" parent="Catalog" />
                {this.state && this.state.data}
                {/* <!-- Container-fluid starts--> */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Category</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                    <div className="btn-popup pull-right">
                                        <Link to="/catalog/add-new-catagory" className="btn btn-primary">Add New Category</Link>
                                    </div>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">

                                        <Datatable
                                            multiSelectOption={false}
                                            myData={this.state.categoryData} 
                                            pageSize={this.state.categoryData.length > 0 ? (this.state.categoryData.length < 50 ? this.state.categoryData.length : 50) : 5} 
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

export default Category

