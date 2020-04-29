/*eslint-disable*/
import pdfViewer from 'vue-instant-pdf-viewer';
import Vue from 'vue';
import '@/assets/js/pdfobject';

// ztree
import 'ztree';
import { Message } from 'element-ui';

import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import download from 'downloadjs';

Vue.component('pdfViewer', pdfViewer);

// bus 传值
Vue.prototype.bus = new Vue();
export default ({ store }) => {
  Vue.prototype.exportTable = (id, title) => {
    /* generate workbook object from table */
    // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
    let fix = document.querySelector('.el-table__fixed-right');
    let wb;
    if (fix) {
      wb = XLSX.utils.table_to_book(document.querySelector(id).removeChild(fix));
      document.querySelector(id).appendChild(fix);
    } else {
      wb = XLSX.utils.table_to_book(document.querySelector(id));
    }
    /* get binary string as output */
    let wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'array'
    });
    try {
      FileSaver.saveAs(
        new Blob([wbout], {
          type: 'application/octet-stream'
        }),
        title
      );
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, wbout);
    }
    return wbout;
  };
  Vue.prototype.exportExcel = (type, fileName, params, isStatistics) => {
    let file = fileName.replace('.xls', '');
    if (isStatistics) {
      store.dispatch('download/getDownloadStatisticsExcel', { type: type, param: params }).then(res => {
        if (res.size === 0) {
          Message.error(`暂无${file}`);
        } else {
          download(res.data, fileName);
        }
      });
    } else {
      return store.dispatch('download/getDownloadExcel', { type: type, param: params }).then(res => {
        if (res.size === 0) {
          Message.error(`暂无${file}`);
        } else {
          download(res.data, fileName);
        }
        resolve();
      });
    }
  };

  Vue.prototype.previewFile = (fileObj) => {
    if (fileObj.fileType === '.pdf' || fileObj.fileExt === '.pdf' || fileObj.fileType === '.PDF') {
      store.commit('setFileObj', fileObj);
      store.commit('setPreviewFullscreen', true);
    } else {
      const a = document.createElement('a'); // 创建a标签
      a.setAttribute('download', '');// download属性
      a.setAttribute('href', `http://dam.spic.com.cn/api/file/download?mongoId=${fileObj.address ? fileObj.address : fileObj.mongoId}`);// href链接
      a.click();// 自执行点击事件
    }
    return true;
  };
};
