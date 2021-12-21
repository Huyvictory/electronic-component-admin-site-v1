import React from "react";
import { connect } from "react-redux";
import { Button, Avatar } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { AppConstants } from "../../constants";

import ListBasePage from "../ListBasePage";
import SettingForm from "../../compoments/settings/SettingForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";

class SettingsListPage extends ListBasePage {
  initialSearch() {
    return { key: "", group: ""};
  }

  constructor(props) {
    super(props);
    this.objectName = "cài đặt";
    this.breadcrumbs = [{ name: "Cài đặt" }];
    this.columns = [
      this.renderIdColumn(),
      { title: "Tên", dataIndex: "name" },
      {
        title: <div style={{paddingRight: "2vw"}}>Giá trị</div>,
        dataIndex: "value",
        render: (value) => (
            <div style={{paddingRight: "2vw"}}>{value.includes('/AVATAR/') ? <Avatar
            style={{width: "70px", height: "70px", 'margin-left': '0'}}
            className="table-avatar"
            size="large"
            icon={<SettingOutlined style={{ fontSize: '54px'}} />}
            src={value ? `${AppConstants.contentRootUrl}${value}` : null}
          /> : value}
            </div>
        )
      },
      { title: "Mô tả", dataIndex: "description"},
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: false,
      isChangeStatus: false,
    };
  }

  prepareCreateData(data) {
    const {description, name, editable, group, key, value} = data;
    return {
        description,  
        name,
        editable,
        settingValue: value,
        settingGroup: group,
        settingKey: key,
    }
  }

    prepareUpdateData(data) {
        const {description, name, group, key, value} = data;
        return {
            description,  
            name,
            settingValue: value,
            settingGroup: "Store Info::0",
            settingKey: name,
            id: this.dataDetail.id
        }
    }


  render() {
    const {
      dataList,
      loading,
      uploadFile,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const settings = dataList.data || [];
    this.pagination.total = dataList.totalElements || 0;

    return (
      <div>
        <div className="action-bar">
        </div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={settings}
          pagination={this.pagination}
          onChange={this.handleTableChange}
          className="base-table table-setting"
        />
        <BasicModal
          visible={isShowModifiedModal}
          isEditing={this.isEditing}
          objectName={this.objectName}
          loading={isShowModifiedLoading}
          onOk={this.onOkModal}
          onCancel={this.onCancelModal}
        >
          <SettingForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            uploadFile={uploadFile}
            loadingSave={isShowModifiedLoading}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.settings.tbSettingsLoading,
  dataList: state.settings.settingsData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getSettingsList(payload)),
  getDataById: (payload) => dispatch(actions.getSettingById(payload)),
  createData: (payload) => dispatch(actions.createSetting(payload)),
  updateData: (payload) => dispatch(actions.updateSetting(payload)),
  deleteData: (payload) => dispatch(actions.deleteSetting(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsListPage);
