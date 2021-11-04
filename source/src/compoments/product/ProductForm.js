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
import {categoryTypes} from '../../constants/masterData';
import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

class ProductForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.dataDetail.productImage
        ? `${AppConstants.contentRootUrl}/${props.dataDetail.productImage}`
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
        this.setFieldValue("productImage", result.data.filePath);
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
    const { formId, dataDetail, commonStatus, loadingSave, isEditing, categoryTypes } = this.props;
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
						fieldName="productImage"
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
					fieldName="productName"
					label="Tên sản phẩm"
					required
					disabled={loadingSave}
					/>
				</Col>
        <Col span={12}>
          <TextField 
            fieldName="productPrice"
            label="Giá sản phẩm"
            type="number"
            required
            disabled={loadingSave}>
          </TextField>
        </Col>
			</Row>

      <Row gutter={16}>
        <Col span={12}>
          <DropdownField 
          fieldName="status"
          label="Trạng thái"
          options={commonStatus}
          disabled={loadingSave}>
          </DropdownField>
        </Col>
        <Col span={12}>
          <DropdownField 
          fieldName="categoryId"
          required
          label="Danh mục sản phẩm"
          options={categoryTypes}
          disabled={isEditing}>
          </DropdownField>
        </Col>
      </Row>	
      </Form>
    );
  }
}

export default ProductForm;
