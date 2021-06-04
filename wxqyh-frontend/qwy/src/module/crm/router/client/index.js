const client = {
  path: "client",
  name: "client",
  redirect: "client/list",
  component: () => import("crm/views/crm/client"),
  children: [
    {
      path: "list",
      name: "clientList",
      component: () => import("crm/views/crm/client/list"),
      meta: {
        role: "crm"
      }
    },
    {
      path: "operate",
      name: "clientOperate",
      component: () => import("crm/views/crm/client/operate/operate"),
      meta: {
        role: "crm"
      }
    }
  ]
};
export default client;
