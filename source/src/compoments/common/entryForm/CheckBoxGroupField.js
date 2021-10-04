import React from 'react';

import { Form, Checkbox, Row, Col } from 'antd';

import BaseField from './BaseField';

class CheckBoxGroupField extends BaseField {

    getOptions = () => {
        const { options, optionValue, optionLabel } = this.props;
        if(options && optionValue && optionLabel) {
            return options.map(option => ({ value: option[optionValue], label: option[optionLabel]}));
        }
        return options || [];
    }
    render() {
        const {
            label,
            fieldName,
            onChange,
            colSpan
        } = this.props;

        return (
            <Form.Item label={label}
                name={fieldName}
                rules={this.getRules()}
            >
                <Checkbox.Group onChange={onChange}>
                    <Row>
                    {
                    this.getOptions().map(option => 
                            <Col span={colSpan || 4} key={option.value}>
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            </Col>
                            )
                    }
                    </Row>
                </Checkbox.Group>
            </Form.Item>
        )
    }
}

export default CheckBoxGroupField;
