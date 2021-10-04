import React from 'react';

import { Form, Upload, Button } from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import BaseField from './BaseField';

class FileUploadField extends BaseField {
    
    uploadFile = ({file, onSuccess}) => {
        const { uploadFile } = this.props;
        if(uploadFile) {
            uploadFile(file, onSuccess);
        }
        else {
            setTimeout(() => {
                onSuccess("ok");
              }, 0);
        }
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
        } = this.props;

        return (
            <Form.Item
                label={label}
                name={fieldName}
                rules={this.getRules()}
                valuePropName={fieldName}
            >
                <Upload
                    fileList={fileList}
                    disabled={disabled}
                    accept={accept}
                    customRequest={this.uploadFile}
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                    showUploadList={true}
                >
                    <Button>
                        <UploadOutlined /> Nhấp để tải lên
                    </Button>
                    
                </Upload>
               
            </Form.Item>
        )
    }
}

export default FileUploadField;
