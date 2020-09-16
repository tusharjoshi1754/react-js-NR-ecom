import React, { Component } from 'react'
import Sidebar from './common/sidebar_components/sidebar';
import Right_sidebar from './common/right-sidebar';
import Footer from './common/footer';
import Header from './common/header_components/header';
import { ToastContainer,toast } from 'react-toastify';

import './app.css';

export class App extends Component {
    constructor(props) {
        super(props);
      }
    render() {
       
        return (
            <div>
                <div className="page-wrapper" >
                    <Header/>
                    <div className="page-body-wrapper">
                        <Sidebar />
                        <Right_sidebar />
                        <div className="page-body">
                            {this.props.children}
                            
                        </div>
                            <Footer />
                    </div>
                </div>
                
                <ToastContainer />
            </div>
            
        )
    }
}

export default App
