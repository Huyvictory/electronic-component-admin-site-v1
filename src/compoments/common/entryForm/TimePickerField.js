import React from 'react';

import { Form, TimePicker } from 'antd';

import BaseField from './BaseField';

import { TIME_FORMAT_DISPLAY } from '../../../constants'

class TimePickerField extends BaseField {

    render() {
        const {
            width,
            size,
            format,
            label,
            fieldName,
            disabled,
            disabledMinutes,
            disabledHours,
            onSelect,
            onChange,
            validateTrigger
        } = this.props;
        const timeFormat = format || TIME_FORMAT_DISPLAY;

        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
                validateTrigger={validateTrigger}
            >
                
                <TimePicker
                    placeholder={this.getPlaceHolder()}
                    onSelect={onSelect}
                    size={size}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    style={{width: width || '60%'}}
                    format={timeFormat}
                    disabled={disabled}
                    onChange={onChange}
                    // hideDisabledOptions={true}
                />
            </Form.Item>
        )
    }
}

export default TimePickerField;
