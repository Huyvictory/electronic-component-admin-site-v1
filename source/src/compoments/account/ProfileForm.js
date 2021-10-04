import React from "react";
import { Form, Button } from "antd";
import BasicForm from "../common/entryForm/BasicForm";
import TextField from "../common/entryForm/TextField";
import CropImageFiled from "../common/entryForm/CropImageFiled";
import { FormItemLayoutConf } from "../../constants/formConfig";
import { showErrorMessage } from "../../services/notifyService";
import Utils from "../../utils";
import { AppConstants, UploadFileTypes } from "../../constants";

class ProfileForm extends BasicForm {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.userData.avatar
        ? `${AppConstants.contentRootUrl}${props.userData.avatar}`
        : "",
      logo: props.userData.logoPath
        ? `${AppConstants.contentRootUrl}${props.userData.logoPath}`
        : "",
      avatarUploading: false,
    };
  }

  componentDidMount() {
    const { userData } = this.props;
    this.setFieldValue("avatar", userData.avatar);
    this.setFieldValue("logo", userData.logoPath);
  }

  handleConfirmPasswordBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToConfirmPassword = (rule, value) => {
    const {
      current: { validateFields, isFieldTouched },
    } = this.formRef;
    if (isFieldTouched("confirmPassword")) {
      validateFields(["confirmPassword"], { force: true });
    }
    return Promise.resolve();
  };

  compareToPassword = (rule, password) => {
    const newPassword = this.getFieldValue("password");
    if ((password || newPassword) && password !== newPassword) {
      return Promise.reject("Mật khẩu không khớp!");
    } else {
      return Promise.resolve();
    }
  };

  handleChangeAvatar = (info) => {
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (avatar) =>
        this.setState({ avatar })
      );
    }
  };

  uploadFileAvatar = (file, onSuccess) => {
    const { uploadFile } = this.props;
    this.setState({ avatarUploading: true });
    uploadFile({
      params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
      onCompleted: (result) => {
        this.setFieldValue("avatar", result.data.filePath);
        this.setState({ avatarUploading: false });
        onSuccess();
      },
      onError: (err) => {
        if (err && err.message) {
          showErrorMessage(err.message);
          this.setState({ avatarUploading: false });
        }
      },
    });
  };

  handleChangeLogo = (info) => {
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (logo) =>
        this.setState({ logo })
      );
    }
  };

  uploadFileLogo = (file, onSuccess) => {
    const { uploadFile } = this.props;
    this.setState({ logoUploading: true });
    uploadFile({
      params: { fileObjects: { file }, type: UploadFileTypes.LOGO },
      onCompleted: (result) => {
        this.setFieldValue("logo", result.data.filePath);
        // this.otherData.logo = result.data.filePath;
        this.setState({ logoUploading: false });
        onSuccess();
      },
      onError: (err) => {
        if (err && err.message) {
          showErrorMessage(err.message);
          this.setState({ logoUploading: false });
        }
      },
    });
  };

  render() {
    const { loading, userData } = this.props;
    const { avatar, avatarUploading } = this.state;

    return (
      <Form
        {...FormItemLayoutConf}
        ref={this.formRef}
        onFinish={this.handleSubmit}
        initialValues={userData}
      >
        <CropImageFiled
          fieldName="avatar"
          loading={avatarUploading}
          label="Ảnh đại diện"
          imageUrl={avatar}
          onChange={this.handleChangeAvatar}
          uploadFile={this.uploadFileAvatar}
        />
        <TextField fieldName="username" label="Tên đăng nhập" disabled required />
        <TextField
          fieldName="fullName"
          label="Họ và tên"
          required
          requiredMsg="Vui lòng nhập họ và tên"
        />
        <TextField
          type="password"
          fieldName="oldPassword"
          label="Mật khẩu cũ"
          required
          requiredMsg="Vui lòng nhập mật khẩu"
        />
        <TextField
          type="password"
          fieldName="password"
          label="Mật khẩu mới"
          validators={[this.validateToConfirmPassword]}
        />
        <TextField
          type="password"
          fieldName="confirmPassword"
          label="Xác nhận mật khẩu mới"
          validators={[this.compareToPassword]}
        />
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button
            loading={loading}
            className="profile-form-button"
            type="primary"
            htmlType="submit"
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ProfileForm;
