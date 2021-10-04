import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import qs from 'query-string';

import ListBasePage from "../ListBasePage";
import CategoryForm from "../../compoments/category/CategoryForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { AppConstants } from "../../constants";
import { commonStatus, categoryKinds } from "../../constants/masterData";

const { CATEGORY_KIND_EXPORT } = categoryKinds;

class CategoryExportListPage extends ListBasePage {
    initialSearch() {
        return { name: "", status: null };
    }

    constructor(props) {
        super(props);
        const { t } = props;
        this.objectName =  "Danh mục chi";
        this.breadcrumbs = [
            { name: "Danh mục chi" },
        ];
        this.columns = [
        this.renderIdColumn(),
        {
            title: "#",
            dataIndex: "categoryImage",
            align: 'center',
            width: 100,
            render: (avatarPath) => (
            <Avatar
                className="table-avatar"
                size="large"
                icon={<UserOutlined />}
                src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
            />
            ),
        },
        {
            title: 'Tên',
            render: (dataRow) => {
                return (
                    <span className="routing" onClick={()=>{
                        this.handleRouting(dataRow.id, dataRow.categoryName,);
                    }}>
                        {dataRow.categoryName}
                    </span>
                )
            }
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

    handleRouting(parentId, parentName) {
        const { location: { search, pathname }, history } = this.props;
        const queryString = qs.parse(search);
        const result = {};
        Object.keys(queryString).map(q => {
            result[`parentSearch${q}`] = queryString[q];
        })
        history.push(`${pathname}-child?${qs.stringify({...result, parentId, parentName})}`);
    }

    prepareCreateData(data) {
        return {
            ...data,
            categoryKind: CATEGORY_KIND_EXPORT,
        };
    }

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, kind: CATEGORY_KIND_EXPORT};
        getDataList({ params });
    }

    getSearchFields() {
        return [
        {
            key: "name",
            seachPlaceholder: 'Tên',
            initialValue: this.search.name,
        },
        {
            key: "status",
            seachPlaceholder: "Chọn trạng thái",
            fieldType: FieldTypes.SELECT,
            options: commonStatus,
            initialValue: this.search.status,
        },
        ];
    }

    render() {
        const {
            dataList,
            loading,
            uploadFile,
        } = this.props;
        const { isShowModifiedModal, isShowModifiedLoading } = this.state;
        const categoryData = dataList.data || [];
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
            dataSource={categoryData}
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
  getDataList: (payload) => dispatch(actions.getCategoryList(payload)),
  getDataById: (payload) => dispatch(actions.getCategoryById(payload)),
  updateData: (payload) => dispatch(actions.updateCategory(payload)),
  deleteData: (payload) => dispatch(actions.deleteCategory(payload)),
  createData: (payload) => dispatch(actions.createCategory(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryExportListPage);
