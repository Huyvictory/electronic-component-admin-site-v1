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
        icon: <UnorderedListOutlined />,
        children: [
            {
                label: 'Danh mục thu',
                ...sitePathConfig.categoryImport,
            },
            {
                label: 'Danh mục chi',
                ...sitePathConfig.categoryExport,
            },
            {
                label: 'Danh mục sản phẩm',
                ...sitePathConfig.categoryProduct,
            },
        ]
    },
    {
        label: 'Sản phẩm',
        icon: <InboxOutlined />,
        ...sitePathConfig.product,
        children: [],
        handleOnClick(props, handleLoadingMenuItem) {
            !this.clicked
            && handleLoadingMenuItem(sitePathConfig.product.path)
            && store.dispatch(
                actions.getProductCategoryAutoComplete({
                    params: { kind: CATEGORY_KIND_PRODUCT },
                    onCompleted: data => {
                        if (data?.length > 0) {
                            const pathname = sitePathConfig.product.path;
                            data.forEach(c => {
                                const _pathname = `${pathname}/${c.id}`
                                const _pathnameWithQs = `${pathname}/${c.id}?${strParams({ categoryId: c.id, categoryName: c.categoryName })}`
                                this.children.push({
                                    label: c.categoryName,
                                    path: _pathnameWithQs,
                                    key: _pathname,
                                })
                            })
                        }
                        handleLoadingMenuItem(null)
                    },
                    onError: error => {
                        handleLoadingMenuItem(null)
                        showErrorMessage(
                            error?.message ||
                                props.t('errorMessage')
                        )
                    },
                })
            )
            this.clicked = true;
        },
    },
]

export { navMenuConfig };
