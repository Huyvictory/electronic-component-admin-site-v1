import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import FieldSet from "../common/elements/FieldSet";
import DropdownField from "../common/entryForm/DropdownField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import { commonStatus } from "../../constants/masterData";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

class CategoryForm extends BasicForm {
    constructor(props) {
        super(props);
        this.state = {
        avatar: props.dataDetail.categoryImage
            ? `${AppConstants.contentRootUrl}/${props.dataDetail.categoryImage}`
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
            this.setFieldValue("categoryImage", result.data.filePath);
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

    handleSubmit(formValues) { 
        const { onSubmit } = this.props;
        onSubmit({
            ...formValues,
            categoryOrdering: 0,
        });
    }

    render() {
        const { formId, dataDetail, loadingSave, isEditing } = this.props;
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
                        fieldName="categoryImage"
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
                    fieldName="categoryName"
                    label="Tên danh mục"
                    required
                    disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    type="textarea"
                    fieldName="categoryDescription"
                    label="Mô tả"
                    required
                    style={{
                        height: 100
                    }}
                    disabled={loadingSave}/>
                </Col>
            </Row>
            <Row gutter={16}>
                {
                    isEditing ? (
                        <Col span={12}>
                            <DropdownField
                                fieldName="status"
                                label="Trạng thái"
                                required
                                options={commonStatus}
                                disabled={loadingSave}
                            />
                        </Col>
                    ) : null
                }
            </Row>
        </Form>
        );
    }
}

export default CategoryForm;
