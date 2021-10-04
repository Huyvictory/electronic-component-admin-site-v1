import {Component} from 'react';

import { FieldTypes } from '../../../constants/formConfig';
import Utils from '../../../utils';

class BaseField extends Component {

    constructor(props) {
        super(props);


        this.fieldType = FieldTypes.STRING;
        this.getRules = this.getRules.bind(this);
        this.getInitValue = this.getInitValue.bind(this);
    }

    getPlaceHolder() {
        const { placeholder, required } = this.props;
        if(placeholder) {
            return placeholder;
        }
        else if(required) {
            return this.getRequiredMsg();
        }

        return '';
    }

    getRequiredMsg() {
        const { fieldName, requiredMsg, label } = this.props;
        let fieldTitle = '';
        if(label) {
                fieldTitle = label;
        }
        else if(fieldName) {
            if(Array.isArray(fieldName)) {
                fieldTitle = Utils.convertStringToLowerCase(fieldName[fieldName.length - 1]);
            }
            else {
                fieldTitle = Utils.convertStringToLowerCase(fieldName);
            }
        }
        let action = '';
        switch(this.fieldType) {
            case FieldTypes.SELECT:
            case FieldTypes.AUTOCOMPLETE:
                action = 'chọn';
                break;
            default:
                action = 'nhập';
        }

        return requiredMsg ||`Vui lòng ${action} ${fieldTitle}`;
    }

    getRules() {
        const {
            //fieldName,
            required,
            // min,
            // max,
            // len,
            // compareTo,
            validators
        } = this.props;

        const rules = [];

        if(required) {
            rules.push({
                required,
                message: this.getRequiredMsg()
            })
        }

        if(validators && validators.length > 0) {
            validators.forEach(validator => {
                rules.push({ validator });
            });
        }

        return rules;
    }

    getInitValue() {
        const { initialValue, dataDetail, fieldName } = this.props;
        if(initialValue)
            return initialValue;
        else if(dataDetail && dataDetail[fieldName])
            return dataDetail[fieldName];
        else
            return undefined;
    }
}

export default BaseField;
