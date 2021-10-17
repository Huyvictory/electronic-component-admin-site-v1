import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";

import ListBasePage from "../ListBasePage";
import CategoryForm from "../../compoments/category/CategoryForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToLocalTime } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";
import {categoryKinds} from "../../constants/masterData";
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService';

const commonStatus = [
  { value: 1, label: 'Kích hoạt', color: 'green' },
  { value: 0, label: 'Khóa', color: 'red' },
]

class ExportCategoryListPage extends ListBasePage {
  initialSearch() {
    return { name: ""};
  }

  constructor(props) {
    super(props);
    const { t } = props;
    this.objectName =  "Danh mục chi";
    this.breadcrumbs = [{ name: "Danh mục chi" }];
    this.search = this.initialSearch();
    this.dataDetail = {};
    this.columns = [
      this.renderIdColumn(),
      {
        title: "#",
        dataIndex: "categoryImage",
        align: 'center',
        width: 100,
        render: (avatarPath) => (
          <Avatar
            style={{width: "70px", height: "70px", padding: "8px"}}
            className="table-avatar"
            size="large"
            icon={<ExportOutlined />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
          />
        ),
      },
      { title: 'Tên danh mục', dataIndex: "categoryName", align: "center", width: -100},
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
        key: "name",
        seachPlaceholder: 'Tên danh mục chi',
        initialValue: this.search.name,
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

  getList() {
    const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, kind: categoryKinds.CATEGORY_KIND_EXPORT};
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

  prepareCreateData(data) {
    return {
      ...data,
      categoryKind: categoryKinds.CATEGORY_KIND_EXPORT,
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

export default connect(mapStateToProps, mapDispatchToProps)(ExportCategoryListPage);
