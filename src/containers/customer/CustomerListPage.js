import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Divider } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, CheckOutlined, HomeOutlined } from "@ant-design/icons";
import qs from 'query-string';

import ListBasePage from "../ListBasePage";
import CustomerForm from "../../compoments/customer/CustomerForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";
import ElementWithPermission from '../../compoments/common/elements/ElementWithPermission';

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToLocalTime } from "../../utils/datetimeHelper";
import { AppConstants, STATUS_ACTIVE } from "../../constants";
import { sitePathConfig } from "../../constants/sitePathConfig";

const commonStatus = [
  { value: 1, label: 'Kích hoạt', color: 'green' },
  { value: 0, label: 'Khóa', color: 'red' },
]

class CustomerListPage extends ListBasePage {
  initialSearch() {
    return { fullName: "", phone: "" };
  }

  constructor(props) {
    super(props);
    // const { t } = props;
    this.objectName =  "Khách hàng";
    this.breadcrumbs = [{ name: "Khách hàng" }];
    this.columns = [
      this.renderIdColumn(),
      {
        title: "#",
        dataIndex: "customerAvatarPath",
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
      isAddress: true,
    };
  }

  handleRouting(parentId, parentName, parentPhone) {
    const { location: { search }, history } = this.props;
    const queryString = qs.parse(search);
    const result = {};
    Object.keys(queryString).map(q => {
        result[`parentSearch${q}`] = queryString[q];
    })
    history.push(`${sitePathConfig.wrapperCustomerPreferences.path}?${qs.stringify({...result, parentId, parentName, parentPhone})}`);
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

  renderHomeButton(children){
    const { location : { pathname }} = this.props;
    const requiredPermissions = [];
    
    requiredPermissions.push(sitePathConfig.orders.permissions[0])
    requiredPermissions.push(sitePathConfig.address.permissions[0])
    return (<ElementWithPermission permissions={requiredPermissions}>
        {children}
    </ElementWithPermission>)
}

  renderActionColumn() {
    return {
        title: 'Hành động',
        width: '100px',
        align: 'center',
        render: (dataRow) => {
            const actionColumns = [];

            if(this.actionColumns.isAddress)
            {
              actionColumns.push(this.renderHomeButton((
                  <Button type="link" onClick={() => this.handleRouting(dataRow.id, dataRow.customerFullName, dataRow.customerPhone) } className="no-padding">
                        <HomeOutlined/>
                    </Button>
                )))
            }
            if(this.actionColumns.isEdit) {
                actionColumns.push(this.renderEditButton((
                    <Button type="link" onClick={() => this.getDetail(dataRow.id)} className="no-padding">
                        <EditOutlined/>
                    </Button>
                )))
            }
            if(this.actionColumns.isChangeStatus) {
                actionColumns.push(
                    <Button type="link" onClick={() => this.showChangeStatusConfirm(dataRow) } className="no-padding">
                        {
                            dataRow.status === STATUS_ACTIVE
                            ?
                            <LockOutlined/>
                            :
                            <CheckOutlined/>
                        }
                    </Button>
                )
            }
            if(this.actionColumns.isDelete) {
                actionColumns.push(
                    this.renderDeleteButton((
                        <Button type="link" onClick={() => this.showDeleteConfirm(dataRow.id) } className="no-padding">
                            <DeleteOutlined/>
                        </Button>
                    ))
                )
            }
            const actionColumnsWithDivider = [];
            actionColumns.forEach((action, index) => {
                actionColumnsWithDivider.push(action);
                if(index !== (actionColumns.length -1))
                {
                    actionColumnsWithDivider.push(<Divider type="vertical" />);
                }
            })
            return (
                <span>
                    {
                        actionColumnsWithDivider.map((action, index) => <span key={index}>{action}</span>)
                    }
                </span>
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
              <PlusOutlined />Thêm mới
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerListPage);
