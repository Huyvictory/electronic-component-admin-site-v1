import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Table } from "antd";
import { TableOutlined, PlusOutlined} from "@ant-design/icons";

import ListBasePage from "../ListBasePage";
import ProductForm from "../../compoments/product/ProductForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";
import qs from 'query-string';

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToLocalTime } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";
import {categoryKinds} from "../../constants/masterData";
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService';
import {sitePathConfig} from '../../constants/sitePathConfig';
import Utils from '../../utils/index'

const commonStatus = [
  { value: 1, label: 'Kích hoạt', color: 'green' },
  { value: 0, label: 'Khóa', color: 'red' },
]

class ProductListPage extends ListBasePage {
  initialSearch() {
    return { name: "", categoryId: undefined};
  }

  constructor(props) {
    super(props);
    const { t } = props;
    this.objectName =  "Sản phẩm";
    this.breadcrumbs = [{ name: "Sản phẩm" }];
    this.categoryId = undefined;
    this.search = this.initialSearch();
    this.dataDetail = {};
    this.columns = [
      this.renderIdColumn(),
      {
        title: "Ảnh sản phẩm",
        dataIndex: "productImage",
        align: 'center',
        width: 80,
        render: (avatarPath) => (
          <Avatar
            style={{width: "70px", height: "70px", padding: "8px"}}
            className="table-avatar"
            size="large"
            icon={<TableOutlined style={{ fontSize: '54px'}} />}
            src={avatarPath ? `${AppConstants.contentRootUrl}${avatarPath}` : null}
          />
        ),
      },
      { title: 'Tên sản phẩm', dataIndex: "productName", render: (productName, dataRow) => {
        return {
            props: {
                style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
            },
            children: (
                <span className="routing" onClick={()=>{
                    this.handleRouting(dataRow.id, dataRow.productName, dataRow.categoryId);
                }}>
                    {dataRow.productName}
                </span>
            ),
        }
    }},
      {
        title: <div>Giá sản phẩm</div>,
        dataIndex: "productPrice",
        align: "right",
        width: 120,
        render: (productPrice, dataRow) => {
          return {
            props: {
                style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
            },
            children: (
                <span className="tb-al-r force-one-line">{Utils.formatMoney(productPrice)}</span>
            ),
          }
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
    this.getCategoryType();
  }

  getSearchFields() {

    const {
      categoryList
    } = this.props

    const productCategoryList = categoryList.data || [];
    
    let CategoryList = [...productCategoryList];

    CategoryList = CategoryList.map((el) => {
      return {
        label: el.categoryName,
        value: el.id
      }
    })

    return [
      {
        key: "name",
        seachPlaceholder: 'Tên sản phẩm',
        initialValue: this.search.name,
      },
      {
        key: "categoryId",
        width: 250,
        seachPlaceholder: 'Chọn danh mục sản phẩm',
        fieldType: FieldTypes.SELECT,
        options: CategoryList,
        initialValue: this.search.categoryId,
      },
    ];
  }

  handleRouting(parentId, parentName, parentSearchcategoryId) {
    const { location: { search }, history } = this.props;
    const queryString = qs.parse(search);
    const result = {};
    Object.keys(queryString).map(q => {
        result[`parentSearch${q}`] = queryString[q];
    })
    history.push(`${sitePathConfig.product.path}-child?${qs.stringify({...result, parentId, parentName, parentSearchcategoryId})}`);
}

componentWillReceiveProps(nextProps) {
  if(nextProps.location.search !== this.props.location.search) {
      const { location: { search }, t } = nextProps;
      const {categoryId } = qs.parse(search);
      this.categoryId = categoryId;
      this.pagination = { pageSize: 100 };
      this.objectName =  "Sản phẩm";
      this.breadcrumbs = [
          { name: "Sản phẩm"}
      ];
      const { changeBreadcrumb } = nextProps;
      if(this.breadcrumbs.length > 0) {
          changeBreadcrumb(this.breadcrumbs);
      }
      this.loadDataTable(nextProps);
  }
}

  getList() {
    const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, categoryId: this.search.categoryId};
        getDataList({ params });
  }

  getCategoryType() {
    const {getCategoryType} = this.props;
    const page = this.pagination.current ? this.pagination.current - 1 : 0;
    const params = { page, size: this.pagination.pageSize, kind: categoryKinds.CATEGORY_KIND_PRODUCT};
    getCategoryType({params});
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
      ...data
    }
  }

  prepareUpdateData(data) {
    return {
      ...data,
      id: this.dataDetail.id
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

    const productCategoryList = categoryList.data || [];
    
    let CategoryList = [...productCategoryList];

    CategoryList = CategoryList.map((el) => {
      return {
        label: el.categoryName,
        value: el.id
      }
    })
    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const product = dataList.data || [];
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
          dataSource={product}
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
          <ProductForm
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
  loading: state.product.tbproductLoading,
  dataList: state.product.productData || {},
  categoryList: state.product.productCategoryType || {}
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getProductList(payload)),
  getCategoryType: (payload) => dispatch(actions.getCategoryType(payload)),
  getDataById: (payload) => dispatch(actions.getProductById(payload)),
  updateData: (payload) => dispatch(actions.updateProduct(payload)),
  deleteData: (payload) => dispatch(actions.deleteProduct(payload)),
  createData: (payload) => dispatch(actions.createProduct(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);
