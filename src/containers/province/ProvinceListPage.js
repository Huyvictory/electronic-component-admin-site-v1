import React from "react";
import { connect } from "react-redux";
import { Avatar, Tag, Button, Table } from "antd";
import { TableOutlined, PlusOutlined} from "@ant-design/icons";

import ListBasePage from "../ListBasePage";
import ProvinceForm from "../../compoments/province/ProvinceForm";
import SearchForm from '../../compoments/common/entryForm/SearchForm';
import BaseTable from "../../compoments/common/table/BaseTable";
import BasicModal from "../../compoments/common/modal/BasicModal";
import qs from 'query-string';

import { actions } from "../../actions";
import { ProvinceKinds, DEFAULT_TABLE_ITEM_SIZE } from "../../constants";
import { FieldTypes } from "../../constants/formConfig";
import { convertUtcToLocalTime } from "../../utils/datetimeHelper";
import { AppConstants } from "../../constants";
import {categoryKinds} from "../../constants/masterData";
import { showErrorMessage, showSucsessMessage } from '../../services/notifyService';
import {sitePathConfig} from '../../constants/sitePathConfig';
import Utils from '../../utils/index'

const {getUserData} = actions;

const commonStatus = [
  { value: 1, label: 'Kích hoạt', color: 'green' },
  { value: 0, label: 'Khóa', color: 'red' },
]

class ProvinceListPage extends ListBasePage {
  initialSearch() {
    return { name: ""};
  }

  constructor(props) {
    super(props);
    this.objectName =  "Tỉnh thành";
    this.breadcrumbs = [{ name: "Tỉnh thành" }];
    this.parentProvinces = [
      {
        id: undefined,
        name: undefined,
        searchName: '',
      },
      {
        id: undefined, 
        name: undefined,
        searchName: '',
      },
      {
        id: undefined ,
        name: undefined,
        searchName: '',
      }
    ]
    this.search = this.initialSearch();
    this.dataDetail = {};
    this.columns = [
      { title: 'Tên tỉnh thành', dataIndex: "provinceName", render: (provinceName, dataRow) => {
        console.log(provinceName);
                  const { dataList } = this.props;
                  console.log(dataList);
          console.log(dataList.data[0].kind);
          const currentProvinceKind = this.findProvinceKindByKey('name', dataList.kind);
          console.log(currentProvinceKind);
          return (
            <span style={currentProvinceKind.level < 3 ? {color: "#40a9ff", cursor: 'pointer'} : null} onClick={e=>{
              if(currentProvinceKind?.level < Object.keys(ProvinceKinds).length){
                
                //Update query string

                this.parentProvinces[currentProvinceKind.level - 1].id = dataRow.id;
                this.parentProvinces[currentProvinceKind.level - 1].name = dataRow.provinceName;
                this.parentProvinces[currentProvinceKind.level - 1].searchName = this.search.name;

                //Clear current search form
                this.search = this.initialSearch();
                this.pagination.current = 1;
                this.setQueryString();
              }
            }}>
              {dataRow.provinceName}
            </span>
          )
    }},
      this.renderActionColumn(),
    ];
    this.actionColumns = {
      isEdit: true,
      isDelete: true,
      isChangeStatus: false,
    };
  }

  findProvinceKindByKey = (key, value) => {
    return ProvinceKinds[Object.keys(ProvinceKinds).find(e=>ProvinceKinds[e][key]===value)];
  }

  getList() {
    const { getDataList } = this.props;
    const page = this.pagination.current ? this.pagination.current - 1 : 0;
    let kind = ProvinceKinds.province.name;
    let parentId = null;
    if(this.parentProvinces[1].id){
      kind = ProvinceKinds.commune.name;
      parentId = this.parentProvinces[1].id;
    }
    else if(this.parentProvinces[0].id || this.parentProvinces[0].id === 0){
      kind = ProvinceKinds.district.name;
      parentId = this.parentProvinces[0].id;
    }
    const params = { page, 
                    size: this.pagination.pageSize, 
                    search: this.search,
                    parentId,
                    kind
                  };
    getDataList({ params });
  }

