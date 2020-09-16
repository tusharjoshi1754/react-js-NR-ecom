import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import PermMediaIcon from '@material-ui/icons/PermMedia';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';

import withStyles from "@material-ui/core/styles/withStyles";
import customImageInputStyle from "./ImageInputStyle";
import classnames from "classnames";

class CustomImageInput extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.removeSelectedFile = this.removeSelectedFile.bind(this);
  }

  state = {
    file: undefined,
    imagePreviewUrl: undefined
  };

  showFileUpload() {
    if (this.fileUpload) {
      this.fileUpload.current.click();
    }
  }

  removeSelectedFile(){
    this.setState({file:undefined, imagePreviewUrl:undefined});
    this.props.setFieldValue(this.props.field.name, null);
  }

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
      this.props.setFieldValue(this.props.field.name, file);
    }
  }

  showPreloadImage() {
    const { errorMessage, classes } = this.props;
    const { name } = this.props.field;
    const { file, imagePreviewUrl } = this.state;

    let comp = null;

    if (errorMessage) {
      comp = <BrokenImageIcon style={{ fontSize: 36 }}/>;
    } else if (file) {
      comp = (
        <img className={classes.avatarThumb} src={imagePreviewUrl} alt="..." />
      );
    } else {
      comp = <PermMediaIcon style={{ fontSize: 36 }} />;
    }
    return comp;
  }

  componentDidMount() {
    
  }

  render() {
    const { errorMessage, title, classes } = this.props;
    const { name, onBlur } = this.props.field;

    const avatarStyle = classnames(
      classes.bigAvatar,
      this.state.file ? [classes.whiteBack] : [classes.primaryBack],
      { [classes.errorBack]: errorMessage }
    );

    return (
      <div className={classes.container}>
        <input
          className={classes.hidden}
          id={name}
          name={name}
          type="file"
          onChange={this.handleImageChange}
          ref={this.fileUpload}
          // onBlur={onBlur}
          //className="form-control"
        />
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
        <Avatar className={avatarStyle} onClick={this.showFileUpload}>
          {this.showPreloadImage()}
        </Avatar>
        {errorMessage ? (
            <Typography variant="caption" className={classes.errMsg} color="error">
              {errorMessage}
            </Typography>
          ) : null}
        {this.state.file ?
        <div className={classes.removeFiles}>
          <button className="btn btn-primary" onClick={this.removeSelectedFile}>Remove</button>
        </div>
        : null}
        

       
      </div>
    );
  }
}

export default withStyles(customImageInputStyle)(CustomImageInput);
