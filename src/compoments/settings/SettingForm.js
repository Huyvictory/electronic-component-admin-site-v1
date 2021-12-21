import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import BooleanField from "../common/entryForm/BooleanField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import { showErrorMessage } from "../../services/notifyService";
import Utils from "../../utils";


class SettingForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.dataDetail.value
        ? `${AppConstants.contentRootUrl}/${props.dataDetail.value}`
        : "",
      uploading: false,
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

  uploadFileAvatar = (file, onSuccess) => {
    const { uploadFile } = this.props;
    this.setState({ uploading: true });
    uploadFile({
      params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
      onCompleted: (result) => {
        this.setFieldValue("value", result.data.filePath);
        this.setState({ uploading: false });
        onSuccess();
      },
      onError: (err) => {
        if (err && err.message) {
          showErrorMessage(err.message);
          this.setState({ uploading: false });
        }
      },
    });
  };

  handleChangeAvatar = (info) => {
    console.log(info);
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (avatar) =>
        this.setState({ avatar })
      );
    }
  };

  render() {
    const { isEditing, formId, loadingSave } = this.props;
    const { avatar, uploading } = this.state;
    console.log(avatar);
    const dataDetail = this.getInitialFormValues();
    // console.log(dataDetail);
    console.log(dataDetail.kind);

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
          {dataDetail.kind === 1 || dataDetail.kind === undefined ? <Col span={12}>
            <TextField fieldName="value" label="Giá trị" required disabled={loadingSave}/>
          </Col> : 
          <Col>
            <CropImageFiled fieldName="value" aspect={1.5} loading={uploading} imageUrl={avatar} onChange={this.handleChangeAvatar} uploadFile={this.uploadFileAvatar} label="Ảnh" required disabled={loadingSave} />
          </Col>}
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
