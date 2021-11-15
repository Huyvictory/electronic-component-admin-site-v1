import React, { Component } from 'react';
import { Result } from 'antd';

class Forbidden extends Component {

    componentWillMount() {
        const { changeBreadcrumb } = this.props;
        changeBreadcrumb([{name: 'forbidden'}]);
    }

    render() {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
            />
        )
    }
}

export default Forbidden;
