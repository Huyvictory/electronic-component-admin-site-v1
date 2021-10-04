import React from 'react';

import { Form, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

import BaseField from './BaseField';

class CropImageFiled extends BaseField {
    
    constructor(props) {
        super(props);
        this.getContent = this.getContent.bind(this);
    }

    uploadFile = ({file, onSuccess}) => {
        const { uploadFile } = this.props;
        uploadFile(file, onSuccess);
    }

    getContent() {
        const { showUploadList, fileList, maxFile, imageUrl, loading } = this.props;
        if(imageUrl && !loading) {
            return <img className="img-uploaded" src={imageUrl} alt="field-upload" />;
        }
        else if(showUploadList && fileList && fileList.length === maxFile) {
            return null;
        }
        else {
            return this.renderUploadButton();
        }
    }

    renderUploadButton() {
        const { loading, showUploadList, style } = this.props;
        return (
            <div style={style}>
                {!showUploadList && loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">{loading ? 'Đang tải lên' : 'Tải lên'}</div>
            </div>
        );
    }
    render() {
        const {
            label,
            fileList,
            disabled,
            fieldName,
            accept,
            onChange,
            beforeUpload,
            showUploadList,
            aspect
        } = this.props;
        const aspectValue = aspect || 1;
        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
                valuePropName={fieldName}
            >
                {
                    showUploadList
                    ?
                        <ImgCrop aspect={aspectValue}>
                            <Upload
                                fileList={fileList}
                                disabled={disabled}
                                accept={accept}
                                name="field-upload"
                                listType="picture-card"
                                className="avatar-uploader"
                                customRequest={this.uploadFile}
                                beforeUpload={beforeUpload}
                                onChange={onChange}
                            >
                                {this.getContent()}
                            </Upload>
                        </ImgCrop>
                    :
                        <ImgCrop aspect={aspectValue}>
                            <Upload
                                disabled={disabled}
                                accept={accept}
                                valuePropName={fieldName}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                customRequest={this.uploadFile}
                                beforeUpload={beforeUpload}
                                onChange={onChange}
                            >
                                {this.getContent()}
                            </Upload>
                        </ImgCrop>
                }
                
               
            </Form.Item>
        )
    }
}

export default CropImageFiled;
