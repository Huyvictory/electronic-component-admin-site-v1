import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import DropdownField from "../common/entryForm/DropdownField";
import CropImageFiled from "../common/entryForm/CropImageFiled";

import { commonStatus, commonLanguages } from "../../constants/masterData";

import {
  AppConstants,
  UploadFileTypes,
  STATUS_ACTIVE,
} from "../../constants";
import Utils from "../../utils";
import { showErrorMessage } from "../../services/notifyService";

// import { actions } from "../../actions";
// const { getUserData } = actions;

class AdminForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      logo: props.dataDetail.avatar
        ? `${AppConstants.contentRootUrl}/${props.dataDetail.avatar}`
        : "",
      uploading: false,
    };
    // this.otherData.logoPath = props.dataDetail.logoPath;
  }

  componentWillMount() {
    const { searchGroupPermissionList,  kind } = this.props;
    searchGroupPermissionList({ params: { page: 0, size: 100, kind } });
    // const userData = getUserData();
  }

  componentDidMount() {
    const { dataDetail } = this.props;
    this.setFieldValue("avatar", dataDetail.avatar);
  }

  componentWillReceiveProps(nextProps) {
    const { isEditing, roles } = this.props;
    if (
      !isEditing &&
      nextProps.roles !== roles &&
      nextProps.roles &&
      nextProps.roles.length > 0
    ) {
      this.setFieldValue("groupId", nextProps.roles[0].id);
    }
  }



  validateToConfirmPassword = (rule, value) => {
    const {
      current: { validateFields, isFieldTouched },
    } = this.formRef;
    if (isFieldTouched("confirmPassword")) {
      validateFields(["confirmPassword"], { force: true });
    }
    return Promise.resolve();
  };

  compareToPassword = (rule, newPassword) => {
    const password = this.getFieldValue("password");
    if ((password || newPassword) && password !== newPassword) {
      return Promise.reject("Password that you enter is inconsistent!");
    } else {
      return Promise.resolve();
    }
  };

  getRoles = () => {
    const { ddlRoleLoading, roles, dataDetail } = this.props;
    if (ddlRoleLoading && dataDetail.group) {
      return [
        {
          id: dataDetail.group.id,
          name: dataDetail.group.name,
        },
      ];
    }
    return roles;
  };

  handleChangeLogo = (info) => {
    console.log(info);
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (logo) =>
        this.setState({ logo })
      );
    }
  };

  uploadFileLogo = (file, onSuccess) => {
    const { uploadFile } = this.props;
    this.setState({ uploading: true });
    uploadFile({
      params: { fileObjects: { file }, type: UploadFileTypes.LOGO },
      onCompleted: (result) => {
        // this.otherData.logoPath = result.data.filePath;
        this.setFieldValue("avatarPath", result.data.filePath);
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


  getInitialFormValues = () => {
    const { isEditing, dataDetail } = this.props;
    if (!isEditing) {
      return {
        ...dataDetail,
        status: STATUS_ACTIVE,
      };
    }
    return dataDetail;
  };

  render() {
    const { isEditing, formId, loadingSave } = this.props;
    const { logo, uploading } = this.state;
    // const userData = getUserData();
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
					<CropImageFiled
						fieldName="avatarPath"
						loading={uploading}
						label="Ảnh đại diện"
						imageUrl={logo}
						onChange={this.handleChangeLogo}
						uploadFile={this.uploadFileLogo}
						disabled={loadingSave}
					/>
				</Col>
			</Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              fieldName="username"
              min={6}
              label="Tên đăng nhập"
              disabled={isEditing || loadingSave}
              required={!isEditing}
            />
          </Col>
          <Col span={12}>
            <TextField fieldName="fullName" label="Họ và tên" required disabled={loadingSave}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              type="password"
              fieldName="password"
              label={isEditing ? "Mật khẩu mới" : "Mật khẩu"}
              required={!isEditing}
              validators={[this.validateToConfirmPassword]}
              minLength={6}
              disabled={loadingSave}
            />
          </Col>
          <Col span={12}>
            <TextField
              type="password"
              fieldName="confirmPassword"
              label={isEditing ? "Xác nhận mật khẩu mới" : "Xác nhận mật khẩu"}
              required={!isEditing || this.getFieldValue("password")}
              validators={[this.compareToPassword]}
              disabled={loadingSave}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField fieldName="email" label="E-mail" type="email" disabled={loadingSave}/>
          </Col>
          <Col span={12}>
            <TextField
              type="number"
              fieldName="phone"
              label="Số điện thoại"
              required={!isEditing}
              minLength={10}
              disabled={loadingSave}
            />
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

export default AdminForm;
