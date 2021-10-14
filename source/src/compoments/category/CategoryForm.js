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

class CategoryForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.dataDetail.categoryAvatarPath
        ? `${AppConstants.contentRootUrl}/${props.dataDetail.categoryAvatarPath}`
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
        this.setFieldValue("categoryAvatarPath", result.data.filePath);
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

  // validateToConfirmPassword = (rule, value) => {
  //   const {
  //     current: { validateFields, isFieldTouched },
  //   } = this.formRef;
  //   if (isFieldTouched("confirmPassword")) {
  //     validateFields(["confirmPassword"], { force: true });
  //   }
  //   return Promise.resolve();
  // };
  // compareToPassword = (rule, newPassword) => {
  //   const password = this.getFieldValue("customerPassword");
  //   if ((password || newPassword) && password !== newPassword) {
  //     return Promise.reject("Mật khẩu không khớp");
  //   } else {
  //     return Promise.resolve();
  //   }
  // };

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
						fieldName="categoryAvatarPath"
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
					fieldName="CategoryName"
					label="Tên danh mục"
					required
					disabled={loadingSave || isEditing}
					/>
				</Col>
				<Col span={12}>
					<TextField
					fieldName="CategoryType"
					label="Loại danh mục"
					required
					disabled={loadingSave}
          initialValues = "1"
					/>
				</Col>
			</Row>
			<Row gutter={16}>
          <Col span={24}>
            <TextField
              fieldName="CategoryDescription"
              label={"Mô tả danh mục"}
              required={!isEditing}
              disabled={loadingSave}
              style = {{height: '50px'}}
            />
          </Col>

          {/* <Col span={12}>
            <TextField
              fieldName="confirmPassword"
              type="password"
              label={isEditing ? "Xác nhận mật khẩu mới" : "Xác nhận mật khẩu"}
              required={!isEditing || this.getFieldValue("password")}
              validators={[this.compareToPassword]}
              disabled={loadingSave}
            />
          </Col> */}
      </Row>			
      </Form>
    );
  }
}

export default CategoryForm;
