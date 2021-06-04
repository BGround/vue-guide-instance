const serviceNetwork = resolve =>
  require([
    "@/module/channelManagement/views/planningInfo/serviceNetwork"
  ], resolve);
const planningInfo = resolve =>
  require(["@/module/channelManagement/views/planningInfo/container"], resolve);
const networkSearch = resolve =>
  require([
    "@/module/channelManagement/views/planningInfo/networkSearch"
  ], resolve);

const importServiceNetwork = resolve =>
  require([
    "@/module/channelManagement/views/planningInfo/importServiceNetwork"
  ], resolve);
const serviceNetworkEdit = resolve =>
  require([
    "@/module/channelManagement/views/planningInfo/serviceNetworkEdit"
  ], resolve);

export default {
  path: "/planningInfo",
  name: "planningInfo",
  component: planningInfo,
  children: [
    {
      path: "/planningInfo/serviceNetwork",
      name: "serviceNetwork",
      component: serviceNetwork,
      meta: {
        title: "服务网络规划管理"
      }
    },
    {
      path: "/planningInfo/networkSearch",
      name: "networkSearch",
      component: networkSearch,
      meta: {
        title: "网点距离查询"
      }
    },
    {
      path: "/planningInfo/importServiceNetwork",
      name: "importServiceNetwork",
      component: importServiceNetwork,
      meta: {
        title: "导入网点"
      }
    },
    {
      path: "/planningInfo/serviceNetworkEdit",
      name: "serviceNetworkEdit",
      component: serviceNetworkEdit,
      meta: {
        title: "编辑网点"
      }
    }
  ]
};
