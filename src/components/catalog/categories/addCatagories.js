import React, { Component, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Breadcrumb from '../../common/breadcrumb';
import '../../../assets/css/toggle/toggle.css';
import * as Yup from 'yup';
import CKEditors from "react-ckeditor-component";
import classNames from "classnames";
import { toast } from 'react-toastify';

import ImageInput from "../../common/fileUpload/ImageInput";
import { apiservice } from '../../../services';

import 'antd/dist/antd.css';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    ...props
  }) => {
    return (
      <div>
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === value}
          onChange={onChange}
          onBlur={onBlur}
          className={classNames("radio_animated")}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };
const Tree = (data) =>{
    return data && data.length > 0 && data.map(item =>{
        return(
            <TreeNode value={item.id} title={item.categories_name} key={item.id} disabled={!item.enable_categories}>
                {item.children && Tree(item.children)}
            </TreeNode>
        )
    });
}

class addCatagories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            file: null,
            parent_cat: undefined,
            categoryData: undefined
        }
        this.handleChange = this.handleChange.bind(this)
        this.onCKeditorChange = this.onCKeditorChange.bind(this)
        this.onproCatChange = this.onproCatChange.bind(this)
    }

    handleChange(event) {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        })
      }
    componentWillMount(){
        apiservice.getAll('catalog/categories/categoriestree')
            .then((val)=>{
                console.log('val',val)
                this.setState({categoryData: val})
            })
            
    }
    onCKeditorChange(event) {
        var newContent = event.editor.getData();
        this.setState({content : newContent});
    }

    onproCatChange(value){
        this.setState({parent_cat:value})
    }
    
    render() {
        const SUPPORTED_FORMATS = [
            "image/jpg",
            "image/jpeg",
            "image/gif",
            "image/png"
          ];
        return (
            <Fragment>
                <Breadcrumb title="Add New Category" parent="Categories" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <Formik
                            initialValues={{
                                enable_categories: '',
                                enable_in_menu: '',
                                parent_category: '',
                                categories_name: '',
                                description: '',
                                url: '',
                                meta_title: '',
                                meta_value: '',
                                meta_description: '',
                                categories_image: null,
                            }}
                            
                            validationSchema={Yup.object().shape({
                                categories_name: Yup.string().required('Category Name is required.'),
                                enable_categories: Yup.string().required('Status is required.'),
                                url: Yup.string().required('URL is required.')
                                .trim()
                                .matches(/^[a-z-]+$/,"Please input alphabet characters only"),
                                categories_image: Yup.mixed().nullable().test("fileFormat",
                                "Unsupported File Format",(value)=> {if(!value){ return true;}else{ if(SUPPORTED_FORMATS.includes(value.type)) { return true;}else{ return false; } } })
                            })}
                            onSubmit={(values, { setStatus, setSubmitting }) => {
                                setStatus();
                                let formData = new FormData();
                                if(!values.enable_in_menu){
                                    formData.append("enable_in_menu", false)
                                }else{
                                    formData.append("enable_in_menu", true)
                                }

                                if(values.enable_categories == "false"){
                                    formData.append("enable_categories", false)
                                }else{
                                    formData.append("enable_categories", true)
                                }
                                if(values.parent_category){
                                    formData.append("parentId",values.parent_category.toString());
                                }else{
                                    formData.append("parentId","");
                                }
                                formData.append("categories_name", values.categories_name);
                                formData.append("description", this.state.content);
                                formData.append("url", values.url);
                                formData.append("meta_title", values.meta_title);
                                formData.append("meta_value", values.meta_value);
                                formData.append("meta_description", values.meta_description);
                                if(values.categories_image){
                                    formData.append("categories_image", values.categories_image);    
                                }
                                apiservice.createWithForm('catalog/categories/add', formData)
                                    .then( val => {
                                        setSubmitting(false);
                                        if(val){
                                            toast.success('Successfully add new category.');
                                            this.props.history.push({pathname:'/catalog/categories'});
                                        }else{
                                            toast.error("Something Wrong Please try again.")
                                        }
                                    }, error => {
                                        setSubmitting(false);
                                        toast.error(error,{
                                            position: toast.POSITION.TOP_CENTER
                                          })
                                    } )
                            }}
                            render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form style={{ display: "inherit", width: "100%" }}>
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>General</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    <div className="form-group row">
                                                        <label htmlFor="recipient-name" className="col-xl-3 col-md-4">Include in Menu:</label>
                                                        <div className="checkbox-container green">
                                                            <label className="switch">
                                                                <Field type="checkbox" name="enable_in_menu" />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label"><span>*</span> Status</label>
                                                        <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <Field
                                                            component={RadioButton}
                                                            name="enable_categories"
                                                            id="true"
                                                            label="Enable"
                                                            />
                                                        <Field
                                                        component={RadioButton}
                                                        name="enable_categories"
                                                        id="false"
                                                        label="Disable"
                                                        />
                                                        </div>
                                                        <ErrorMessage name="enable_categories" style={{ display: 'block'}} component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0">Parent Category</label>
                                                        
                                                        <Field name="parent_category" id="validationCustom01" render={({ field, form })=>(
                                                            this.state.categoryData && this.state.categoryData.length > 0 ? <TreeSelect
                                                                showSearch
                                                                value={this.state.parent_cat}
                                                                className={'form-control' + (errors.parent_category && touched.parent_category ? ' is-invalid' : '')}
                                                                dropdownStyle={{ overflow: 'auto' }}
                                                                placeholder="None"
                                                                treeDefaultExpandAll
                                                                onChange={e =>{this.onproCatChange(e)
                                                                    form.setFieldValue('parent_category', e)}}
                                                            >
                                                                {Tree(this.state.categoryData)}
                                                            </TreeSelect> : (<p>No any Categories Found.</p>)
                                                            
                                                        )} className={'form-control' + (errors.product_categories && touched.product_categories ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="product_categories" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span> Name</label>
                                                        <Field name="categories_name" id="validationCustom01" type="text" className={'form-control' + (errors.categories_name && touched.categories_name ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="categories_name" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"><span>*</span> URL</label>
                                                        <Field name="url" id="validationCustom01" type="text" className={'form-control' + (errors.url && touched.url ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="url" component="div" className="invalid-feedback" />
                                                    </div>


                                                    <label className="col-form-label pt-0"> Image Upload</label>
                                                    <Field
                                                        name="categories_image"
                                                        component={ImageInput}
                                                        title="Select a image"
                                                        setFieldValue={setFieldValue}
                                                        errorMessage={errors["categories_image"] ? errors["categories_image"] : undefined}
                                                        touched={touched["file"]}
                                                        style={{ display: "flex" }}
                                                    />
                                                    <ErrorMessage name="categories_image" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Add Description</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    <div className="form-group mb-0">
                                                        <div className="description-sm">
                                                            <CKEditors
                                                                activeclassName="p10"
                                                                content={this.state.content}
                                                                events={{
                                                                    "change": this.onCKeditorChange
                                                                }}
                                                            />
                                                        </div>
                                                        <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Meta Data</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="digital-add needs-validation">
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"> Meta Title</label>
                                                        <Field className={'form-control' + (errors.meta_title && touched.meta_title ? ' is-invalid' : '')} name="meta_title" id="validationCustom05" type="text"/>
                                                        <ErrorMessage name="meta_title" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label pt-0"> Meta Value</label>
                                                        <Field className={'form-control' + (errors.meta_value && touched.meta_value ? ' is-invalid' : '')} name="meta_value" id="validationCustom05" type="text" required="" />
                                                        <ErrorMessage name="meta_value" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-form-label">Meta Description</label>
                                                        <Field name="meta_description" component="textarea" rows="4" cols="12" className={(errors.meta_description && touched.meta_description ? 'is-invalid' : '')} />
                                                        <ErrorMessage name="meta_description" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <div className="product-buttons text-center">
                                                            <button type="submit" className={'btn btn-primary' + (isSubmitting == true ? ' btn-loading' : '')} disabled={isSubmitting}>
                                                                {isSubmitting &&
                                                                    <div className="spinner-glow spinner-glow-danger"></div>
                                                                }
                                                                <span>Add</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default addCatagories;