import React from 'react';

import { Form, DatePicker } from 'antd';

import BaseField from './BaseField';

import { DATE_FORMAT_DISPLAY } from '../../../constants'

const { RangePicker } = DatePicker;

class DatePickerField extends BaseField {

    render() {
        const {
            width,
            size,
            format,
            label,
            fieldName,
            disabled,
            disabledDate,
            onChange,
        } = this.props;
        const dateFormat = format || DATE_FORMAT_DISPLAY;
        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
            >
                <RangePicker 
                    size={size}
                    disabledDate={disabledDate}
                    style={{width: width || '50%'}}
                    format={dateFormat}
                    disabled={disabled}
                    onChange={onChange}
                />
            </Form.Item>
        )
    }
}

export default DatePickerField;
