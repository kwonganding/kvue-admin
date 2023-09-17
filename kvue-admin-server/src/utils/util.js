
/**
 * 下划线命名>>小驼峰命名
 * @param {*} name create_time
 * @returns createTime
 */
function line2came(name) {
  return name.replace(/_([a-z])/g, function(match, group) {
    return group.toUpperCase();
  });
}

/**
 * 小驼峰命名>>下划线命名
 * @param {*} name createTime
 * @returns create_time
 */
function came2line(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}


module.exports = { came2line, line2came }