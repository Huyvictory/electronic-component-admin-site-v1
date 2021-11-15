
import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import FieldSet from "../common/elements/FieldSet";
import DropdownField from "../common/entryForm/DropdownField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import DatePickerField from "../common/entryForm/DatePickerField";
import { convertStringToDateTime, convertDateTimeToString } from "../../utils/datetimeHelper";
import {commonStatus} from "../../constants/masterData";
import RichTextField from '../common/entryForm/RichTextField';
import {categoryTypes} from '../../constants/masterData';


import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

class NewsForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.dataDetail.avatar
        ? `${AppConstants.contentRootUrl}/${props.dataDetail.avatar}`
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
        this.setFieldValue("avatar", result.data.filePath);
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
    const { formId, dataDetail, commonStatus, loadingSave, isEditing,categoryTypes } = this.props;
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
						fieldName="avatar"
						loading={uploading}
						label="Hình ảnh"
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
					fieldName="title"
          type="string"
					label="Tiêu đề"
					required
					disabled={loadingSave}
					/>
				</Col>
        <Col span={12}>
          <DropdownField 
          fieldName="categoryId"
          label="Danh mục tin tức"
          disabled={loadingSave}
          options = {categoryTypes}>
          </DropdownField>
        </Col>
			</Row>
      <Row gutter={16}>
        <Col span={24}>
          <RichTextField
          label="Mô tả sản phẩm"
          fieldName="description"
          disabled={loadingSave}>
          </RichTextField>
        </Col>
      </Row>	
      
      </Form>
    );
  }
}

export default NewsForm;
