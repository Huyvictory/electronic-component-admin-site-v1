import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

import ListBasePage from "../ListBasePage";
import CategoryForm from "../../compoments/category/CategoryForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToLocalTime } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";

const commonStatus = [
  { value: 1, label: 'Kích hoạt', color: 'green' },
  { value: 0, label: 'Khóa', color: 'red' },
]

class CategoryListPage extends ListBasePage {
  initialSearch() {
    return { fullName: "", phone: "" };
  }

  constructor(props) {
    super(props);
    const { t } = props;
    this.objectName =  "Category";
    this.breadcrumbs = [{ name: "Category" }];
    this.columns = [
      this.renderIdColumn(),
      {
        title: "#",
        dataIndex: "categoryAvatarPath",
        align: 'center',
        width: 100,
        render: (avatarPath) => (
          <Avatar
            style={{width: "70px", height: "70px", padding: "8px"}}
            className="table-avatar"
            size="large"
            icon={<UserOutlined />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
          />
        ),
      },
      { title: 'Tên tài khoản', dataIndex: "customerUsername" },
      { title: 'Họ và tên', dataIndex: "customerFullName" },
      { title: 'Số điện thoại', dataIndex: "customerPhone", width: 120 },
      { title: 'E-mail', dataIndex: "customerEmail", width: "200px" },
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

  getSearchFields() {
    return [
      {
        key: "fullName",
        seachPlaceholder: 'Họ và tên',
        initialValue: this.search.fullName,
      },
      {
        key: "phone",
        seachPlaceholder: 'Số điện thoại',
        initialValue: this.search.phone,
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

  renderStatusColumn() {
    return {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: '100px',
        render: (status) => {
          const statusItem = commonStatus.find(s=>s.value === status);
          return (
            <Tag className="tag-status" color={statusItem?.color}>
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
              <PlusOutlined /> Thêm mới
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
          <CategoryForm
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
  getDataList: (payload) => dispatch(actions.getCategoriesList(payload)),
  getDataById: (payload) => dispatch(actions.getCategoryById(payload)),
  updateData: (payload) => dispatch(actions.updateCategory(payload)),
  deleteData: (payload) => dispatch(actions.deleteCategory(payload)),
  createData: (payload) => dispatch(actions.createCategory(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryListPage);
