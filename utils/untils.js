const SERVER_IP = 'http://dam.spic.com.cn/v1/#/';
export const linkTo = (page, params) => {
  const token = window.sessionStorage.getItem('token');
  const user = window.sessionStorage.getItem('userInfo');
  const url = SERVER_IP + page + '?otToken=' + token + '&user=' + user + '&temp=' + (params ? JSON.stringify(params) : null);
  if (page.indexOf('singleDamExtend') > -1) {
    window.open(page);
  } else {
    window.open(url);
  }
};

export const rolePowerList = (powerId, store) => {
  const rolePowerList = store.auth.user.authorities.length === 0 ? JSON.parse(sessionStorage.getItem('manageRolePower')) : store.auth.user.authorities;
  let ownFlag;
  (rolePowerList || []).map(item => {
    if (item === powerId) {
      ownFlag = true;
    }
  });
  return ownFlag;
};

// 判断角色是否有权限
export const rolePower = (powerId, store) => {
  return rolePowerList(powerId, store);
};

export const findBaseCode = (value, baseType, store) => {
  if ((value !== 0 && !value) || value === null) return '';
  const typeList = [];
  let baseName;
  store.state.baseCodes.map(type => {
    if (baseType === type.baseType) typeList.push(type);
  });
  typeList.map(item => {
    if (item.baseCode === value) baseName = item.baseName;
  });
  return baseName;
};

// 预览文件
export async function previewFile(fileObj, store) {
  if (fileObj.fileType === '.pdf' || fileObj.fileExt === '.pdf' || fileObj.fileType === '.PDF' || fileObj.fileSuffix === '.pdf') {
    store.commit('setFileObj', fileObj);
    store.commit('setPreviewFullscreen', true);
  } else {
    const a = document.createElement('a'); // 创建a标签
    a.setAttribute('download', '');// download属性
    a.setAttribute('href', `http://dam.spic.com.cn/api/file/download?mongoId=${fileObj.address ? fileObj.address : fileObj.mongoId}`);// href链接
    a.click();// 自执行点击事件
  }
  return true;
}
/**
 * 递归函数
 * 遍历树形数组或对象
 * @param data {Object | Array} 传入的数组或者对象
 * @param params {String} 需要遍历的内容
 * @param proxy {String} 需要赋值的内容
 * @return {Array} 返回需要的内容集合
 */
export const recursion = (data, params) => {
  const _arr = [];
  // 数组
  const _aFunc = (data) => {
    if (!Array.isArray(data)) return;
    for (let i = 0; i < data.length; i++) {
      _arr.push(data[i]);
      _aFunc(data[i][params]);
    }
  };
  // 对象
  const _aFuncObj = (data) => {
    if (!(Object.prototype.toString.call(data) === '[object Object]')) return;
    _arr.push(data);
    _aFuncObj(data[params]);
  };
  data && Array.isArray(data) ? _aFunc(data) : _aFuncObj(data);
  return _arr;
};
