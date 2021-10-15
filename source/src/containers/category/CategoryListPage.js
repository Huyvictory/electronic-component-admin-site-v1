import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
// import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import CustomerForm from "../../compoments/category/CategoryForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";
import { commonStatus, CustomerLoyaltyLevelColorConfig } from "../../constants/masterData";

class CategoryListPage extends ListBasePage {
  initialSearch() {
    return { name: "", kind: "" };
  }

  

  constructor(props) {
    super(props);
    this.objectName = "Danh mục";
    this.breadcrumbs = [{ name: "Danh mục" }];
    this.columns = [
      this.renderIdColumn(),
      {
        title: "Hình ảnh",
        dataIndex: "categoryImage",
        align: 'center',
        width: 100,
        render: (avatarPath) => (
          <Avatar
            className="category-avatar"
            style = {{width: '70px', height: '70px', padding: '15px'}}
            size="large"
            icon={<UserOutlined />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
          />
        ),
      },      
      { title: 'Tên', dataIndex: "categoryName" },
      { title: 'Loại', dataIndex: "categoryKind" },
      { title: 'Mô tả', dataIndex: "categoryDescription" },

      this.renderStatusColumn(),
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
      isChangeStatus: false,
    };
  }

  getSearchFields() {
    return [
      {
        key: "name",
        seachPlaceholder: 'Tên',
        initialValue: this.search.name,
      },
      {
        key: "kind",
        seachPlaceholder:  'Loại',
        initialValue: this.search.kind,
        // initialValue: this.search.phone,

      },
      // {
      //   key: "status",
      //   seachPlaceholder: t('searchPlaceHolder.status'),
      //   fieldType: FieldTypes.SELECT,
      //   options: commonStatus,
      //   initialValue: this.search.status,
      // },
    ];
  }
  renderStatusColumn(){
    return {
      title: 'Status',
      dataIndex: 'status',
      width: '100px',
      render: (status) =>{
        const statusItem= commonStatus.find(s=>s.value === status);
        return (
          <Tag className='tag-status' color = {statusItem.color}>
            {statusItem.label}
          </Tag>
        )
      }
    }
  }
  render() {
    const {
      dataList,
      loading,
      uploadFile,
    } = this.props;
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const customer = dataList.data || [];
    this.pagination.total = dataList.totalElements || 0;
    return (
      <div>
        {this.renderSearchForm()}
        <div className="action-bar">
          {
            this.renderCreateNewButton((
              <Button
              type="primary"
              onClick={() => this.onShowModifiedModal(false)}
            >
              <PlusOutlined /> {"Thêm mới"}
              {/* {t("createNewButton")} */}
            </Button>
            ))
          }
        </div>
        <BaseTable
          loading={loading}
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={customer}
          pagination={this.pagination}
          onChange={this.handleTableChange}
        />
        <BasicModal
          visible={isShowModifiedModal}
          isEditing={this.isEditing}
          objectName={this.objectName}
          loading={isShowModifiedLoading}
          onOk={this.onOkModal}
          onCancel={this.onCancelModal}
        >
          <CustomerForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            uploadFile={uploadFile}
            commonStatus={commonStatus}
            loadingSave={isShowModifiedLoading}
            customerLoyaltyLevel={this.customerLoyaltyLevel}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.customer.tbCustomerLoading,
  dataList: state.customer.customerData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getCustomerList(payload)),
  getDataById: (payload) => dispatch(actions.getCustomerById(payload)),
  updateData: (payload) => dispatch(actions.updateCustomer(payload)),
  deleteData: (payload) => dispatch(actions.deleteCustomer(payload)),
  createData: (payload) => dispatch(actions.createCustomer(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryListPage);