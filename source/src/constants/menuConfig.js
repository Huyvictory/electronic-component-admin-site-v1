import React from 'react';

import {
    UsergroupAddOutlined,
    ControlOutlined,
    FileTextOutlined,
    UserOutlined,
    QuestionOutlined,
    UnorderedListOutlined,
    InboxOutlined,
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
        icon: <UserOutlined />,
        children: [
            {
                label: 'Tin tức',
                ...sitePathConfig.category,
            }
        ]
    },
]

export { navMenuConfig };
