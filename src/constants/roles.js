export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    VISITOR: 'visitor'
};

export const PERMISSIONS = {
    [ROLES.ADMIN]: [
        'VIEW_PRODUCTS',
        'CREATE_PRODUCT',
        'UPDATE_PRODUCT',
        'DELETE_PRODUCT',
        'MANAGE_USERS',
    ],

    [ROLES.USER]: [
        'VIEW_PRODUCTS',
        'CREATE_REVIEW',
    ],

    [ROLES.VISITOR]: [
        'VIEW_PRODUCTS',
        'CREATE_ACCOUNT',
    ],
};