import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
// import { withTranslation } from "react-i18next";

import ListBasePage from "../ListBasePage";
import NewsCategoryForm from "../../compoments/category/NewsCategoryForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToLocalTime } from "../../utils/datetimeHelper";
import { AppConstants, CategoryKinds } from "../../constants";
import { categoryKinds, commonStatus, CustomerLoyaltyLevelColorConfig } from "../../constants/masterData";
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService';

// const commonStatus = [
//   { value: 1, label: 'Kích hoạt', color: 'green' },
//   { value: 0, label: 'Khóa', color: 'red' },
// ]

class NewsCategoryListPage extends ListBasePage {
  initialSearch() {
    return { name: "", kind: "" };
  }  


  constructor(props) {
    super(props);
    this.objectName = "Danh mục";
    this.breadcrumbs = [{ name: "Danh mục" }];
    this.search = this.initialSearch();
    this.dataDetail = {};
    this.columns = [
      this.renderIdColumn(),
      {
        title: "Hình ảnh",
        dataIndex: "categoryImage",
        align: 'center',
        width: 100,
        render: (avatarPath) => (
          <Avatar
            className="table-avatar"
            style = {{width: '70px', height: '70px', padding: '15px'}}
            size="large"
            icon={<UserOutlined />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
          />
        ),
      },      
      { title: 'Tên', dataIndex: "categoryName" },
      // { title: 'Loại', dataIndex: "categoryKind" },
      // { title: 'Mô tả', dataIndex: "categoryDescription" },
      {
        title: <div style={{ paddingRight: 20 }}>Ngày tạo</div>,
        dataIndex: "createdDate",
        align: "right",
        width: 120,
        render: (createdDate) => <div style={{ paddingRight: 20 }}>{convertUtcToLocalTime(createdDate, "DD/MM/YYYY")}</div>,
      },
      this.renderStatusColumn(),
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
      isChangeStatus: false,
    };
  }

  prepareCreateData(data){
    return {
      ...data,
      categoryKind: 4,
      categoryOrdering: 0,
    }
  }
  prepareUpdateData(data) {
    return {
      ...data,
      categoryOrdering: 0,
      id: this.dataDetail.id,
      status: 1
    }
  }
  getList() {
    const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, kind: 4};
        getDataList({ params });
  }
  getDetail(id) {
    const { getDataById, showFullScreenLoading, hideFullScreenLoading } = this.props;
    const params = { id };
    showFullScreenLoading();
    getDataById({
        params,
        onCompleted: ({data}) => {
            this.dataDetail = this.getDataDetailMapping(data);
            this.onShowModifiedModal(true);
            hideFullScreenLoading();
        },
        onError: (err) => {
            if(err && err.message)
                showErrorMessage(err.message);
            else
                showErrorMessage(`${this.getActionName()} ${this.objectName} thất bại. Vui lòng thử lại!`);
            hideFullScreenLoading();
        }
    });
}
  getSearchFields() {
    return [
      {
        key: "name",
        seachPlaceholder: 'Tên',
        initialValue: this.search.name,
      },
      // {
      //   key: "kind",
      //   seachPlaceholder:  'Loại',
      //   initialValue: this.search.kind,
      //   // initialValue: this.search.phone,

      // },
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
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '100px',
      render: (status) =>{
        const statusItem= commonStatus.find(s=>s.value === status);
        return (
          <Tag className='tag-status' color = {statusItem.color}>
            {statusItem?.label}
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
    const category = dataList.data || [];
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
          dataSource={category}
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
          <NewsCategoryForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            uploadFile={uploadFile}
            commonStatus={commonStatus}
            loadingSave={isShowModifiedLoading}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.category.tbCategoryLoading,
  dataList: state.category.categoryData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getCategoryList(payload)),
  getDataById: (payload) => dispatch(actions.getCategoryById(payload)),
  updateData: (payload) => dispatch(actions.updateCategory(payload)),
  deleteData: (payload) => dispatch(actions.deleteCategory(payload)),
  createData: (payload) => dispatch(actions.createCategory(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsCategoryListPage);