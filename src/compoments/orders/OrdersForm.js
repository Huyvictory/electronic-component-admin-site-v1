import React, { useEffect, useState, useRef } from "react";
import { Form, Col, Row, Steps, Button, Modal } from "antd";
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'

import TextField from "../common/entryForm/TextField";
import {
  AppConstants,
} from "../../constants";
import { OrdersStates } from "../../constants";
import Utils from "../../utils";
import FieldSet from "../common/elements/FieldSet";
import { sitePathConfig } from "../../constants/sitePathConfig";
import NumericField from "../common/entryForm/NumericField";
import AutoCompleteField from "../common/entryForm/AutoCompleteField";
import { actions } from "../../actions";
import { useDispatch } from "react-redux";

const { Step } = Steps
const { confirm } = Modal

const OrdersForm = ({
    dataDetail,
    handleUpdateState,
    handleSubmit,
    handleCancelStateNoConfirm,
    loadingSave,
    t,
}) => {

    const dispatch = useDispatch()
    const formRef = useRef()

    const resetFormObject = {
        customerEmail: null,
        customerFullName: null,
        customerPhone: null,
        ordersAddress: null,
        saleOff: 0,
    }

    const {
        ordersDetailDtos,
        ordersVat,
        ordersState,
        ordersSaleOff,
        ordersPrevState,
    } = dataDetail

    const [isReadonlyForm, setIsReadonlyForm] = useState(true)
    const [productsList, setProductsList] = useState(ordersDetailDtos || [])
    const [totalPrice, setTotalPrice] = useState(0)
    const [saleOff, setSaleOff] = useState(ordersSaleOff)
    const [deletedOrdersDetailsList , setDeletedOrdersDetailsList] = useState([])
    const [customersList, setCustomersList] = useState([])
    const [listCustomerLoading, setListCustomerLoading] = useState(false)
    const [disabledFields, setDisabledFields] = useState(true)

    const discountPrice = totalPrice * (saleOff / 100)
    const totalPriceAfterDiscount = totalPrice - discountPrice
    const vatPrice = totalPriceAfterDiscount * Number(ordersVat / 100)
    const finalPrice = totalPriceAfterDiscount + vatPrice

    const handleChangeStep = (current) => {
        if(current > ordersState && current <  OrdersStates.length - 1) {
            const state = OrdersStates.find(state => state.value === current)
            handleUpdateState({
                id: dataDetail.id,
                ordersState: state.value
            })
        }
    }

    const prepareDataSubmit = (values) => {
        handleSubmit({
            id: dataDetail.id,
            customerEmail: values.customerEmail,
            customerFullName: values.customerFullName,
            customerPhone: values.customerPhone,
            ordersAddress: values.ordersAddress,
            ordersSaleOff: values.saleOff,
            ordersDetailDtos: productsList.map(p => ({
                amount: p.amount,
                employeeCommission: p.employeeCommission,
                id: p.id,
                ordersId: p.ordersId,
                price: p.price,
                productId: p.productDto.id,
                note: p.note,
            })),
            deletingOrdersDetails: deletedOrdersDetailsList.map(p => ({
                amount: p.amount,
                employeeCommission: p.employeeCommission,
                id: p.id,
                ordersId: p.ordersId,
                price: p.price,
                productId: p.productDto.id,
                note: p.note,
            })),

        })
    }

    const handleRemoveSelectingItem = (product, isCancel) => {
        confirm({
            title: `${isCancel ? t("confirmDeleteFinalItem") : t("confirmDeleteItem")}`,
            content: '',
            okText: t("yes"),
            okType: 'danger',
            cancelText: t("no"),
            onOk: () => {
                if(!isCancel) {
                    const newProductsList = [...productsList]
                    const deleteds = newProductsList.splice(newProductsList.findIndex(p => p.productDto.id === product.id), 1)
                    Promise.resolve().then(() => {
                        setDeletedOrdersDetailsList([...deletedOrdersDetailsList, ...deleteds])
                        setProductsList(newProductsList)
                    })
                }
                else {
                    handleCancelStateNoConfirm({
                        id: dataDetail.id,
                        ordersState: OrdersStates[4].value
                    })
                }
            },
            onCancel() {
            },
          });
    }

    const handleChangeAmountItem = (product, value) => {
        const newProductsList = [...productsList]
        newProductsList[newProductsList.findIndex(p => p.productDto.id === product.id)].amount += value
        setProductsList(newProductsList)
    }

    const handleChangeSaleOff = (value) => {
        setSaleOff(value)
    }

    const setFormValues = (value) => {
        const selectedCustomer = customersList.find(customer => customer.customerPhone === value)
        formRef.current.setFieldsValue(selectedCustomer || {
            ...resetFormObject,
            customerPhone: value,
        })
        setSaleOff(selectedCustomer.saleOff || saleOff)
    }

    const handleSelectPhone = (value) => {
        setDisabledFields(true)
        setFormValues(value)
    }

    const handleSearchPhone = (value) => {
        if(value) {
            formRef.current.setFieldsValue({
                ...resetFormObject,
                customerPhone: value,
            })
            setDisabledFields(false)
            setListCustomerLoading(true)
            dispatch(actions.getCustomerAutoComplete({
                params: {
                    phone: value,
                    size: 10
                },
                onCompleted: (data) => {
                    setListCustomerLoading(false)
                    setCustomersList(data)
                },
                onDone: () => {
                    setListCustomerLoading(false)
                }
            }))
        }
        else {
            setCustomersList([])
            setDisabledFields(false)
        }
    }

    useEffect(() => {
        let total = 0
        productsList.forEach(p => {
            total += p.price * p.amount
        })
        setTotalPrice(total)
    }, [productsList])

    useEffect(() => {
        setIsReadonlyForm(!Utils.checkPermission([sitePathConfig.orders.permissions[5]]) || ordersState > OrdersStates[0].value)
        formRef.current.setFieldsValue({
            customerPhone: dataDetail.customerDto?.customerPhone,
            customerFullName: dataDetail.customerDto?.customerFullName,
            customerEmail: dataDetail.customerDto?.customerEmail,
            saleOff,
            id: dataDetail.customerDto?.id,
        })
    }, [])

    return (
    <div className="orders-form">
        <h2 className="state">{t("form.state")}:</h2>
        <Steps current={ordersState} onChange={handleChangeStep} size="small">
            {
                ordersState < OrdersStates[3].value
                ? OrdersStates.map((state, i) => {
                    if(i >= OrdersStates.length - 1) return null
                    if(ordersState > state.value) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className="finish"
                        status="finish"
                        />
                    }
                    else if (ordersState === state.value) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className={`process${state.value === OrdersStates[4].value ? ' cancel' : ''}`}
                        status="process"
                        />
                    }
                    else if(ordersState < state.value){
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className={`wait${state.value === OrdersStates[4].value ? ' cancel' : ''}`}
                        status="wait"
                        />
                    }
                    return null
                })
                : OrdersStates.map((state, i) => {
                    if(state.value < ordersPrevState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className="finish has-prev-state"
                        status="finish"
                        />
                    }
                    else if(state.value === ordersPrevState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className="finish is-prev-state"
                        status="finish"
                        />
                    }
                    else if(state.value === ordersState) {
                        return <Step
                        key={state.value}
                        title={state.label}
                        icon={state.icon}
                        className={`process${state.value === OrdersStates[4].value ? ' cancel' : ''}`}
                        status="process"
                        />
                    }
                    return null
                })
            }
        </Steps>
        <div className="payment-content">
            <div className="form">
                <FieldSet title={t("form.fieldSet.customerInfo")}>
                    <Form
                        ref={formRef}
                        id="customer-info-form"
                        layout="vertical"
                        initialValues={dataDetail}
                        className={`${ isReadonlyForm || loadingSave ? 'readonly-form' : ''}`}
                        onFinish={prepareDataSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={"customerFullName"}
                                label={t("form.label.customerFullName")}
                                disabled={isReadonlyForm || loadingSave || disabledFields}
                                className="form-item-fullname"
                                />
                            </Col>
                            <Col span={12}>
                                <AutoCompleteField
                                    fieldName="customerPhone"
                                    label={t("form.label.customerPhone")}
                                    className="form-item-phone"
                                    required
                                    minLength={10}
                                    disabled={isReadonlyForm || loadingSave}
                                    optionValue="customerPhone"
                                    optionLabel="customerPhone"
                                    onSelect={handleSelectPhone}
                                    onSearch={handleSearchPhone}
                                    autoComplete="none"
                                    options={customersList}
                                    loading={listCustomerLoading}
                                    allowClear={true}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                fieldName={"customerEmail"}
                                label="E-mail"
                                disabled={isReadonlyForm || loadingSave || disabledFields}
                                className="form-item-email"
                                />
                                <NumericField
                                fieldName="saleOff"
                                label={`${t("form.label.ordersSaleOff")} (%)`}
                                min={0}
                                max={100}
                                className="form-item-discount"
                                disabled={isReadonlyForm || loadingSave}
                                onChange={handleChangeSaleOff}
                                width="100%"
                                parser={(value) => Utils.formatIntegerNumber(value)}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    fieldName="ordersAddress"
                                    label={`${t("form.label.ordersAddress")}`}
                                    disabled={isReadonlyForm || loadingSave}
                                    type="textarea"
                                    style={{ height: 102 }}
                                />
                            </Col>
                        </Row>
                    </Form>
                </FieldSet>
            </div>
            <div className="list">
                <FieldSet title={t("form.fieldSet.productList")} className="custom-fieldset fieldset-list">
                    <ul className="orders">
                        {
                            productsList.map(ordersDetail => {
                                const parentName = ordersDetail.productDto.parentName
                                const productName = parentName ? parentName + " (" + ordersDetail.productDto.productName + ")" : ordersDetail.productDto.productName
                                return (<li key={ordersDetail.id} className={`item`} style={{ backgroundColor: ordersDetail.productDto.labelColor, paddingRight: isReadonlyForm ? 8 : 32 }}>
                                    <div className="item-content">
                                        <div className="col col-1">
                                            <div className="quantity-edition">
                                                <Button
                                                className={`minus${isReadonlyForm ? ' display-none' : ''}`}
                                                onClick={() => {
                                                    if(ordersDetail.amount <= 1) {
                                                        handleRemoveSelectingItem(ordersDetail.productDto, productsList.length === 1)
                                                    }
                                                    else {
                                                        handleChangeAmountItem(ordersDetail.productDto, -1)
                                                    }
                                                }}
                                                >
                                                    -
                                                </Button>
                                                <span className="quantity" style={isReadonlyForm ? { marginRight: 4, marginLeft: 0 } : {}}>{ordersDetail.amount}</span>
                                                <Button
                                                className={`plus${isReadonlyForm ? ' display-none' : ''}`}
                                                onClick={() => handleChangeAmountItem(ordersDetail.productDto, 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <p className="title">
                                                { isReadonlyForm ? " x " : "" }{productName}
                                            </p>
                                        </div>
                                        <div className="col col-2">
                                            <p className="price">
                                                {Utils.formatMoney( ordersDetail.price * ordersDetail.amount)}
                                            </p>
                                            <DeleteOutlined
                                            className={`delete-btn${isReadonlyForm ? ' display-none' : ''}`}
                                            onClick={() => handleRemoveSelectingItem(ordersDetail.productDto, productsList.length === 1)}
                                            />
                                        </div>
                                    </div>
                                    <p className="note-content">{ ordersDetail.note}</p>
                                </li>
                                )
                            })
                        }
                    </ul>
                </FieldSet>
            </div>
        </div>
        <div className="bottom">
            <FieldSet className="custom-fieldset none-legend">
                <div className="calculate-total product">
                    <div className="title">{t("form.totalProductPrice")}:</div>
                    <div className="total">
                        {Utils.formatMoney(totalPrice)}
                    </div>
                </div>
                <div className="calculate-total discount">
                    <div className="title">{t("form.saleOff")}{saleOff > 0 ? ` (${saleOff}%)`: ''}:</div>
                    <div className="total">
                        {Utils.formatMoney(discountPrice)}
                    </div>
                </div>
                <div className="calculate-total vat">
                    <div className="title">VAT ({ordersVat}%):</div>
                    <div className="total">
                        {Utils.formatMoney(vatPrice)}
                    </div>
                </div>
                <div className="calculate-total product-vat">
                    <div className="title">{t("form.totalPayment")}:</div>
                    <div className="total">
                        {Utils.formatMoney(finalPrice)}
                    </div>
                </div>
            </FieldSet>
        </div>
    </div>
    );
}

export default OrdersForm;
