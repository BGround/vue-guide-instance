const territorialSea = {
    path: 'territorialSea',
    name: 'territorialSea',
    redirect: 'territorialSea/list',
    component: () => import("crm/views/crm/territorialSea"),
    children: [{
            path: 'list',
            name: 'territorialSeaList',
            component: () => import("crm/views/crm/territorialSea/list/list"),
            meta: {
                role: 'crm',
            }
        },
        {
            path: 'recycleList',
            name: 'recycleList',
            component: () => import("crm/views/crm/territorialSea/recycleList/recycleList"),
            meta: {
                role: 'crm',
            }
        },
        {
            path: 'operate',
            name: 'territorialSeaOperate',
            component: () => import("crm/views/crm/territorialSea/operate/operate"),
            meta: {
                role: 'crm',
            }
        },
    ]
}

export default territorialSea;
