import React, { Component, Fragment } from 'react';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { User, Unlock } from 'react-feather';
import { withRouter } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import * as Constant from '../../constants/common';

import { authenticationService } from '../../services';

export class LoginTabset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeShow: true,
            startDate: new Date()
        }
        this.handleChange = this.handleChange.bind(this)
        // this.routeChange = this.routeChange.bind(this);

        let findToken = authenticationService.currentUserToken;

        if(findToken){
            const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
                                                this.props.history.push(from);
        }
    }

    clickActive = (event) => {
        document.querySelector(".nav-link").classList.remove('show');
        event.target.classList.add('show');
        event.target.classList.add('hii');
    }
    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    routeChange = () => {
        
        //this.props.history.push(`${process.env.PUBLIC_URL}/dashboard`);
      }
    render() {
        return (
            <div>
                <Fragment>
                    <Tabs>
                        <TabList className="nav nav-tabs tab-coupon" >
                            <Tab className="nav-link" onClick={(e) => this.clickActive(e)}><User />Login</Tab>
                            <Tab className="nav-link" onClick={(e) => this.clickActive(e)}><Unlock />Forgot Password</Tab>
                        </TabList>

                        <TabPanel>
                            <Formik
                                initialValues={{
                                    username: '',
                                    password: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    username: Yup.string().required('Username is required'),
                                    password: Yup.string().required('Password is required')
                                })}
                                onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    authenticationService.login(username, password)
                                        .then(
                                            user => {
                                                localStorage.setItem(Constant.ADMIN_TOKEN, user.token);
                                                localStorage.setItem(Constant.CURRENT_USERS, JSON.stringify(user.user[0]));
                                                this.props.history.push('/dashboard');
                                            },
                                            error => {
                                                console.log('error',error);
                                                setSubmitting(false);
                                                toast.error(error,{
                                                    position: toast.POSITION.TOP_CENTER
                                                  })
                                                //setStatus(error);
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form className="form-horizontal auth-form">
                                        <div className="form-group">
                                            <Field name="username" type="text" placeholder="Username" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <Field name="password" type="password" placeholder="Password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-terms">
                                            <div className="custom-control custom-checkbox mr-sm-2">
                                                <input type="checkbox" className="custom-control-input" id="customControlAutosizing" />
                                                <label className="d-block">
                                                            <input className="checkbox_animated" id="chk-ani2" type="checkbox" />
                                                                Reminder Me
                                                        </label>
                                            </div>
                                        </div>
                                        <div className="form-button">
                                            <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                                {isSubmitting &&
                                                    <div className="spinner-glow spinner-glow-danger"></div>
                                                }
                                                <span>Login</span>
                                            </button>
                                        </div>
                                        {status &&
                                            <div className={'alert alert-danger'}>{status}</div>
                                        }
                                    </Form>
                                )}
                            />
                        </TabPanel>
                        <TabPanel>
                            <Formik
                                initialValues={{
                                    email: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    email: Yup.string().required('Email Address is required')
                                            .email('Please Enter Valid Email Address')
                                })}
                                onSubmit={({ email }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    authenticationService.forgotPassword(email)
                                        .then(
                                            res => {
                                               if(res){
                                                toast.success('Successfully! Send Password Reset Email.',{
                                                    position: toast.POSITION.TOP_CENTER
                                                  })
                                               }else{
                                                toast.error('Error! Something Wrong Please try again.',{
                                                    position: toast.POSITION.TOP_CENTER
                                                  })
                                               }
                                            },
                                            error => {
                                                console.log('error',error);
                                                setSubmitting(false);
                                                toast.error(error,{
                                                    position: toast.POSITION.TOP_CENTER
                                                  })
                                                //setStatus(error);
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form className="form-horizontal auth-form">
                                        <div className="form-group">
                                            <Field name="email" type="text" placeholder="Email Address" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-button">
                                            <button className="btn btn-primary" type="submit" onClick={() => this.routeChange()}>Send Email</button>
                                        </div>
                                        
                                    </Form>
                                )}
                            />
                        </TabPanel>
                    </Tabs>
                    <ToastContainer />
                </Fragment>
            </div>
        )
    }
}

export default withRouter(LoginTabset)

