import React from 'react';

import { Form, Checkbox } from 'antd';

import BaseField from './BaseField';

class CheckBoxField extends BaseField {

    render() {
        const {
            label,
            fieldName,
            optionLabel,
            onChange
        } = this.props;

        return (
            <Form.Item label={label}
                name={fieldName}
                rules={this.getRules()}
                valuePropName="checked"
            >
                <Checkbox onChange={onChange}>
                    {optionLabel}
                </Checkbox>
            </Form.Item>
        )
    }
}

export default CheckBoxField;
