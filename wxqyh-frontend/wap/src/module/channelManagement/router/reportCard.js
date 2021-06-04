// 成绩单
const reportCard = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/reportCard/reportCard')),
    'reportCard'
  )
const reportCardIndex = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/reportCard/index')),
    'reportCardIndex'
  )
const reportCardOfSales = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/reportCard/sales')),
    'reportCardOfSales'
  )
const reportCardOfAfterSales = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/reportCard/afterSales')),
    'reportCardOfAfterSales'
  )

const preview = r =>
    require.ensure(
        [],
        () => r(require('@/module/channelManagement/views/reportCard/preview')),
        'reportCardPreview'
    )

export default [
  {
    path: '/reportCard',
    name: 'reportCard',
    meta: { title: '首页' },
    component: reportCard,
    redirect: '/reportCard/index',
    children: [
      {
        path: '/reportCard/index',
        name: 'reportCardIndex',
        meta: { title: '成绩单' },
        component: reportCardIndex
      },
      {
        path: '/reportCard/sales',
        name: 'reportCardOfSales',
        meta: { title: '成绩单' },
        component: reportCardOfSales
      },
      {
        path: '/reportCard/afterSales',
        name: 'reportCardOfAfterSales',
        meta: { title: '成绩单' },
        component: reportCardOfAfterSales
      },
      {
        path: '/reportCard/preview',
        name: 'preview',
        meta: { title: '成绩单' },
        component: preview
      }
    ]
  }
]
