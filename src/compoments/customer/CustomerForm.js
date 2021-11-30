import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import FieldSet from "../common/elements/FieldSet";
import DropdownField from "../common/entryForm/DropdownField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import DatePickerField from "../common/entryForm/DatePickerField";
import { commonLanguages } from "../../constants/masterData";
import { convertStringToDateTime, convertDateTimeToString } from "../../utils/datetimeHelper";
import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

class CustomerForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.dataDetail.customerAvatarPath
        ? `${AppConstants.contentRootUrl}/${props.dataDetail.customerAvatarPath}`
        : "",
      uploading: false,
    }
  }

  getInitialValue = () => {
    const { dataDetail, isEditing } = this.props;
    if(!isEditing) {
      return {
        ...dataDetail,
        status: STATUS_ACTIVE,
      }
    }
    return {
      ...dataDetail,
    }
  }

  handleChangeAvatar = (info) => {
    console.log(info);
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (avatar) =>
        this.setState({ avatar })
      );
    }
  };

  uploadFileAvatar = (file, onSuccess) => {
    const { uploadFile } = this.props;
    this.setState({ uploading: true });
    uploadFile({
      params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
      onCompleted: (result) => {
        this.setFieldValue("customerAvatarPath", result.data.filePath);
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

  render() {
    const { formId, dataDetail, commonStatus, loadingSave, isEditing } = this.props;
    const { avatar, uploading } = this.state;
    return (
      <Form
        id={formId}
        ref={this.formRef}
        layout="vertical"
        onFinish={this.handleSubmit}
        initialValues={this.getInitialValue()}
      >
			<Row gutter={16}>
				<Col span={12}>
					<CropImageFiled
						fieldName="customerAvatarPath"
						loading={uploading}
						label="Ảnh đại diện"
						imageUrl={avatar}
						onChange={this.handleChangeAvatar}
						uploadFile={this.uploadFileAvatar}
						disabled={loadingSave}
					/>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<TextField
					fieldName="customerFullName"
					label="Họ và tên"
					required
					disabled={loadingSave}
					/>
				</Col>
			</Row>
			<Row gutter={16}>
          <Col span={12}>
            <TextField
              type="password"
              fieldName="customerPassword"
              label={isEditing ? "Mật khẩu mới" : "Mật khẩu"}
              required={!isEditing}
              validators={[this.validateToConfirmPassword]}
              minLength={6}
              disabled={loadingSave}
            />
          </Col>
          <Col span={12}>
            <TextField
              type="number"
              fieldName="customerPhone"
              label="Số điện thoại"
              required
              minLength={10}
              disabled={loadingSave}
            />
          </Col>
      </Row>
			<Row gutter={16}>
        <Col span={12}>
					<TextField
						fieldName="customerAddress"
						label="Địa chỉ"
						required
						disabled={loadingSave}
					/>
				</Col>
				<Col span={12}>
					<TextField fieldName="customerEmail" label="E-mail" type="email" disabled={loadingSave} required/>
				</Col>
			</Row>

			<Row gutter={16}>
        <Col span={12}>
          <DropdownField
            fieldName="status"
            label="Trạng thái"
            required
            options={commonStatus}
            disabled={loadingSave}
          />
        </Col>
			</Row>
      </Form>
    );
  }
}

export default CustomerForm;
