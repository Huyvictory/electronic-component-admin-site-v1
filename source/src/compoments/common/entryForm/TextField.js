import React from 'react';

import { Form, Input } from 'antd';

import BaseField from './BaseField';
const { TextArea } = Input;

class TextField extends BaseField {

    getMaxLengthMsg() {
        const { maxLength, maxLengthMsg } = this.props;
        return maxLengthMsg || `Trường này không thể nhiều hơn ${maxLength} ký tự`;
    }

    getMinLengthMsg() {
        const { minLength, minLengthMsg } = this.props;
        return minLengthMsg || `Trường này không thể ít hơn ${minLength} characters`;
    }

    getTextFieldRules() {
        const { maxLength, minLength, type, invalidEmailMsg } = this.props;
        const rules = [];
        if(maxLength) {
            rules.push({max: maxLength, message: this.getMaxLengthMsg()});
        }
        if(minLength) {
            rules.push({min: minLength, message: this.getMinLengthMsg()});
        }
        if(type === 'email') {
            rules.push({
                type,
                message: invalidEmailMsg || 'Định dạng email không hợp lệ!'
            })
        }

        return rules;
    }
    render() {
        const {
            type,
            size,
            label,
            fieldName,
            disabled,
            onBlur,
            validateStatus,
            help,
            style
        } = this.props;

        return (
            <Form.Item
                label={label}
                name={fieldName}
                validateStatus={validateStatus}
                help={help}
                rules={[
                    ...this.getRules(),
                    ...this.getTextFieldRules()
                ]}
            >
                {
                    type === 'textarea'
                    ?
                    <TextArea style={style} placeholder={this.getPlaceHolder()} disabled={disabled} onBlur={onBlur}/>
                    :
                    <Input style={style} size={size} placeholder={this.getPlaceHolder()} disabled={disabled} type={type} onBlur={onBlur}/>
                } 
            </Form.Item>
        )
    }
}

export default TextField;