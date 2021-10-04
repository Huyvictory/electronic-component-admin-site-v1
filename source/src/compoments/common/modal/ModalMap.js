import React  from 'react';
import { Modal } from 'antd';
import BasicModal from './BasicModal';

class ModalMap extends BasicModal {

    render() {
        const { visible, onOk, onCancel, children, objectName, width, top, formId, bodyStyle, maskClosable, loading } = this.props;
        const formSubmitId = formId || `form-${objectName}`;
        return (
            <Modal
                maskClosable={!!maskClosable}
                bodyStyle={bodyStyle || { maxHeight: '84vh', overflow: 'auto'}}
                destroyOnClose // rerender child component when modal close
                style={{ top: top || 40 }}
                width={width || 800}
                visible={visible}
                title={this.getTitle()}
                onOk={onOk}
                onCancel={onCancel}
                footer={null}
                loading={loading}
                >
                    {React.cloneElement(children, {
                        formId: formSubmitId,
                        onSubmit: onOk
                    })}
            </Modal>
        )
    }
}

export default ModalMap;
