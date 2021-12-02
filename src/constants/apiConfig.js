const baseHeader = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
}

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data'
}


const apiConfig = {
    file: {
        upload: {
            path: '/v1/file/upload',
            method: 'POST',
            headers: multipartFormHeader
        }
    },
    account: {
        login: {
            path: '/v1/account/login',
            method: 'POST',
            headers: baseHeader
        },
        logout: {
            path: '/v1/account/logout',
            method: 'GET',
            headers: baseHeader
        },
        getAdminProfile: {
            path: '/v1/account/profile',
            method: 'GET',
            headers: baseHeader
        },
        getShopAccountProfile: {
            path: '/v1/shop_account/profile',
            method: 'GET',
            headers: baseHeader
        },
        updateShopAccountProfile: {
            path: '/v1/shop_account/update_profile',
            method: 'PUT',
            headers: baseHeader
        },
        updateProfileAdmin: {
            path: '/v1/account/update_profile',
            method: 'PUT',
            headers: baseHeader
        }
    },
    user: {
        getAdminList: {
            path: '/v1/account/list',
            method: 'GET',
            headers: baseHeader
        },
       
        getAdminById: {
            path: '/v1/account/get',
            method: 'GET',
            headers: baseHeader
        },
        createAdmin: {
            path: '/v1/account/create_admin',
            method: 'POST',
            headers: baseHeader
        },
        updateAdmin: {
            path: '/v1/account/update_admin',
            method: 'PUT',
            headers: baseHeader
        },
        deleteAdmin: {
            path: '/v1/account/delete',
            method: 'DELETE',
            headers: baseHeader
        },
    },
    groupPermission: {
        getList: {
            path: '/v1/group/list',
            method: 'GET',
            headers: baseHeader
        },
        getPermissionList: {
            path: '/v1/permission/list',
            method: 'GET',
            headers: baseHeader
        },
        getById: {
            path: '/v1/group/get',
            method: 'GET',
            headers: baseHeader
        },
        create: {
            path: '/v1/group/create',
            method: 'POST',
            headers: baseHeader
        },
        update: {
            path: '/v1/group/update',
            method: 'PUT',
            headers: baseHeader
        },
        updateStatus: {
            path: '/v1/skills/status',
            method: 'PUT',
            headers: baseHeader
        },
        delete: {
            path: '/v1/skills',
            method: 'DELETE',
            headers: baseHeader
        },
    },
    setting: {
        getSettingsList: {
            path: '/v1/settings/list',
            method: 'GET',
            headers: baseHeader
        },
        createSetting: {
            path: '/v1/settings/create',
            method: 'POST',
            headers: baseHeader
        },
        getSettingById: {
            path: '/v1/settings/get',
            method: 'GET',
            headers: baseHeader
        },
        updateSetting: {
            path: '/v1/settings/update',
            method: 'PUT',
            headers: baseHeader
        },
        deleteSetting: {
            path: '/v1/settings/delete',
            method: 'DELETE',
            headers: baseHeader
        },
        getSettingsClientList: {
            path: '/v1/settings/client-list',
            method: 'GET',
            headers: baseHeader
        },
    },
    customer: {
        getCustomerList: {
            path: '/v1/customer/list',
            method: 'GET',
            headers: baseHeader
        },
        createCustomer: {
            path: '/v1/customer/create',
            method: 'POST',
            headers: baseHeader
        },
        getCustomerById: {
            path: '/v1/customer/get',
            method: 'GET',
            headers: baseHeader
        },
        updateCustomer: {
            path: '/v1/customer/update',
            method: 'PUT',
            headers: baseHeader
        },
        deleteCustomer: {
            path: '/v1/customer/delete',
            method: 'DELETE',
            headers: baseHeader
        }
    },
    category: {
        getCategoryList: {
            path: '/v1/category/list',
            method: 'GET',
            headers: baseHeader
        },
        createCategory: {
            path: '/v1/category/create',
            method: 'POST',
            headers: baseHeader
        },
        getCategoryById: {
            path: '/v1/category/get',
            method: 'GET',
            headers: baseHeader
        },
        updateCategory: {
            path: '/v1/category/update',
            method: 'PUT',
            headers: baseHeader
        },
        deleteCategory: {
            path: '/v1/category/delete',
            method: 'DELETE',
            headers: baseHeader
        },
        getTypeCategory: {
            path: '/v1/category/auto-complete',
            method: 'GET',
            headers: baseHeader
        }
    },
    product: {
        getProductList: {
            path: '/v1/product/list',
            method: 'GET',
            headers: baseHeader
        },
        getProductById: {
            path: '/v1/product/get',
            method: 'GET',
            headers: baseHeader
        },
        createProduct: {
            path: '/v1/product/create',
            method: 'POST',
            headers: baseHeader
        },
        updateProduct: {
            path: '/v1/product/update',
            method: 'PUT',
            headers: baseHeader
        },
        deleteProduct: {
            path: '/v1/product/delete',
            method: 'DELETE',
            headers: baseHeader
        }
    },
    address: {
        getList: {
            path:  '/v1/addresses/list',
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            path:  '/v1/addresses/get',
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            path:  '/v1/addresses/create',
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            path:  '/v1/addresses/update',
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            path:  '/v1/addresses/delete',
            method: 'DELETE',
            headers: baseHeader,
        },
    },
    province: {
        getProvinceList: {
            path: '/v1/province/list',
            method: 'GET',
            headers: baseHeader
        },
        getProvinceById: {
            path: '/v1/province/get',
            method: 'GET',
            headers: baseHeader
        },
        createProvince: {
            path: '/v1/province/create',
            method: 'POST',
            headers: baseHeader
        },
        updateProvince: {
            path: '/v1/province/update',
            method: 'PUT',
            headers: baseHeader
        },
        deleteProvince: {
            path: '/v1/province/delete',
            method: 'DELETE',
            headers: baseHeader
        },
        getProvinceListAutoComplete: {
            path: '/v1/province/auto-complete',
            method: 'GET',
            headers: baseHeader
        },
    },
    news: {
        getNewsList: {
            path: '/v1/news/list',
            method: 'GET',
            headers: baseHeader
        },
        createNews: {
            path: '/v1/news/create',
            method: 'POST',
            headers: baseHeader
        },
        getNewsById: {
            path: '/v1/news/get',
            method: 'GET',
            headers: baseHeader
        },
        updateNews: {
            path: '/v1/news/update',
            method: 'PUT',
            headers: baseHeader
        },
        deleteNews: {
            path: '/v1/news/delete',
            method: 'DELETE',
            headers: baseHeader
        }
    },
    orders: {
        getOrdersList: {
            path: '/v1/orders/list',
            method: 'GET',
            headers: baseHeader
        },
        getOrdersrbyId: {
            path: '/v1/orders/get',
            method: 'GET',
            headers: baseHeader
        },
        updateOrders: {
            path: '/v1/orders/update',
            method: 'PUT',
            headers: baseHeader
        },
        updateOrdersByState: {
            path: '/v1/orders/update-state',
            method: 'PUT',
            headers: baseHeader
        },
        updateOrdersCancel: {
            path: '/v1/orders/cancel-orders',
            method: 'PUT',
            headers: baseHeader
        }
    }
}

export default apiConfig;

