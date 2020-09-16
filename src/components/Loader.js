import React, { Component, Fragment } from 'react';
import { BarLoader } from 'react-spinners';

import { css } from '@emotion/core';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
export class Loader extends Component {
    constructor(props) {
        super(props);
      }
    render(){
        return (
            <Fragment>
                <div className='sweet-loading'>
                    <BarLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#ff7f84'}
                    loading={true}
                    {...this.props}
                    />
                </div> 
            </Fragment>
        )
    }
}

export default Loader