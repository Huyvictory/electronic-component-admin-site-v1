import React from 'react'
import { Tabs } from 'antd'
import qs from 'query-string';
import { useHistory } from 'react-router-dom'

import AddressListPage from './AddressListPage';
import OrdersListPage from '../orders/OrdersListPage';
import { sitePathConfig } from '../../constants/sitePathConfig';
import { actions } from '../../actions';
const { TabPane } = Tabs;

const WrapperCollaboratorOrders = (props) => {
    const history = useHistory()
    const queryString = qs.parse(history.location.search)
    const { keyTab = "1" } = queryString

    const handleChangeTab = (value) => {
        if(value !== keyTab) {
            history.push(
                `${sitePathConfig.wrapperCustomerPreferences.path}?${qs.stringify({
                    ...queryString,
                    keyTab: value,
                })}`
            )
        }
    }

    const checkPermissions = ({permissions = []}) => {
        const userData = actions.getUserData();
        return !permissions.some(permission=>
            userData.permissions.indexOf(permission) < 0)
    }

    const pages = [
        {
            component: OrdersListPage,
            permissions: [
                sitePathConfig.address.permissions[0]
            ],
            name: 'Đơn đặt hàng',
            key: "1",
        },
        {
            component: AddressListPage,
            permissions: [
                sitePathConfig.address.permissions[0]
            ],
            name: 'Địa chỉ',
            key: "2",
        },
    ]

    return (
        <div>
            <Tabs
            defaultActiveKey={keyTab}
            type="card"
            onChange={(value) => handleChangeTab(value)}
            >
                {
                    pages
                    .filter(page => {
                        if(page.permissions && !checkPermissions({
                            permissions: page.permissions,
                        })) {
                            return false
                        }
                        return true
                    })
                    .map(page => {
                        const PageComponent = page.component
                        return (
                            <TabPane tab={page.name} key={page.key}>
                                {page.key === keyTab && <PageComponent requiredPermissions={page.permissions} keyTab={keyTab} {...props}/>}
                            </TabPane>
                        )
                    })
                }
            </Tabs>
        </div>
    )
}

export default WrapperCollaboratorOrders
