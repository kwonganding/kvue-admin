// 常量枚举定义
// 使用示例1：const bookStatus = new EnumFactory({ normal: { text: '正常', type: 'success' }, disable: { text: '下架', type: 'warning' } }),
// 使用示例2：{ left: '左对齐', center: '居中', right: '右对齐' }
// type 为elementui中的状态type	类型	string	success/info/warning/danger

import EnumFactory from "@/utils/enumFactory";

/**
 * 性别枚举对象
 */
export const enumGender = new EnumFactory({
  male: { text: '男', type: 'priary' },
  female: { text: '女', type: 'warning' },
  other: { text: '其他', type: 'info' },
})

/**
 * 使用状态
 */
export const enumUse = new EnumFactory({
  enable: { text: '启用', type: 'success' },
  disable: { text: '禁用', type: 'danger' }
})





