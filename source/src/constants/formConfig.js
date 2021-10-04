const FormItemLayoutConf = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    }
}

const FieldTypes = {
  STRING: 'STRING_TYPE',
  NUMBER: 'NUMBER_TYPE',
  SELECT: 'SELECT',
  AUTOCOMPLETE:'AUTOCOMPLETE',
  DATE: 'DATE'
}

export {
  FieldTypes,
  FormItemLayoutConf
}