import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import BooleanField from "../common/entryForm/BooleanField";


class SettingForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getInitialFormValues = () => {
    const { isEditing, dataDetail } = this.props;
    if (!isEditing) {
      return {
        editable: true,
      };
    }
    return dataDetail;
  };

  render() {
    const { isEditing, formId, loadingSave } = this.props;

    return (
      <Form
        id={formId}
        ref={this.formRef}
        layout="vertical"
        onFinish={this.handleSubmit}
        initialValues={this.getInitialFormValues()}
      >
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              fieldName="name"
              min={6}
              label="Tên"
              required
              disabled={loadingSave}
            />
          </Col>
          <Col span={12}>
            <TextField fieldName="value" label="Giá trị" required disabled={loadingSave}/>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <TextField type="textarea" fieldName="description" label="Mô tả" disabled={loadingSave}/>
          </Col>
          {/* <Col span={12} hidden={isEditing}>
            <BooleanField fieldName="editable" label="Có thể chỉnh sửa" disabled={isEditing || loadingSave}/>
          </Col> */}
        </Row>
      </Form>
    );
  }
}

export default SettingForm;
