import React from 'react';

import {
    UsergroupAddOutlined,
    ControlOutlined,
    FileTextOutlined,
    UserOutlined,
    QuestionOutlined,
    UnorderedListOutlined,
    CompassOutlined,
    InboxOutlined,
    BarsOutlined,
} from '@ant-design/icons';
import { sitePathConfig } from '../constants/sitePathConfig';
import store from '../store';
import { actions } from "../actions";
import { categoryKinds } from './masterData';
import qs from 'query-string';
import { showErrorMessage } from '../services/notifyService';

const { CATEGORY_KIND_PRODUCT } = categoryKinds;
const strParams = params => {
    return qs.stringify(params)
}

const navMenuConfig = [
    {
        label: 'Quản lý tài khoản',
        icon: <UsergroupAddOutlined />,
        children: [
            {
                label: 'Quản trị viên',
                ...sitePathConfig.admin
            },
        ]
    },
    {
        label: 'Hệ thống',
        icon: <ControlOutlined />,
        children: [
            {
                label: 'Cài Đặt',
                ...sitePathConfig.setting
            },
            {
                label: 'Quyền',
                ...sitePathConfig.groupPermission
            },
        ]
    },
    {
        label: 'Khách hàng',
        icon: <UserOutlined />,
        children: [
            {
                label: 'Khách hàng',
                ...sitePathConfig.customer,
            }
        ]
    },
    {
        label: 'Danh mục',
        icon: <BarsOutlined></BarsOutlined>,
        children: [
            {
                label: 'Danh mục thu',
                ...sitePathConfig.importcategory
            },
            {
                label: 'Danh mục chi',
                ...sitePathConfig.exportcategory,
            },
            {
                label: 'Sản phẩm',
                ...sitePathConfig.productCategory,
            },
            {
                label: 'Tin tức',
                ...sitePathConfig.newscategory,
            }
        ]
    },
    {
        label: 'Tỉnh thành',
        icon: <CompassOutlined></CompassOutlined>,
        children: [
            {
                label: 'Tỉnh thành',
                ...sitePathConfig.province
            }
        ]
    },
    {
        label: 'Sản phẩm',
        icon: <InboxOutlined></InboxOutlined>,
        children: [
            {
                label: 'Sản phẩm',
                ...sitePathConfig.product,
            },
        ]
    },   
]

export { navMenuConfig };