  getSearchFields() {

    return [
      {
        key: "name",
        seachPlaceholder: 'Tên tỉnh thành',
        initialValue: this.search.name,
      },
    ];
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

  loadDataTable(currentProps) {
    const queryString = qs.parse(currentProps.location.search);
    this.pagination.current = 1;
    if(!isNaN(queryString.page))
        this.pagination.current = parseInt(queryString.page);
    Object.keys(this.search).forEach(key => this.search[key] = queryString[key]);
    this.parentProvinces.forEach((prov, i) => Object.keys(this.parentProvinces[i]).forEach(key=>{
      if(i === 0){
        this.parentProvinces[i][key] = queryString['province' + key];
      }  
      else if(i === 1){
          this.parentProvinces[i][key] = queryString['district' + key];
      }
      else if(i === 2){
        this.parentProvinces[i][key] = queryString['commune' + key];
      }
    }));
    this.getList();
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
    const refactorParentProvinces = {};
    this.parentProvinces.forEach((e, i)=>{
      if(i === 0){
        Object.keys(e).forEach(t=>{
          refactorParentProvinces['province' + t] = e[t];
        })
      }
      else if(i === 1){
        Object.keys(e).forEach(t=>{
          refactorParentProvinces['district' + t] = e[t];
        })
      }
      else if(i === 2){
        Object.keys(e).forEach(t=>{
          refactorParentProvinces['commune' + t] = e[t];
        })
      }
    });
    newQsValue = Object.assign(queryString, newQsValue, this.search, refactorParentProvinces);
    
    if(Object.keys(newQsValue).length > 0)
    {
        Object.keys(newQsValue).forEach(key => {
            if(!newQsValue[key] && newQsValue[key] !== 0)
                delete newQsValue[key];
         });
        
    }

    if(Object.keys(newQsValue).length > 0)
        history.push(`${pathname}?${qs.stringify(newQsValue)}`);
    else
        history.push(pathname);
  }

  renderSearchForm(hiddenAction) {
    const searchFields = this.getSearchFields();

    if(searchFields.length > 0)
        return <SearchForm
            key={this.props.dataList.parentId || -1}
            searchFields={searchFields}
            onSubmit={this.onSearch}
            onResetForm={this.onResetFormSearch}
            hiddenAction={hiddenAction}
            initialValues={this.search}
            />;
    return null;
}

  componentWillMount() {
    const { changeBreadcrumb,  location: { search, }, t } = this.props;
    const temp = qs.parse(search);
    if (!temp)
      {
        if(this.breadcrumbs.length > 0) {
        changeBreadcrumb(this.breadcrumbs);
        }
      }
    else {
      const {districtid, districtname, districtsearchName, provinceid, provincename, provincesearchName,} = temp;
      const tempBreadcrumb=[];
      const path = sitePathConfig.province.path;
      let provincePath={};
      let districtPath={};
      let name="";
      if (provinceid && !districtid)
      {
        provincePath = {provinceid, provincename, provincesearchName}
        provincePath = qs.stringify(provincePath)
        if (provincesearchName) 
        {
          name = {}
          name.name=provincesearchName
          name = qs.stringify(name)
        }
        let provinceItem =  
          {
            name: this.objectName,
            path: `${path}?${name}`,
          }
          let provinceDisplayItem =  
          {
            name: provincename,
          }      
        tempBreadcrumb.push(provinceItem, provinceDisplayItem)
      }
      // name = {}
      else if (districtid)
      {
        provincePath = {provinceid, provincename, provincesearchName}
        provincePath = qs.stringify(provincePath)
        if (provincesearchName) 
        {
          name = {}
          name.name=provincesearchName
          name = qs.stringify(name)
        }
        let provinceItem =  
          {
            name: this.objectName,
            // path: `${path}?${provincePath}`,
            path: `${path}?${name}`,
          }    
        tempBreadcrumb.push(provinceItem)
        districtPath = {districtid, districtname, districtsearchName}
        districtPath = qs.stringify(districtPath)
        if (districtsearchName) 
        {
          name = {}
          name.name=districtsearchName
          name = qs.stringify(name)
        }
        let districtItem = 
          {
            name: provincename,
            path: `${path}?${name}&${provincePath}`,
            // path: `${path}?${provincePath}&${districtPath}`,
          }
          let districtDisplayItem =  
          {
            name: districtname,
          }   
        tempBreadcrumb.push(districtItem, districtDisplayItem);
      }
      else {
        let provinceDisplayItem =  
        {
          name: this.objectName,
        }      
        tempBreadcrumb.push(provinceDisplayItem)
      }
      changeBreadcrumb(tempBreadcrumb);
    }
    this.userData = getUserData();
    if(this.checkPermission())
      this.loadDataTable(this.props);
  }

  componentWillUpdate() {
    const { changeBreadcrumb,  location: { search, }} = this.props;
    const temp = qs.parse(search);
    if (!temp)
      {
        if(this.breadcrumbs.length > 0) {
        changeBreadcrumb(this.breadcrumbs);
        }
      }
    else {
      const {districtid, districtname, districtsearchName, provinceid, provincename, provincesearchName,} = temp;
      const tempBreadcrumb=[];
      const path = sitePathConfig.province.path;
      let provincePath={};
      let districtPath={};
      let name="";
      if (provinceid && !districtid)
      {
        provincePath = {provinceid, provincename, provincesearchName}
        provincePath = qs.stringify(provincePath)
        if (provincesearchName) 
        {
          name = {}
          name.name=provincesearchName
          name = qs.stringify(name)
        }
        let provinceItem =  
          {
            name: this.objectName,
            path: `${path}?${name}`,
          }
          let provinceDisplayItem =  
          {
            name: provincename,
          }      
        tempBreadcrumb.push(provinceItem, provinceDisplayItem)
      }
      // name = {}
      else if (districtid)
      {
        provincePath = {provinceid, provincename, provincesearchName}
        provincePath = qs.stringify(provincePath)
        if (provincesearchName) 
        {
          name = {}
          name.name=provincesearchName
          name = qs.stringify(name)
        }
        let provinceItem =  
          {
            name: this.objectName,
            // path: `${path}?${provincePath}`,
            path: `${path}?${name}`,
          }    
        tempBreadcrumb.push(provinceItem)
        districtPath = {districtid, districtname, districtsearchName}
        districtPath = qs.stringify(districtPath)
        if (districtsearchName) 
        {
          name = {}
          name.name=districtsearchName
          name = qs.stringify(name)
        }
        let districtItem = 
          {
            name: provincename,
            path: `${path}?${name}&${provincePath}`,
            // path: `${path}?${provincePath}&${districtPath}`,
          }
          let districtDisplayItem =  
          {
            name: districtname,
          }   
        tempBreadcrumb.push(districtItem, districtDisplayItem);
      }
      else {
        let provinceDisplayItem =  
        {
          name: this.objectName,
        }      
        tempBreadcrumb.push(provinceDisplayItem)
      }
      changeBreadcrumb(tempBreadcrumb);
    }
  }

  render() {
    const {
      dataList,
      loading,
    } = this.props;

    const { isShowModifiedModal, isShowModifiedLoading } = this.state;
    const province = dataList.data || [];
    console.log(dataList);
    console.log(this.dataDetail);
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
          dataSource={province}
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
          <ProvinceForm
            isEditing={this.isEditing}
            dataDetail={this.isEditing ? {...this.dataDetail, parentId: dataList.parentId} : { kind: dataList.kind, parentId: dataList.parentId}}
            parentProvinces={this.parentProvinces}
            loadingSave={isShowModifiedLoading}
          />
        </BasicModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.province.tbprovinceLoading,
  dataList: state.province.provinceData || {},
});

const mapDispatchToProps = (dispatch) => ({
  getDataList: (payload) => dispatch(actions.getProvinceList(payload)),
  getDataById: (payload) => dispatch(actions.getProvinceById(payload)),
  updateData: (payload) => dispatch(actions.updateProvince(payload)),
  deleteData: (payload) => dispatch(actions.deleteProvince(payload)),
  createData: (payload) => dispatch(actions.createProvince(payload)),
  uploadFile: (payload) => dispatch(actions.uploadFile(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProvinceListPage);
