export default {
  name: "crmSetting",
  path: "setting",
  component: () => import("crm/views/crm/setting"),
  redirect: "setting/list",
  children: [{
      name: "crmSettingList",
      path: "list",
      component: () => import("crm/views/crm/setting/list")
    },
    {
      name: "crmSettingDataPermission",
      path: "dataPermission",
      component: () => import("crm/views/crm/setting/dataPermission")
    },
    {
      name: "crmSettingAlarm",
      path: "alarm",
      component: () => import("crm/views/crm/setting/alarm")
    },
    {
      name: "crmSettingMenu",
      path: "menu",
      component: () => import("crm/views/crm/setting/menu")
    },
    {
      name: "crmSettingRepeat",
      path: "checkRepeat",
      component: () => import("crm/views/crm/setting/checkRepeat")
    },
    {
      name: "poolSetting",
      path: "poolSetting",
      component: () => import("crm/views/crm/setting/poolSetting")
    },
    {
      name: "billType",
      path: "billType",
      component: () => import("crm/views/crm/setting/billType")
    },
    {
      name: "clientType",
      path: "clientType",
      component: () => import("crm/views/crm/setting/clientType")
    },
    {
      name: "contractType",
      path: "contractType",
      component: () => import("crm/views/crm/setting/contractType")
    },
    {
      name: "crmSettingVisit",
      path: "visit",
      component: () => import("crm/views/crm/setting/visit")
    },
    {
      name: "crmSettingPoolRule",
      path: "poolRule",
      component: () => import("crm/views/crm/setting/poolRule")
    },
    {
      name: "crmSettingClientCustom",
      path: "clientCustom",
      component: () =>
        import("crm/views/crm/setting/customSetting/clientCustom")
    },
    {
      name: "crmSettingContactCustom",
      path: "contactCustom",
      component: () =>
        import("crm/views/crm/setting/customSetting/contactCustom")
    },
    {
      name: "crmSettingBusinessCustom",
      path: "businessCustom",
      component: () =>
        import("crm/views/crm/setting/customSetting/businessCustom")
    },
    {
      name: "crmSettingVisitCustom",
      path: "visitCustom",
      component: () =>
        import("crm/views/crm/setting/customSetting/visitCustom")
    },
    {
      name: "crmSettingContractCustom",
      path: "contractCustom",
      component: () =>
        import("crm/views/crm/setting/customSetting/contractCustom")
    },
    {
      name: "crmSettingClientTransferred",
      path: "clientTransferred",
      component: () =>
        import("crm/views/crm/setting/clientTransferred")
    },
    {
      name: "crmSettingContractBranch",
      path: "contractBranch",
      component: () => import("crm/views/crm/setting/contractBranch")
    },
    {
      name: "settingCustomerLevel",
      path: "customerLevel",
      component: () => import("crm/views/crm/setting/customerLevel")
    }
  ]
}
