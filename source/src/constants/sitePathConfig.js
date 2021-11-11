import apiConfig from './apiConfig';

export const sitePathConfig = {
    login: {
        path: '/login'
    },
    profile: {
        path: '/profile'
    },
    admin: {
        path: '/admins',
        permissions: [
            apiConfig.user.getAdminList.path,
            apiConfig.user.getAdminById.path,
            apiConfig.user.createAdmin.path,
            apiConfig.user.updateAdmin.path,
            apiConfig.user.deleteAdmin.path
        ]
    },
    forbidden: {
        path: '/forbidden'
    },
    setting: {
        path: '/settings',
        permissions: [
            apiConfig.setting.getSettingsList.path,
            apiConfig.setting.getSettingById.path,
            apiConfig.setting.createSetting.path,
            apiConfig.setting.updateSetting.path,
            apiConfig.setting.deleteSetting.path,
        ]
    },
    groupPermission: {
        path: '/groupPermission',
        permissions: [
            apiConfig.groupPermission.getList.path,
            apiConfig.groupPermission.getById.path,
            apiConfig.groupPermission.create.path,
            apiConfig.groupPermission.update.path,
            'not_have_delete',
            apiConfig.groupPermission.getPermissionList.path,
        ]
    },
    customer: {
        path: '/customer',
        permissions: [
            apiConfig.customer.getCustomerList.path,
            apiConfig.customer.getCustomerById.path,
            apiConfig.customer.createCustomer.path,
            apiConfig.customer.updateCustomer.path,
            apiConfig.customer.deleteCustomer.path,
        ]
    },
    productCategory: {
        path: '/product-category',
        permissions: [
            apiConfig.category.getCategoryList.path,
            apiConfig.category.getCategoryById.path,
            apiConfig.category.createCategory.path,
            apiConfig.category.updateCategory.path,
            apiConfig.category.deleteCategory.path,
        ]
    },
    newscategory: {
        path: '/news-category',
        permissions: [
            apiConfig.category.getCategoryList.path,
            apiConfig.category.getCategoryById.path,
            apiConfig.category.createCategory.path,
            apiConfig.category.updateCategory.path,
            apiConfig.category.deleteCategory.path,
        ]
    },
    importcategory: {
        path: '/importcategory',
        permissions: [
            apiConfig.category.getCategoryList.path,
            apiConfig.category.getCategoryById.path,
            apiConfig.category.createCategory.path,
            apiConfig.category.updateCategory.path,
            apiConfig.category.deleteCategory.path,
        ]
    },
    exportcategory: {
        path: '/exportcategory',
        permissions: [
            apiConfig.category.getCategoryList.path,
            apiConfig.category.getCategoryById.path,
            apiConfig.category.createCategory.path,
            apiConfig.category.updateCategory.path,
            apiConfig.category.deleteCategory.path,
        ]
    },
    product: {
        path: '/product',
        childrenKeys: ['/product-child'],
        permissions: [
            apiConfig.product.getProductList.path,
            apiConfig.product.getProductById.path,
            apiConfig.product.createProduct.path,
            apiConfig.product.updateProduct.path,
            apiConfig.product.deleteProduct.path,
            apiConfig.category.getTypeCategory.path
        ]
    },
    productChild: {
        path: '/product-children',
        permissions: [
            apiConfig.product.getProductList.path,
            apiConfig.product.getProductById.path,
            apiConfig.product.createProduct.path,
            apiConfig.product.updateProduct.path,
            apiConfig.product.deleteProduct.path,
            apiConfig.category.getTypeCategory.path
        ]
    },
    news: {
        path: '/news',
        permissions: [
            apiConfig.news.getNewsList.path,
            apiConfig.news.getNewsById.path,
            apiConfig.news.createNews.path,
            apiConfig.news.updateNews.path,
            apiConfig.news.deleteNews.path,
            apiConfig.category.getTypeCategory.path
        ]
    }
}