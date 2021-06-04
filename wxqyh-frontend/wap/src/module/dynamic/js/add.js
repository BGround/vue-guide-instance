var addUpdate = {
    // 获取详情、更新
  draftDetail: {
    // 更新 方法
    commitDraft: {
        draftFormData: {  // 更新 数据格式
            'userId': '',
            'tbXyhDynamicinfoPO.dynamicTypeId': '',
            'tbXyhDynamicinfoPO.title': '',
            'tbXyhDynamicinfoPO.summary': '',
            'tbXyhDynamicinfoPO.content': '',
            'tbXyhDynamicinfoPO.coverImage': '',
            'deptIds': '',
            'userIds': '',
            'tagIds': '',
            'mediaStr': '',
            'imageUrlStr': '',
            'tbXyhDynamicinfoPO.voiceId': '',
            'range': '1',
            'tbXyhDynamicinfoPO.isSecret': 0,
            'tbXyhDynamicinfoPO.isDisplayCoverImage':0,   // 开启0 关闭1
            'tbXyhDynamicinfoPO.isComment': 0,            // 开启0 关闭1
            'tbXyhDynamicinfoPO.isSendMsg': 1,
            'tbXyhDynamicinfoPO.isOpen': 0,
            'tbXyhDynamicinfoPO.shareComment': 0,
            'tbXyhDynamicinfoPO.isSendTodo': 1,
            'tbXyhDynamicinfoPO.isWatermark':0

        }
    },
  },
    // 新建发布
    add: {
        publish:{
            url: '/portal/dynamicinfomanage/dynamicinfomanageAction!saveAndPublish.action?belongAgent='
        },
        save: {
            url: '/portal/dynamicinfomanage/dynamicinfomanageAction!addtbXyhDynamicinfoPO.action?belongAgent='
        },
        // 类型
        dynamicTemplate: {
            show: true,
            data: []
        },
        
        //图片数据
        imgUpload: {
            picList: [],
        },
        // 语音音频
        voiceUpload: {
            mediaList: [],
        },
        // 附件
        fileUpload: {
            mediaList: [],
        },
        // 高级设置
        advancedSetting: {
            switchControl: [ // 内容
                {content: '保密信息', onOff: false, show:true},
                {content: '将封面图片（第一张显示在正文中）', onOff: true, show:true},
                {content: '开启评论功能', onOff: true, show:true},
                {content: '发布时发送通知信息', onOff: true, show:true},
                {content: '开启外部分享', onOff: false, show:true},
                {content: '外部分享显示评论', onOff: false, show:false},
                {content: '推送待办通知', onOff: true, show:true},
                {content: '消息背景水印', onOff: false, show:true}
            ],
            levelData: {
                show: false,
                data:[]
              },
        },
        switchText:{
            0: 'isSecret',
            1: 'isDisplayCoverImage',
            2: 'isComment',
            3: 'isSendMsg',
            4: 'isOpen',
            5: 'shareComment',
            6: 'isSendTodo',
            7: 'isWatermark'
        }
    }
}
export default addUpdate;