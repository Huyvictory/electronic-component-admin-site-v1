import React, {Component} from 'react';
import { Button, Modal } from 'antd';

class BasicModal extends Component {

    getTitle() {
        const { hiddenTile, title, isEditing, objectName } = this.props;
        if(hiddenTile)
            return null;
        else if(title) {
            return title;
        }
        const name = objectName || '';
        return isEditing ? `CẬP NHẬT ${name.toUpperCase()}` : `THÊM ${name.toUpperCase()} MỚI`;
    }

    render() {
        const { visible, onOk, onCancel, loading, children, objectName, width, top, formId, bodyStyle, maskClosable, additionalButton, className } = this.props;
        const formSubmitId = formId || `form-${objectName}`;
        let footerComponent = [<Button className="modal-btn-close" key="back" onClick={onCancel}>Đóng</Button>];
        if(onOk) {
            footerComponent.push(
                <Button className="modal-btn-save" key="submit" htmlType="submit" type="primary" loading={loading} form={formSubmitId}>
                    Lưu
                </Button>
            )
        }
        if(additionalButton) {
            footerComponent.push(
                additionalButton
            )
        }
        return (
            <Modal
                maskClosable={!!maskClosable}
                className={className}
                bodyStyle={bodyStyle || { maxHeight: '84vh', overflow: 'auto'}}
                destroyOnClose // rerender child component when modal close
                style={{ top: top || 40 }}
                width={width || 800}
                visible={visible}
                title={this.getTitle()}
                onOk={onOk}
                onCancel={onCancel}
                footer={footerComponent}
                >
                    {React.cloneElement(children, {
                        formId: formSubmitId,
                        onSubmit: onOk
                    })}
            </Modal>
        )
    }
}

export default BasicModal;
