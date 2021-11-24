import React, {Component} from 'react';

import { Modal, Divider, Button } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    LockOutlined,
    PictureOutlined,
    CheckOutlined } from '@ant-design/icons';
import qs from 'query-string';

import SearchForm from '../compoments/common/entryForm/SearchForm';
import StatusTag from '../compoments/common/elements/StatusTag';

import { showErrorMessage, showSucsessMessage } from '../services/notifyService';
import { DEFAULT_TABLE_ITEM_SIZE, STATUS_ACTIVE, STATUS_LOCK } from '../constants';
import ElementWithPermission from '../compoments/common/elements/ElementWithPermission';

import { sitePathConfig } from '../constants/sitePathConfig';

import { actions } from '../actions';
import { categoryKinds } from '../constants/masterData';

const { getUserData } = actions;

const { confirm } = Modal;

class ListBasePage extends Component {

    initialSearch() {
        return {};
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowModifiedModal: false,
            isShowModifiedLoading: false
        }

        this.objectName = '';
        this.isEditing = false;
        this.dataDetail = {};
        this.breadcrumbs = [];
        this.columns = [];
        this.pagination = { pageSize: DEFAULT_TABLE_ITEM_SIZE };
        this.search = this.initialSearch();
        this.actionColumns = {
            isEdit: true,
            isDelete: false,
            isChangeStatus: true
        }
        this.userData = getUserData();
        this.getList = this.getList.bind(this);
        this.loadDataTable = this.loadDataTable.bind(this);
        this.getDetail = this.getDetail.bind(this);

        this.renderIdColumn = this.renderIdColumn.bind(this);
        this.renderActionColumn = this.renderActionColumn.bind(this);
        this.renderSearchForm = this.renderSearchForm.bind(this);
        this.renderImageColumn = this.renderImageColumn.bind(this);

        this.onOkModal = this.onOkModal.bind(this);
        this.onCancelModal = this.onCancelModal.bind(this);
        this.onModifyCompleted = this.onModifyCompleted.bind(this);
        this.onModifyError = this.onModifyError.bind(this);

        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onResetFormSearch = this.onResetFormSearch.bind(this);
        this.setQueryString = this.setQueryString.bind(this);
        this.onDeleteCompleted = this.onDeleteCompleted.bind(this);
        this.onDeleteError = this.onDeleteError.bind(this);
        this.onChangeStatusCompleted = this.onChangeStatusCompleted.bind(this);
        this.onChangeStatusError = this.onChangeStatusError.bind(this);

