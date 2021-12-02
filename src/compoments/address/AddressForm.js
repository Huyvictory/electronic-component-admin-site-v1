import React from "react";
import { Form, Col, Row } from "antd";

import BasicForm from "../common/entryForm/BasicForm";

import Utils from "../../utils";
import TextField from "../common/entryForm/TextField";
import DropdownField from "../common/entryForm/DropdownField";

class AddressForm extends BasicForm {
    constructor(props) {
        super(props)
        const {
          getProvinceComboboxList,
          getDistrictComboboxList,
          getCommuneComboboxList,
          dataDetail,
        } = props;

        getProvinceComboboxList();

        dataDetail.provinceDto?.id
        && dataDetail.districtDto?.id
        && getDistrictComboboxList ({
          params: {
            parentId: dataDetail.provinceDto.id
          },
        })

        dataDetail.districtDto?.id
        && dataDetail.communeDto?.id
        && getCommuneComboboxList ({
          params: {
            parentId: dataDetail.districtDto.id,
          },
        })
    }

    handleProvinceChange = (value) =>{
        const { getDistrictComboboxList } = this.props;
        getDistrictComboboxList ({
          params: {
            parentId: value,
          },
        })
        this.setFieldValue("districtId", undefined);
        this.setFieldValue("communeId", undefined);
    }

    handleDistrictChange = (value) =>{
        const { getCommuneComboboxList, communeComboboxList } = this.props;
        getCommuneComboboxList ({
          params: {
            parentId: value,
          },
        })
        this.setFieldValue("communeId", undefined);
    }

    mappingComboboxListToOptions(comboboxData) {
        return comboboxData && comboboxData.map(c=>({
              value: c.id,
              label: c.provinceName,
        })) || [];
    }

	getInitialFormValues = () => {
		const { dataDetail, isEditing } = this.props;
        if(isEditing) {
            return {
                ...dataDetail,
                provinceId: dataDetail.provinceDto.id,
                districtId: dataDetail.districtDto.id,
                communeId: dataDetail.communeDto.id,
            }
        }
		return dataDetail;
	}

	render() {
		const {
            isEditing,
            formId,
            loadingSave,
            provinceComboboxList,
            districtComboboxList,
            communeComboboxList,
        } = this.props;
		return (
		<Form
			id={formId}
			ref={this.formRef}
			layout="vertical"
			onFinish={this.handleSubmit}
			initialValues={this.getInitialFormValues()}
		>
			<Row gutter={16}>
                <Col span={12}>
                    <TextField
                        type="number"
                        fieldName="phone"
                        label={'Số điện thoại'}
                        required
                        minLength={0}
                        width="100%"
                        disabled={loadingSave}
                    />
                </Col>
                <Col span={12}>
                    <TextField
                        fieldName="name"
                        label={'Họ và tên'}
                        required
                        disabled={loadingSave}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <DropdownField
                    fieldName="provinceId"
                    label={'Tỉnh/thành phố'}
                    options={this.mappingComboboxListToOptions(provinceComboboxList)}
                    onChange={this.handleProvinceChange}
                    disabled={loadingSave || provinceComboboxList.length <= 0}
                    required
                    />
                </Col>
                <Col span={12}>
                    <DropdownField
                    fieldName="districtId"
                    label={'Quận/huyện'}
                    disabled={loadingSave || !this.getFieldValue("provinceId")}
                    options = {this.mappingComboboxListToOptions(districtComboboxList)}
                    onChange={this.handleDistrictChange}
                    required
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <DropdownField
                    fieldName="communeId"
                    label={'Xã/phường'}
                    disabled={loadingSave || !(this.getFieldValue("provinceId") && this.getFieldValue("districtId"))}
                    options = {this.mappingComboboxListToOptions(communeComboboxList)}
                    required
                    />
                </Col>
                <Col span={12}>
                    <TextField
                    fieldName="address"
                    label={'Địa chỉ'}
                    required
                    disabled={loadingSave}
                    />
                </Col>
            </Row>
        </Form>
		);
	}
}

export default AddressForm;
