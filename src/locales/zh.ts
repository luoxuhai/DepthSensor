const zh = {
  common: {
    ok: '好的',
    confirm: '确认',
    cancel: '取消',
    back: '返回',
    enable: '启动',
    disable: '禁用',
    enabled: '已启动',
    disabled: '已禁用',
    closed: '已关闭',
    opened: '已打开',
    close: '关闭',
    done: '完成',
    share: '分享',
    appName: '深度传感器检测',
  },
  app: {
    device: '设备型号',
    position: {
      title: '位置',
      front: '前置',
      back: '后置',
    },
    resolution: '分辨率',
    fov: {
      title: '视场角',
      horizontal: '水平视场角',
      vertical: '垂直视场角',
    },
    format: '输出格式',
    number: '深度传感器',
    support: '该设备支持深度传感器',
    notSupport: '该设备不支持深度传感器',
  },
};

export default zh;

export type Translations = typeof zh;
