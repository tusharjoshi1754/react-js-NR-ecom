import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.scss';
import App from './components/app';
import { ScrollContext } from 'react-router-scroll-4';

import { PrivateRoute } from './components/PrivateRoute';

// Components
import Dashboard from './components/dashboard';

// Products physical
import Category from './components/catalog/categories/category';


//Sales
import Orders from './components/sales/orders';
import Transactions_sales from './components/sales/transactions-sales';
//Coupons
import Coupons from './components/marketing/coupons';

//Pages
import ListPages from './components/pages/list-page';
import Create_page from './components/pages/create-page';
import Media from './components/media/media';
import List_menu from './components/menus/list-menu';
import Create_menu from './components/menus/create-menu';
import List_user from './components/users/list-user';

import prod from './components/purchases/Product/product';
import add_prod from './components/purchases/Product/create_product';
import edit_prod from './components/purchases/Product/edit-product';

import receipt from './components/purchases/Receipts/receipts';
import add_receipt from './components/purchases/Receipts/add_receipts';
import edit_receipt from './components/purchases/Receipts/edit-receipts';

import List_vendors from './components/vendors/list-vendors';
import Create_vendors from './components/vendors/create.vendors';
import Translations from './components/localization/translations';
import Rates from './components/localization/rates';
import Taxes from './components/localization/taxes/taxes';
import Profile from './components/settings/profile';
import Reports from './components/reports/report';
import Invoice from './components/invoice';
import Datatable from './components/common/datatable'
import Login from './components/auth/login';
import addCatagories from './components/catalog/categories/addCatagories';

import editCatagories from './components/catalog/categories/editCatagories';
import Product from './components/catalog/product/product';
import addProduct from './components/catalog/product/addproduct';
import editProduct from './components/catalog/product/editProudct';
import addTax from './components/localization/taxes/addTax';
import editTax from './components/localization/taxes/editTax';

//Customer Group

import customerGroupList from './components/customers/customerGroups/customerGroup';
import customerList from './components/customers/customers';
import Create_customer from './components/customers/create-customer';
import Edit_customer from './components/customers/edit-customer';


class Root extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <BrowserRouter basename={'/'}>
                <ScrollContext>
                    <Switch>
                    <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login} />
                        <Route exact path={`${process.env.PUBLIC_URL}/auth/login`} component={Login} />
                       
                        <App>
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard} />
                                
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/catalog/categories`} component={Category} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/purchases/products`} component={prod} />
                            
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/purchases/create_product`} component={add_prod} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/purchases/edit-product/:id`} component={edit_prod} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/catalog/add-new-catagory`} component={addCatagories} />
                          
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/catalog/edit-catagory/:id`} component={editCatagories} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/purchases/Receipts`} component={receipt} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/purchases/add_receipts`} component={add_receipt} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/purchases/edit-receipts/:id`} component={edit_receipt} />
                          
                            {/* <PrivateRoute path={`${process.env.PUBLIC_URL}/products/physical/sub-category`} component={Sub_category} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/physical/product-list`} component={Product} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/physical/product-detail`} component={Product_detail} /> */}
                            {/* <PrivateRoute path={`${process.env.PUBLIC_URL}/products/physical/add-product`} component={addProduct} /> */}
                            

                            {/* <PrivateRoute path={`${process.env.PUBLIC_URL}/products/digital/digital-category`} component={Digital_category} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/digital/digital-sub-category`} component={Digital_sub_category} /> */}
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/catalog/products`} component={Product} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/catalog/add-new-product`} component={addProduct} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/catalog/edit-product/:id`} component={editProduct} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/sales/orders`} component={Orders} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/sales/transactions`} component={Transactions_sales} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/marketing/coupons`} component={Coupons} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/pages/list-page`} component={ListPages} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/pages/create-page`} component={Create_page} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/media`} component={Media} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/menus/list-menu`} component={List_menu} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/menus/create-menu`} component={Create_menu} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/users/list-group`} component={customerGroupList} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/users/list-customers`} component={customerList} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/users/create-customer`} component={Create_customer} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/users/edit-customer/:id`} component={Edit_customer} />

                            {/* <PrivateRoute path={`${process.env.PUBLIC_URL}/localization/transactions`} component={Translations} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/localization/currency-rates`} component={Rates} /> */}
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/localization/add-new-tax`} component={addTax} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/localization/edit-tax/:id`} component={editTax} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/localization/taxes`} component={Taxes} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/reports/report`} component={Reports} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/settings/profile`} component={Profile} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/invoice`} component={Invoice} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/data-table`} component={Datatable} />

                        </App>
                    </Switch>
                </ScrollContext>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));