        this.handleTableChange = this.handleTableChange.bind(this);
        this.onShowModifiedModal = this.onShowModifiedModal.bind(this);
    }

    componentWillMount() {
        const { changeBreadcrumb } = this.props;
        if(this.breadcrumbs.length > 0) {
            changeBreadcrumb(this.breadcrumbs);
        }
        this.userData = getUserData();
        if(this.checkPermission())
            this.loadDataTable(this.props);
    }

    checkPermission(){
        const { location: { pathname } } = this.props;
        return !!Object.keys(sitePathConfig).find(key => {
            if(sitePathConfig[key].path === pathname || pathname.indexOf(sitePathConfig[key].path) === 0) {
                if(sitePathConfig[key].permissions && this.userData.permissions.indexOf(sitePathConfig[key].permissions[0]) < 0) {
                    return false;
                }
                else return true;
            }
            return false;
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.search !== this.props.location.search) {
            this.loadDataTable(nextProps);
        }
    }

    loadDataTable(currentProps) {
        const queryString = qs.parse(currentProps.location.search);
        this.pagination.current = 1;
        if(!isNaN(queryString.page))
            this.pagination.current = parseInt(queryString.page);
        Object.keys(this.search).forEach(key => this.search[key] = queryString[key]);
        this.getList();
    }

    handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.setQueryString();
    }

    getList() {
        const { getDataList } = this.props;
        const page = this.pagination.current ? this.pagination.current - 1 : 0;
        const params = { page, size: this.pagination.pageSize, search: this.search, kind: categoryKinds.CATEGORY_KIND_NEWS};
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
        return [];
    }

    onShowModifiedModal(isEditing) {
        this.isEditing = isEditing;
        this.setState({ isShowModifiedModal: true });
    }

    getDataDetailMapping(data) {
        return data;
    }

    prepareCreateData(data) {
        return data;
    }

    prepareUpdateData(data) {
        return {
            ...data,
            id: this.dataDetail.id
        };
    }

    getActionName() {
        return this.isEditing ? 'Cập nhật' : 'Tạo mới';
    }

    onModifyCompleted(responseData) {
        if(responseData) {
            this.onCancelModal();
            this.getList();
            showSucsessMessage(`${this.getActionName()} ${this.objectName} thành công!`);
        }
        else {
            this.setState({ isShowModifiedLoading: false });
            showErrorMessage(`${this.getActionName()} ${this.objectName} thất bại. Vui lòng thử lại!`);
        }
    }

    onModifyError(err) {
        this.setState({ isShowModifiedLoading: false });
        if(err && err.message)
            showErrorMessage(err.message);
        else
            showErrorMessage(`${this.getActionName()} ${this.objectName} thất bại. Vui lòng thử lại!`);
    }

    onChangeStatusCompleted(status) {
        const  action = status === STATUS_ACTIVE ? 'Hoạt động' : 'Khóa';
        this.getList();
        showSucsessMessage(`${action} ${this.objectName} thành công!`);
    }

    onChangeStatusError(status, err) {
        const  action = status === STATUS_ACTIVE ? 'Hoạt động' : 'Khóa';
        if(err)
            showErrorMessage(err.message);
        else
            showErrorMessage(`${action} ${this.objectName} thất bại. Vui lòng thử lại!`);
    }

    onDeleteCompleted() {
        const { dataList } = this.props;
        if(dataList && this.pagination.current > 1 && dataList.content && dataList.content.length === 1) {
            this.pagination.current = this.pagination.current - 1;
            this.setQueryString();
        }
        else {
            this.getList();
        }
        
        showSucsessMessage(`Xóa ${this.objectName} thành công!`);
    }

    onDeleteError() {
        showErrorMessage(`Xóa ${this.objectName} thất bại. Vui lòng thử lại!`);
    }

    onOkModal(values) {
        const { createData, updateData } = this.props;
        this.setState({ isShowModifiedLoading: true });
        if(this.isEditing) {
            updateData({
                params: this.prepareUpdateData(values),
                onCompleted: this.onModifyCompleted,
                onError: this.onModifyError
            });
        }
        else {
            createData({
                params: this.prepareCreateData(values),
                onCompleted: this.onModifyCompleted,
                onError: this.onModifyError
            });
        }
    }

    onChangeStatus(data) {
        const { updateStatus } = this.props;
        if(data.id) {
            const status = data.status === STATUS_ACTIVE ? STATUS_LOCK : STATUS_ACTIVE;
            updateStatus({
                params: { id: data.id, status },
                onCompleted: () => this.onChangeStatusCompleted(status),
                onError: (err) => this.onChangeStatusError(status, err)
            });
        }
    }

    onDelete(id) {
        const { deleteData } = this.props;
        if(id) {
            deleteData({
                params: { id },
                onCompleted: this.onDeleteCompleted,
                onError: this.onDeleteError
            });
        }
    }

    setQueryString() {
        const { location: { pathname, search }, history } = this.props;
        const queryString = qs.parse(search);
        let newQsValue = {};
        if(this.pagination.current > 1) {
            newQsValue.page = this.pagination.current;
        }
        else  {
            delete queryString.page;
        }
        newQsValue = Object.assign(queryString, newQsValue, this.search);
        
        if(Object.keys(newQsValue).length > 0)
        {
            Object.keys(newQsValue).forEach(key => {
                if(!newQsValue[key])
                    delete newQsValue[key];
             });
            
        }

        if(Object.keys(newQsValue).length > 0)
            history.push(`${pathname}?${qs.stringify(newQsValue)}`);            
        else
            history.push(pathname);
    }

    onSearch(values) {
        this.search = values;
        this.pagination.current = 1;
        this.setQueryString();
    }

    onResetFormSearch() {
        this.search = this.initialSearch();
        this.pagination.current = 1;
        this.setQueryString();
    }

    onCancelModal() {
        this.setState({ isShowModifiedModal: false, isShowModifiedLoading: false });
    }

    showChangeStatusConfirm(data) {
        const  action = data.status === STATUS_ACTIVE ? 'khóa' : 'kích hoạt';
        confirm({
          title: `Bạn có chắc ${action} ${this.objectName} này?`,
          content: '',
          okText: 'Có',
          okType: 'danger',
          cancelText: 'Không',
          onOk: () => {
            this.onChangeStatus(data);
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
    }

    showDeleteConfirm(id) {
        confirm({
          title: `Bạn có chắc xóa ${this.objectName} này?`,
          content: '',
          okText: 'Có',
          okType: 'danger',
          cancelText: 'Không',
          onOk: () => {
            this.onDelete(id);
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
    }

    renderActionColumn() {
        return {
            title: 'Hành động',
            width: '100px',
            align: 'center',
            render: (dataRow) => {
                const actionColumns = [];
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

    renderSearchForm(hiddenAction) {
        const searchFields = this.getSearchFields();

        if(searchFields.length > 0)
            return <SearchForm
                searchFields={searchFields}
                onSubmit={this.onSearch}
                onResetForm={this.onResetFormSearch}
                hiddenAction={hiddenAction}
                initialValues={this.search}
                />;
        return null;
    }

    renderImageColumn(value) {
        if(value)
            return (
                <img className="img-col" src={value} alt=""/>
            )
        return <PictureOutlined className="empty-img-col"/>
    }

    renderStatusColumn() {
        return {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '100px',
            render: (status) => <StatusTag status={status}/>
        }
    }

    renderIdColumn() {
        return {
            title: 'ID',
            dataIndex: 'id',
            width: '50px',
            align: 'center'
        }
    }

    renderEditButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [];
        Object.keys(sitePathConfig) && Object.keys(sitePathConfig).forEach(key=>{
            if(sitePathConfig[key].path === pathname){
                requiredPermissions.push(sitePathConfig[key].permissions?.[1]) //Get by id
                requiredPermissions.push(sitePathConfig[key].permissions?.[3]) //Update
            }
        })
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    renderCreateNewButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [];
        Object.keys(sitePathConfig) && Object.keys(sitePathConfig).forEach(key=>{
            if(sitePathConfig[key].path === pathname){
                requiredPermissions.push(sitePathConfig[key].permissions?.[2]) //Create
            }
        })
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    renderDeleteButton(children){
        const { location : { pathname }} = this.props;
        const requiredPermissions = [];
        Object.keys(sitePathConfig) && Object.keys(sitePathConfig).forEach(key=>{
            if(sitePathConfig[key].path === pathname){
                requiredPermissions.push(sitePathConfig[key].permissions[4]) //Delete
            }
        })
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }

    /**
     * 
     * @param {*} children 
     * @param {*} requiredPermissions -> perrmissions string
     * @returns 
     */
     renderButtonVerTwo(children, requiredPermissions = []){
        return (<ElementWithPermission permissions={requiredPermissions}>
            {children}
        </ElementWithPermission>)
    }
}

export default ListBasePage;