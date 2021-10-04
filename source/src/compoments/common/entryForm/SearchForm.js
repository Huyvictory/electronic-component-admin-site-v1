import React from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import BasicForm from './BasicForm';
import Utils from '../../../utils';
import { FieldTypes } from '../../../constants/formConfig';
import { DATE_FORMAT_DISPLAY } from '../../../constants'

class SearchForm extends BasicForm {

    getPlaceHolder(item) {
        return item.seachPlaceholder || `Tìm kiếm bằng ${Utils.camelCaseToTitleCase(item.key)}`
    }

    getLabelFieldItem(item) {
        if (item.isShowFilterLabel)
            return item.title;
        return '';
    }
   
    onChangeAutocomplete = (value, item, fieldItem) => {
        const { onChange, reflectFields, isSubmitOnChangeValue } = fieldItem;
        if(isSubmitOnChangeValue) {
            this.handleSubmit(this.formRef.current.getFieldsValue());
        }
        if(onChange) {
            onChange(value, item);
        }
        if(reflectFields) {
            const fileds = reflectFields.split(',');
            fileds.forEach(reflectFieldName => this.setFieldValue(reflectFieldName, undefined))
        }
    }

    onSelectValue = (value, fieldItem) => {
        const { isSubmitOnChangeValue, onSelectValue } = fieldItem;
        if(isSubmitOnChangeValue) {
            this.handleSubmit(this.formRef.current.getFieldsValue());
        }
        else if(onSelectValue) {
            onSelectValue(value);
        }
    }

    getSelectOptions(fieldItem) {
        let { options, initialValue, optionValueKey, optionLabelKey} = fieldItem;
        optionValueKey = optionValueKey || 'value';
        optionLabelKey = optionLabelKey || 'label';
        if(options && options.length > 0)
            return options;
        else if(initialValue)
            return [{ [optionValueKey]: initialValue, [optionLabelKey]: '' }];
        else
            return [];
    }

    onChangeDateField = (date, fieldItem) => {
        if(fieldItem.onChange) {
            fieldItem.onChange(date);
        }
        
        if(fieldItem.fieldNameChild) {
            this.setFieldValue(fieldItem.fieldNameChild, null);
        }
    }

    onFilterOption = (input, option) => {
        return Utils.removeAccents(option.children.toLowerCase()).indexOf(Utils.removeAccents(input.toLowerCase())) >= 0
    }

    renderFormType(fieldItem) {
        if (fieldItem === undefined || fieldItem === null) {
            return null
        }
        if (fieldItem.fieldType === FieldTypes.DATE) {
            const dateFormat = fieldItem.format || DATE_FORMAT_DISPLAY;
            return (
                <DatePicker
                    style={{ width: fieldItem.width || 200 }}
                    placeholder={this.getPlaceHolder(fieldItem)}
                    defaultValue={fieldItem.initialValue}
                    format={dateFormat}
                    onChange={(date) => this.onChangeDateField(date, fieldItem)}
                    disabledDate={fieldItem.disabledDate}
                />
            )
        }
        else if (fieldItem.fieldType === FieldTypes.SELECT) {
            let { optionValueKey, optionLabelKey, loading, allowClear } = fieldItem;
            optionValueKey = optionValueKey || 'value';
            optionLabelKey = optionLabelKey || 'label';

            return (
                <Select
                    showArrow
                    allowClear={allowClear === false ? false : true}
                    loading={loading}
                    placeholder={this.getPlaceHolder(fieldItem)}
                    style={{ width: fieldItem.width || 200 }}
                    defaultValue={fieldItem.initialValue}
                    onSelect={(value) => this.onSelectValue(value, fieldItem)}
                >
                    {
                        this.getSelectOptions(fieldItem).map(option =>
                            <Select.Option key={option[optionValueKey]}>
                                {option[optionLabelKey]}
                            </Select.Option>
                        )
                    }
                </Select>
            )
        }  else if (fieldItem.fieldType === FieldTypes.AUTOCOMPLETE) {
            let { options, onSearch, optionValueKey, optionLabelKey, optionLabelProp, renderItem, loading, allowClear } = fieldItem;
            optionValueKey = optionValueKey || 'id';
            optionLabelKey = optionLabelKey || 'name';
            optionLabelProp = optionLabelProp || 'children';
            return (
                <Select
                    showSearch
                    showArrow={loading || false}
                    allowClear={allowClear === false ? false : true}
                    loading={loading}
                    style={{ minWidth: 200 }}
                    placeholder={this.getPlaceHolder(fieldItem)}
                    defaultActiveFirstOption={false}
                    onChange={(value, item) => this.onChangeAutocomplete(value, item, fieldItem)}
                    onSearch={(onSearch)}
                    filterOption={onSearch ? false : this.onFilterOption}
                    optionLabelProp={optionLabelProp}
                >
                    {
                        options.map(option =>
                            renderItem
                            ?
                            renderItem(option[optionValueKey], option[optionValueKey], option)
                            :
                            <Select.Option key={option[optionValueKey]}>
                                {option[optionLabelKey]}
                            </Select.Option>
                        )
                    }
                </Select>
            )
        }else {
            return (<Input style={{ width: fieldItem.width || 200 }} defaultValue={fieldItem.initialValue} placeholder={this.getPlaceHolder(fieldItem)} />)
        }
    }

    componentDidMount() {
        this.formRef.current.setFieldsValue(this.props.initialValues);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.searchFields !== this.props.searchFields) {
            this.props.searchFields.forEach(searchField => {
                if(searchField.isSelectFirstOption && searchField.options && searchField.options.length > 0 && !this.getFieldValue(searchField.key)) {
                    const optionValueKey = searchField.optionValueKey || 'id';
                    this.setFieldValue(searchField.key, searchField.options[0][optionValueKey].toString())
                }
            });
        }
    }

    render() {
        const { searchFields, className, hiddenAction } = this.props;
        return (
            <Form
                ref={this.formRef}
                layout="inline"
                onFinish={this.handleSubmit}
                className={className || 'search-form'}
            >
                {
                    searchFields.map(fieldItem =>
                        <Form.Item
                            key={fieldItem.key}
                            label={this.getLabelFieldItem(fieldItem)}
                            name={fieldItem.key}
                        >
                            {
                                this.renderFormType(fieldItem)
                            }
                        </Form.Item>
                    )
                }
                {
                    hiddenAction
                    ?
                    null
                    :
                    <Form.Item>
                        <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                            Tìm kiếm
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            <i className="icfa fa-refresh" /> Làm mới
                        </Button>
                    </Form.Item>
                }
            </Form>
        );
    }
}

export default SearchForm;