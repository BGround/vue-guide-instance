export default {
  distributorRouter: {
    path: '/archivesList',
    component: resolve => require(['../../views/content'], resolve),
    children: [
      {
        name: 'archivesList',
        path: 'index',
        component: resolve =>
          require(['../../views/distributorArchives/index'], resolve)
      },
      {
        name: 'archivesMap',
        path: 'archivesMap',
        component: resolve =>
          require(['../../views/distributorArchives/distributorMap'], resolve)
      },
      {
        name: 'archivesBag',
        path: 'archivesBag',
        component: resolve =>
          require(['../../views/distributorArchives/archivesBag'], resolve)
      },
      {
        name: 'schoolReport',
        path: 'schoolReport',
        component: resolve => require(['../../views/schoolReport'], resolve)
      },
      {
        name: 'schoolReportDes',
        path: 'schoolReportDes',
        component: resolve =>
          require(['../../views/schoolReport/detail'], resolve)
      },
      {
        name: 'feedbackApproval',
        path: 'feedbackApproval',
        component: resolve =>
          require(['../../views/schoolReport/feedbackApproval'], resolve)
      },
      // {
      //   name: 'openSchoolReportDes',
      //   path: 'openSchoolReportDes',
      //   component: resolve =>
      //     require(['../../views/schoolReport/detail'], resolve)
      // },
      {
        name: 'afterSchoolReport',
        path: 'afterSchoolReport',
        component: resolve => require(['../../views/afterSchoolReport'], resolve)
      },
      {
        name: 'afterSchoolReportDes',
        path: 'afterSchoolReportDes',
        component: resolve =>
          require(['../../views/afterSchoolReport/detail'], resolve)
      },
      {
        name: 'competingManagement',
        path: 'competingManagement',
        component: resolve =>
            require(['../../views/competingManagement/index'], resolve)
      },
      {
        name: 'addCompeting',
        path: 'addCompeting',
        component: resolve =>
            require(['../../views/competingManagement/addCompeting'], resolve)
      },
      {
        name: 'newMessage',
        path: 'newMessage',
        component: resolve =>
            require(['../../views/competingManagement/newMessage'], resolve)
      },
      {
        name: 'leaderManagement',
        path: 'leaderManagement',
        component: resolve =>
        require(['../../views/leaderManagement/index'], resolve)
      },
      {
        name: 'editLeader',
        path: 'editLeader',
        component: resolve =>
        require(['../../views/leaderManagement/editLeader'], resolve)
      },
      {
        name: 'leaderManagementSale',
        path: 'leaderManagementSale',
        component: resolve =>
        require(['../../views/leaderManagementSale/index'], resolve)
      },
      {
        name: 'editLeaderSale',
        path: 'editLeaderSale',
        component: resolve =>
        require(['../../views/leaderManagementSale/editLeader'], resolve)
      }
    ]
  }
}
