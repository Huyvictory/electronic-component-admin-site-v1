import React from 'react';

import { Form, Radio } from 'antd';

import BaseField from './BaseField';

class RadioField extends BaseField {

    render() {
        const {
            label,
            fieldName,
            className,
            optionLabel,
            onChange
        } = this.props;

        return (
            <Form.Item label={label}
                name={fieldName}
                rules={this.getRules()}
                valuePropName="checked"
                className={className}
            >
                <Radio onChange={onChange}>
                    {optionLabel}
                </Radio>
            </Form.Item>
        )
    }
}

export default RadioField;
