import React from 'react';
import ColorPicker from 'rc-color-picker';
import { Form, Input } from 'antd';

import BaseField from './BaseField';

import 'rc-color-picker/assets/index.css';

class ColorField extends BaseField {

    constructor(props) {
        super(props);
        this.state = {
            color: `#${this.getDefaultValue()}`
        }
    }

    getDefaultValue = () => {
        const { dataForm, fieldName } = this.props;
        if(dataForm && fieldName) {
            if(Array.isArray(fieldName) && dataForm[fieldName[0]] && dataForm[fieldName[0]][fieldName[1]]) {
                return dataForm[fieldName[0]][fieldName[1]];
            }
            return dataForm[fieldName] || 'ffffff';
        }
        return 'ffffff';
    }

    onChangeColor = ({color}) => {
        const { onChange, fieldName } = this.props;
        this.setState({color});
        if(onChange) {
            onChange(fieldName, color);
        }
    }

    render() {
        const {
            label,
            fieldName,
            // disabled,
            // width,
        } = this.props;
        const { color } = this.state;
        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
            >
                <ColorPicker
                    color={color}
                    onChange={this.onChangeColor}
                    className="color-picker"
                >
                    <Input/>
                </ColorPicker>
            </Form.Item>
        )
    }
}

export default ColorField;
