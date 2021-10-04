import React from 'react';

import { Form, InputNumber } from 'antd';

import BaseField from './BaseField';
import Utils from '../../../utils';

class NumericField extends BaseField {

    parser(value) {
        return value.replace(/\$\s?|(,*)/g, '');
    }

    formatter(value) {
        return Utils.formatNumber(value);
    }

    render() {
        const {
            label,
            fieldName,
            disabled,
            min,
            max,
            width,
            onChange,
            onBlur,
            formatter,
            parser,
        } = this.props;

        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
            >
                <InputNumber
                    placeholder={this.getPlaceHolder()}
                    max={max}
                    min={min}
                    disabled={disabled}
                    style={{width: width || '60%'}}
                    formatter={formatter || this.formatter}
                    parser={parser || this.parser}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                
            </Form.Item>
        )
    }
}

export default NumericField;
