import React from 'react';
import { actions } from '../../../actions';
import { connect } from "react-redux";
import { AppConstants } from '../../../constants';

import { Form } from 'antd';
import ReactQuill from 'react-quill'; // ES6

import BaseField from './BaseField';

import 'react-quill/dist/quill.snow.css'; // ES6
import { showErrorMessage } from "../../../services/notifyService";

import { LIMIT_IMAGE_SIZE, UploadFileTypes } from "../../../constants";

const AlignStyle = ReactQuill.Quill.import('attributors/style/align');
ReactQuill.Quill.register(AlignStyle, true);

function getLoader() {
    const div = document.createElement('div');
    div.className = 'loader-container';
    div.innerHTML = "<div class='loader'>Loading...</div>"
    return div;
}

const formats = [
    'header', 'font', 'size', 'color', 'background',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'align',
    'list', 'bullet', 'indent',
    'image',
]

class RichTextField extends BaseField {
    constructor(props) {
        super(props);
        this.modules = {
            toolbar: {
                container:[
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['image'],
                    ['clean'],
                ],
                handlers: {
                    // handlers object will be merged with default handlers object
                    'image': this.imageHandler
                }
            },
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            }
        };
    }

    imageHandler = () => {
        const { uploadFile, baseUrlImage, t } = this.props;
        const _this3 = this.quillRef.editor;
        let fileInput = _this3.container.querySelector('input.ql-image[type=file]');
        if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.addEventListener('change', function () {
            if (fileInput.files != null && fileInput.files[0] != null) {
                const size = fileInput.files[0].size;
                const file = fileInput.files[0];
                if(size < LIMIT_IMAGE_SIZE){
                    const loader = getLoader();
                    _this3.container.appendChild(loader);
                    _this3.container.classList.add('disabled');
                    _this3.container.firstChild.setAttribute("contenteditable", false);
                    uploadFile({
                        params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
                        others: baseUrlImage ? { path: baseUrlImage + '/v1/file/upload' } : null,
                        onCompleted: (result) => {
                            const index = _this3.getSelection(true).index;
                            if(baseUrlImage) {
                                _this3.insertEmbed(index, 'image', `${baseUrlImage + "/v1/file/download"}${result.data.filePath}`);
                            }
                            else {
                                _this3.insertEmbed(index, 'image', `${AppConstants.contentRootUrl}${result.data.filePath}`);
                            }
                            _this3.setSelection(index + 1);
                            fileInput.value = "";
                            _this3.container.removeChild(loader);
                            _this3.container.classList.remove('disabled');
                            _this3.container.firstChild.setAttribute("contenteditable", true);
                            _this3.container.firstChild.focus();
                        },
                        onError: (err) => {
                            if (err && err.message) {
                                showErrorMessage(err.message);
                            }
                            _this3.container.removeChild(loader);
                            _this3.container.classList.remove('disabled');
                            _this3.container.firstChild.setAttribute("contenteditable", true);
                            _this3.container.firstChild.focus();
                        },
                    })
                }
                else{
                    showErrorMessage("Hình phải có dung lượng nhỏ hơn 500KB. Vui lòng thử lại!");
                }
            }
        });
        _this3.container.appendChild(fileInput);
        }
        fileInput.click();
    }
    render() {
        const {
            label,
            disabled,
            fieldName,
            required,
        } = this.props;
        return (
            <Form.Item
            name={fieldName}
            label={label}
            rules={this.getRules()}
            initialValue=""
            >
                <ReactQuill
                    ref={(el) => this.quillRef = el}
                    formats={formats}
                    modules={this.modules}
                    readOnly={disabled}
                />

            </Form.Item>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect((state) => ({}), mapDispatchToProps)(RichTextField);
