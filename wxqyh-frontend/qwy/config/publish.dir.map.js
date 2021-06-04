/**
 * 发布目录映射，用于单独发布超级子应用到某个指定目录
 */

const path = require('path')
const config = require('./index')

const basePath = config.build.assetsRoot,
  defPath = path.join(basePath, '/vm'),
  map = {
    'all': defPath,
    'base': defPath,
    'crm': path.join(basePath, '/vm_crm'),
    'form': path.join(basePath, '/vm_from')
  };

module.exports = map;

