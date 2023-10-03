// 常量枚举定义

// 使用示例1（标准模式）：new EnumFactory({ normal: { text: '正常', type: 'success' }, disable: { text: '下架', type: 'warning' } }),
// 使用示例1（数字key，需提供转换函数）：new EnumFactory({ 1: { text: '男', type: 'priary' }, 2: { text: '女', type: 'warning' }, 9: { text: '其他', type: 'info' } },parseInt),
// 使用示例3(简单模式)：{ left: '左对齐', center: '居中', right: '右对齐' }

import EnumFactory from "@/utils/enumFactory"
// type: success/info/warning/danger
/**
 * 性别枚举对象
 */
export const enumGender = new EnumFactory({
  1: { text: '男', type: 'primary' },
  2: { text: '女', type: 'warning' },
  9: { text: '其他', type: 'info' },
}, parseInt)

/**
 * 使用状态
 */
export const enumState = new EnumFactory({
  normal: { text: '启用', type: 'success' },
  disable: { text: '禁用', type: 'danger' }
})

/**
 * 菜单资源类型
 */
export const enumPermission = new EnumFactory({
  catalog: { text: '目录', type: 'warning' },
  menu: { text: '菜单', type: 'primary' },
  button: { text: '按钮', type: 'info' }
})

/**
 * 菜单项类型
 */
export const enumMenuType = new EnumFactory({
  default: { text: '选项卡', type: 'primary' },
  link: { text: '外链', type: 'danger' },
  iframe: { text: '内链', type: 'warning' }
})

