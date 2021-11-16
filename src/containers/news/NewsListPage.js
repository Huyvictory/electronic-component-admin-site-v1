import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";

import ListBasePage from "../ListBasePage";
import NewsForm from "../../compoments/news/NewsForm";
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

class NewsListPage extends ListBasePage {
  initialSearch() {
    return { name: "", categoryId: undefined};
  }

  constructor(props) {
    super(props);
    const { t } = props;
    this.objectName =  "Tin tức";
    this.breadcrumbs = [{ name: "Tin tức" }];
    this.search = this.initialSearch();
    this.dataDetail = {};
    this.columns = [
      this.renderIdColumn(),
      {
        title: "Hình ảnh",
        dataIndex: "avatar",
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
      { title: 'Tiêu đề', dataIndex: "title"},
      
      this.renderStatusColumn(),
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
      isChangeStatus: false,
    };
    this.getCategoryTypeNews();
  }

  getSearchFields() {

    const {
      categoryList
    } = this.props

    console.log(this.props);

    const newsCategoryList = categoryList.data || [];
    
    let CategoryList = [...newsCategoryList];

    CategoryList = CategoryList.map((el) => {
      return {
        label: el.categoryName,
        value: el.id
      }
    })

    console.log(CategoryList);

    return [
      {
        key: "title",
        seachPlaceholder: 'Tiêu đề',
        initialValue: this.search.name,
      },
      {
        key: "categoryId",
        width: 250,
        seachPlaceholder: 'Chọn danh mục tin tức',
        fieldType: FieldTypes.SELECT,
        options: CategoryList,
        initialValue: this.search.categoryId,
      },
    ];
  }

  getList() {
    const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, categoryId: this.search.categoryId};
        getDataList({ params });
  }

  getCategoryTypeNews() {
    const {getCategoryTypeNews} = this.props;
    const page = this.pagination.current ? this.pagination.current - 1 : 0;
    const params = { page, size: this.pagination.pageSize, kind: categoryKinds.CATEGORY_KIND_NEWS};
    getCategoryTypeNews({params});
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
      kind: 1,
      pinTop: 0,
      status: 0,
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
      categoryList
    } = this.props;
    const newsCategoryList = categoryList.data || [];
    
    let CategoryList = [...newsCategoryList];

    CategoryList = CategoryList.map((el) => {
      return {
        label: el.categoryName,
        value: el.id
      }
    })
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const news = dataList.data || [];
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
          dataSource={news}
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
          <NewsForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? this.dataDetail : {}}
            uploadFile={uploadFile}
            commonStatus={commonStatus}
            loadingSave={isShowModifiedLoading}
            categoryTypes={CategoryList}

          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.news.tbnewsLoading,
  dataList: state.news.newsData || {},
  categoryList: state.news.newsCategoryType || {}
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getNewsList(payload)),
  getCategoryTypeNews: (payload) => dispatch(actions.getCategoryTypeNews(payload)),
  getDataById: (payload) => dispatch(actions.getNewsById(payload)),
  updateData: (payload) => dispatch(actions.updateNews(payload)),
  deleteData: (payload) => dispatch(actions.deleteNews(payload)),
  createData: (payload) => dispatch(actions.createNews(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsListPage);
