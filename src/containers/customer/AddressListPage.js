import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import qs from 'query-string';

import ListBasePage from "../ListBasePage";
import AddressForm from "../../compoments/address/AddressForm";
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";

import { actions } from "../../actions";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToTimezone } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";
import { commonStatus, AddressLoyaltyLevelColorConfig } from "../../constants/masterData";
import { sitePathConfig } from "../../constants/sitePathConfig";
import ElementWithPermission from "../../compoments/common/elements/ElementWithPermission";

class AddressListPage extends ListBasePage {
    initialSearch() {
        return { name: "", phone: "" };
    }

    constructor(props) {
        super(props);
        this.objectName = 'Địa chỉ';
        const { location: { search } } = props;
        const {
            parentName,
            parentId,
            parentPhone,
        } = qs.parse(search);
        this.parentId = parentId;
        this.parentName = parentName;
        this.parentPhone = parentPhone;
        this.breadcrumbs = [
            {
                name: `Khách hàng (${parentName})`,
                path: `${sitePathConfig.customer.path}${this.handleRoutingParent('parentSearch')}`,
            },
            {
                name: 'Địa chỉ'
            },
        ];
        this.columns = [
            this.renderIdColumn(),
            { title: 'Họ và tên', dataIndex: "name" },
            { title: 'Số điện thoại', dataIndex: "phone", width: 120 },
            { title: 'Địa chỉ', dataIndex: "address" },
            { title: 'Xã phường', dataIndex: ["communeDto", "provinceName"] },
            { title: 'Quận huyện', dataIndex: ["districtDto", "provinceName"] },
            { title: 'Tỉnh/thành phố', dataIndex: ["provinceDto", "provinceName"] },
            this.renderStatusColumn(),
            this.renderActionColumn(),
        ];
        this.actionColumns = {
            isEdit: true,
            isDelete: true,
            isChangeStatus: false,
        };
    }

    prepareCreateData(data) {
        // Filter null or undefinded properties
        return Object.entries({
            ...data,
            customerId: this.parentId,
        }).reduce((accumulate, [key, value]) => (
            value === null || value === undefined || value === "" ? accumulate : (accumulate[key] = value, accumulate)),
            {}
        );
    }

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = {
            page,
            size: this.pagination.pageSize,
            search: this.search,
            customerId: this.parentId,
        };
        getDataList({ params });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.search !== this.props.location.search) {
            this.loadDataTable(nextProps);
        }
        if(nextProps.keyTab !== this.props.keyTab) {
            if(this.breadcrumbs.length > 0) {
                this.props.changeBreadcrumb(this.breadcrumbs);
            }
        }
    }

    handleRoutingParent(prName) {
        const { location: { search } } = this.props;
        const queryString = qs.parse(search);
        const result = {};
        Object.keys(queryString).map(q => {
            if(q.startsWith(prName))
                result[q.substring(prName.length, q.length)] = queryString[q];
        })
        const qsMark = Object.keys(result).length > 0 ? "?" : "";
        return qsMark + qs.stringify(result);
    }

    getSearchFields() {
        return [
        {
            key: "name",
            seachPlaceholder: 'Họ và tên',
            initialValue: this.search.name,
        },
        {
            key: "phone",
            seachPlaceholder:  'Số điện thoại',
            initialValue: this.search.phone,
        },
        ];
    }

    renderEditButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [
            sitePathConfig.address.permissions[1],
            sitePathConfig.address.permissions[3],
        ];
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    renderCreateNewButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [
            sitePathConfig.address.permissions[2],
        ];
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    renderDeleteButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [
            sitePathConfig.address.permissions[4],
        ];
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    render() {
        const {
            dataList,
            loading,
            provinceComboboxList,
            districtComboboxList,
            communeComboboxList,
            getProvinceComboboxList,
            getDistrictComboboxList,
            getCommuneComboboxList,
        } = this.props;
        const { isShowModifiedModal, isShowModifiedLoading } = this.state;
        const address = dataList.data || [];
        this.pagination.total = dataList.totalElements || 0;
        return (
        <div>
            { this.renderSearchForm() }
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
            dataSource={address}
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
            <AddressForm
                isEditing={this.isEditing}
                dataDetail={this.isEditing ? this.dataDetail : {}}
                loadingSave={isShowModifiedLoading}
                customerPhone={this.parentPhone}
                customerName={this.parentName}
                provinceComboboxList={provinceComboboxList?.data || []}
                districtComboboxList={districtComboboxList?.data || []}
                communeComboboxList={communeComboboxList?.data || []}
                getProvinceComboboxList={getProvinceComboboxList}
                getDistrictComboboxList={getDistrictComboboxList}
                getCommuneComboboxList={getCommuneComboboxList}
            />
            </BasicModal>
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.address.tbAddressLoading,
    dataList: state.address.addressData || {},
    provinceComboboxList: state.province.provinceComboboxList || {},
    districtComboboxList: state.province.districtComboboxList || {},
    communeComboboxList: state.province.communeComboboxList || {},
});

const mapDispatchToProps = (dispatch) => ({
    getDataList: (payload) => dispatch(actions.getAddressList(payload)),
    getDataById: (payload) => dispatch(actions.getAddressById(payload)),
    updateData: (payload) => dispatch(actions.updateAddress(payload)),
    deleteData: (payload) => dispatch(actions.deleteAddress(payload)),
    createData: (payload) => dispatch(actions.createAddress(payload)),
    getProvinceComboboxList: (payload) => dispatch(actions.getProvinceComboboxList(payload)),
    getDistrictComboboxList: (payload) => dispatch(actions.getDistrictComboboxList(payload)),
    getCommuneComboboxList: (payload) => dispatch(actions.getCommuneComboboxList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressListPage);