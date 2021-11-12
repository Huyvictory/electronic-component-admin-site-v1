import React, { Component } from 'react';

class BasicForm extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.otherData = {};
    }

    getFieldValue(fieldName) {
        if(this.formRef.current)
            return this.formRef.current.getFieldValue(fieldName);
        return '';
    }

    setFieldValue(fieldName, value) {
        this.formRef.current.setFieldsValue({[fieldName]: value});
    }

    handleSubmit(formValues) { 
        const { onSubmit } = this.props;
        onSubmit({
            ...formValues,
            ...this.otherData
        });
    }

    handleReset() {
        const { onResetForm,} = this.props;
       
        this.formRef.current.resetFields();
        if(onResetForm)
            onResetForm();
        
    };
}

export default BasicForm;