<template>
  <section class="treeSvg">
    <div ref="svgSection" />
  </section>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      maxInt: 10000,
      dx: 300, // 水平方向上节点的位移
      dy: 50, // 垂直方向上节点的位移
      x0: 50, // 根节点x轴上的初始位置
      y0: 50, // 根节点y轴上的初始位置
      riskTreeInnerHtml: {}, // 作为风险源svg的innerHtml
      findnode: {}, // 表示当前找到的节点
      findnodeArr: [], // 表示当前节点到父节点的路径数组
      currentrootYmax: {},
      originRoot: {},
      riskSources: [
        {
          riskId: 0,
          riskType: '风险类型1',
          name: '风险源名称',
          riskStatement: ''
        }
      ],
      riskSourceMap: {
        0: [
          {
            id: 1,

            parentId: 0,
            riskSources: 0,
            name: '可能后果1'
          },
          {
            id: 2,

            parentId: 1,
            riskSources: 0,
            name: '可能后果2'
          },
          {
            id: 5,

            parentId: 1,
            riskSources: 0,
            name: '可能后果'
          },
          {
            id: 3,

            parentId: 1,
            riskSources: 0,
            name: '可能后果3'
          },
          {
            id: 4,

            parentId: 3,
            riskSources: 0,
            name: '可能后果4'
          }
        ]
      },
      riskSourceDetailMap: {
        1: {
          volumnOfEarch: 0,
          imgUrl: '/resources/1577427487133-龙羊峡.jpg',
          level: '较大风险',
          levelValue: 12,
          riverDistance: 0,
          possibleResultName: '可能后果4'
        }
      }
    };
  },
  mounted() {
    const that = this;
    // 注册全局的方法，然后再调用本地的方法
    window.delNode = function (nodeId, nodeRiskId, nodeRiskSourcesId) {
      that.delNodeConf(nodeId, nodeRiskId, nodeRiskSourcesId);
    };
    window.addNode = function (nodeId, nodeRiskId) {
      that.addNode(nodeId, nodeRiskId);
    };
    window.editNode = function (nodeId, nodeRiskId) {
      that.editNode(nodeId, nodeRiskId);
    };
    // this.findRiskSourceDetail();
    // 处理接受过来的risksources参数
    this.riskTreeList = this.dealRiskSources(this.riskSources, this.riskSourceMap, this.riskSourceDetailMap);
    this.initSvg(this.riskTreeList);
    // 下面是测试
    // this.getText();
  },
  methods: {
    ...mapActions('svg', [
      'getToken', 'getData'
    ]),
    async getText() {
      const params = {
        client_secret: '8b5032524c3d6a649cacf04781628396450bce0f6e07280a',
        client_id: '9f70d0b207d2419eb927ba939847d1a3',
        grant_type: 'client_credentials'
      };
      const res = await this.getToken(params);
      console.log(res.data.access_token, 'res22354');
      this.getData(res.data).then(res => {
        if (res.status === 200) {
          console.log(res.data, 'data');
        }
      });
      this.$axios({
        method: 'get',
        url: '/huawei/service/GRKJ__Rain/0.1.0/queryNewRainMonitor?addvcd&bsnm&stcds',
        headers: {
          'access-token': res.data.access_token
        }
      }).then(res => {
        if (res.status === 200) {
          console.log(res.data, 'data');
        }
      });
    },
    // 处理传入数据的父子关系，组装成树形结构
    dealRiskSources(riskSources, riskSourceMap, riskSourceDetailMap) {
      const riskTreeList = [];
      for (let index = 0; index < riskSources.length; index++) {
        const riskSource = riskSources[index];
        const riskSourceDetail = riskSourceDetailMap[riskSource.riskId];
        riskSource.parent = null;
        riskSource.children = [];
        if (riskSourceDetail) {
          riskSource.level = riskSourceDetail.level;
          riskSource.riverDistance = riskSourceDetail.riverDistance;
          riskSource.volumnOfEarch = riskSourceDetail.volumnOfEarch;
          riskSource.possibleResultName = riskSourceDetail.possibleResultName;
        }
        const riskSourceLists = riskSourceMap[riskSource.riskId];
        for (let index = 0; index < riskSourceLists.length; index++) {
          const riskSourceList = riskSourceLists[index];
          riskSourceList.children = [];
          if (riskSourceList.parentId === 0) {
            riskSourceList.parent = riskSource;
            riskSource.children.push(riskSourceList);
          }
          for (let index = 0; index < riskSourceLists.length; index++) {
            const element = riskSourceLists[index];
            if (element.parentId === riskSourceList.id) {
              element.parent = riskSourceList;
              riskSourceList.children.push(element);
            }
          }
        }
        // console.log(riskSource);
        riskTreeList.push(riskSource);
      }
      return riskTreeList;
    },
    // 根据传入的数据实现嵌套深度 和 height  计算
    calcLayerAndHeight(node, parent) {
      // node.parent = parent;
      node.layer = parent === null ? 1 : parent.layer + 1;
      const { children } = node;
      const n = children.length;
      if (n === 0) {
        node.height = 0;
        return;
      }
      node.height = n - 1;
      for (let i = 0; i < n; i++) {
        this.calcLayerAndHeight(children[i], node);
        node.height += children[i].height;
      }
    },
    // 根据height生成节点的 ymin和 ymax
    calcYminandYmax(node) {
      // 设置当前选择节点的ymax
      if (node.parent === null) {
        this.currentrootYmax[node.riskId] = node.height / 2;
        node.ymin = -node.height / 2;
        node.ymax = node.height / 2;
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (i === 0) {
            child.ymin = node.ymin;
            child.ymax = node.ymin + node.children[0].height;
          } else {
            child.ymin = node.children[i - 1].ymax + 1;
            child.ymax = child.ymin + child.height;
          }
          if (child.children && child.children.length > 0) {
            this.calcYminandYmax(child);
          }
        }
      }
    },
    // 计算节点在x轴和Y轴上的位置
    calcYandX(node, rootnode) {
      // const { dx, dy, x0, y0 } = this;
      const dx = this.dx;
      const dy = this.dy;
      const x0 = this.x0;
      const y0 = this.y0;
      if (node.parent === null) {
        node.y = node.ymax * dy + y0;
        node.x = (node.layer - 1) * dx + x0; // 设置在x轴的坐标
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          child.y =
            ((child.ymin + child.ymax) / 2 + this.currentrootYmax[rootnode.riskId]) * dy + y0;
          child.x = (child.layer - 1) * dx + x0; // 设置在x轴的坐标
          if (child.children && child.children.length > 0) {
            this.calcYandX(child, rootnode);
          }
        }
      }
    },
    drawTree(node, rootnode) {
      node.children.forEach((c, i) => {
        this.drawLine(node, c, rootnode);
        this.drawTree(c, rootnode);
      });
      this.drawNode(node, rootnode);
    },
    // 画节点，第一个参数为要画的节点 第二个为根节点
    drawNode(node, rootnode) {
      this.riskTreeInnerHtml[rootnode.riskId] += `<rect x="${node.x}" y="${node.y}" rx="2" ry="2" width="150" height="40" 
      style="fill:rgb(255,255,255);stroke-width:2;stroke:rgba(255,208,165,0.5);
      fill-opacity:0.1;stroke-opacity:0.9;opacity:0.9;"></rect>
      <foreignObject class="nodeObj" x="${node.x}" y="${node.y +
        15}"  width="150" height="40" transform="translate(-1,-15)" >
        <div class="nodeObj">
          <span class="tip-img">
            ${node.name.length > 6 ? `${node.name.slice(0, 5)}...` : `${node.name}`}
            ${node.name121 ? '' : `<div class="prompt-box"><p class="prompt-box-title">${node.name}</p>
                              <p class="prompt-box-content"><span>节点ID:${node.id || node.riskId}</span> </p>
                              <p class="prompt-box-content"></p>
                              </div>
            `}
          </span>
          <span class="caozuo" >
            <span class="edit"><span class="editImg" onclick="editNode(${node.id}, ${node.riskId})"></span>
              <div class="item">
                编辑
              </div>
            </span>
            <span class="btnadd" onclick="addNode(${node.id}, ${node.riskId})"><span style="font-size:25px"> + </span>
              <div class="item" >
                新增
              </div>
            </span>
            <span class="del" onclick="delNode(${node.id}, ${node.riskId},${node.riskSources})"> <span style="font-size:25px"> × </span>
              <div class="item" >
                删除
              </div>
            </span>
          </span>
        </div>
      </foreignObject>
      `;
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          this.drawNode(child, rootnode);
        }
      }
    },
    // 根据风险源的riskID获取风险源的信息
    async findRiskSourceDetail(riskId, damId) {
      const param = {
        riskId: riskId * 1,
        damId: damId * 1
      };
      let result = {};
      await this.$axios
        .post(
          '/jsonrpc/RiskSource.findRiskSourceDetail',
          param
        )
        .then(res => {
          // console.log(res.data, 'res.data');
          // re(res.data);
          result = res.data;
        });
      return result;
    },
    // 在指定的左右两个节点中画线 第三个参数为根节点
    drawLine(node1, node2, rootnode) {
      // 第一个参数是父节点 第二个参数是孩子节点
      // 第一个节点的右中 第二个节点的左中
      const { x: x1, y: y1 } = node1;
      const { x: x2, y: y2 } = node2;
      const leftx = x1 + 150;
      const lefty = y1 + 20;
      const rightx = x2;
      const righty = y2 + 20;
      const dx = Math.abs(rightx - leftx);
      // const dy = Math.abs(-righty + lefty);
      const percent = 0.5; // 规定上下点所占长度占dx的百分比
      const topx = rightx - percent * dx;
      const topy = righty;
      const btmx = leftx + percent * dx;
      const btmy = lefty;
      this.riskTreeInnerHtml[rootnode.riskId] += `<path d="M ${leftx} ${lefty} C ${btmx} ${btmy} ${topx} ${topy} ${rightx} ${righty}" stroke="#B8B8B8" stroke-dasharray="10,10" stroke-width="2" fill="none" />`;
    },
    // 删除节点确认
    delNodeConf(nodeId, nodeRiskId, nodeRiskSourcesId) {
      // let that = this;
      this.$confirm(
        '该项的所有分支都会被删除，您确定要删除吗?',
        '删除风险/风险源',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 执行删除节点的操作
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.delNode(nodeId, nodeRiskId, nodeRiskSourcesId);
        });
    },
    // 删除节点的操作 添加节点 编辑节点
    delNode(nodeId, nodeRiskId, nodeRiskSourcesId) {
      if (nodeId) {
        // 说明是不是根节点
        const findindex = this.riskSourceMap[nodeRiskSourcesId].findIndex(item => item.id * 1 === nodeId * 1);
        this.riskSourceMap[nodeRiskSourcesId].splice(findindex, 1);
        this.riskTreeList = this.dealRiskSources(this.riskSources, this.riskSourceMap, this.riskSourceDetailMap);
        this.initSvg(this.riskTreeList);
      } else {
        // 说明是根节点
        const findindex = this.riskSources.findIndex(item => item.riskId * 1 === nodeRiskId * 1);
        this.riskSources.splice(findindex, 1);
        this.riskTreeList = this.dealRiskSources(this.riskSources, this.riskSourceMap, this.riskSourceDetailMap);
        this.initSvg(this.riskTreeList);
      }
    },
    addNode(nodeId, nodeRiskId) {
      console.log(nodeId, nodeRiskId);
      if (nodeId) {
        // 说明是不是根节点
        this.riskSourceMap[0].push(
          {
            id: ++this.maxInt,
            parentId: nodeId,
            riskSources: 0,
            name: `可能后果${++this.maxInt}`
          }
        );
        this.riskTreeList = this.dealRiskSources(this.riskSources, this.riskSourceMap, this.riskSourceDetailMap);
        this.initSvg(this.riskTreeList);
      } else {
        // 说明是根节点
        this.riskSourceMap[0].push(
          {
            id: ++this.maxInt,
            parentId: 0,
            riskSources: 0,
            name: `可能后果${++this.maxInt}`
          }
        );
        this.riskTreeList = this.dealRiskSources(this.riskSources, this.riskSourceMap, this.riskSourceDetailMap);
        this.initSvg(this.riskTreeList);
      }
    },
    editNode(nodeId, nodeRiskId) {
      // this.$emit('editSvgNode', nodeId, nodeRiskId);
      console.log(nodeId, nodeRiskId);
    },
    // 根据id删除Json数据中的指定节点
    findJson(svgJson, nodeId) {
      if (svgJson.title * 1 === nodeId * 1) {
        this.findnode = svgJson;
        return this.findnode;
      } else {
        for (let index = 0; index < svgJson.children.length; index++) {
          const element = svgJson.children[index];
          this.findJson(element, nodeId);
        }
      }
    },
    // 根据找到的节点 确定到其根节点的路径 并保存在路径数组里面
    findParentArr(node) {
      const title = node.title;
      if (node.parent) {
        for (let index = 0; index < node.parent.children.length; index++) {
          const element = node.parent.children[index];
          if (element.title === title) {
            this.findnodeArr.push(index);
          }
        }
        this.findParentArr(node.parent);
      }
    },
    // 初始化svg
    initSvg(root) {
      // console.log(root, 'root');
      // 首先清除svgSection 接着生成innerhtml数组
      this.$refs.svgSection.innerHTML = '';
      this.riskTreeInnerHtml = []; // 在此需要清空innerHtml数组
      // console.log(root.length, 'root.length111');
      for (let index = 0; index < root.length; index++) {
        const element = root[index];
        this.calcLayerAndHeight(element, null);
        this.calcYminandYmax(element);
        this.calcYandX(element, element);
        this.drawTree(element, element);
      }
      for (let index = 0; index < this.riskTreeList.length; index++) {
        const element = this.riskTreeList[index];
        this.$refs.svgSection.innerHTML += `
          <svg
            width="1500px"
            height="400px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >${this.riskTreeInnerHtml[element.riskId]}</svg>
        `;
      }
    }
  }
};
</script>
<style lang="scss">
.treeSvg {
  // box-sizing: border-box;
  overflow: scroll;
  width: auto;
  min-height: 800px;
  background-color: #ffffff;
  margin: 20px;
 .editImg{
  display: inline-block;
  width: 14px;
  height: 14px;
  background-color: aqual;
  background-image: url(/images/edit.png) ;
  background-size:100% 100%;
}
.nodeObj {
  display: flex;
align-items: baseline;
  line-height: 40px;
  color: #f89b46;
  height: 150px;
  width: 200px;
  .caozuo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 48px;
    // margin-right: 9px;
    // margin-left: 13px;
  }
}
.tip-img {
  width: 98px;
  padding-left: 5px;
  position: relative;
  cursor: pointer;
  font-size: 15px;
}
.prompt-box {
  background-color: #ffffff;
  width: 198px;
  position: absolute;
  left: 0px;
  top: 45px;
  display: none;
  border: 1px solid rgba(199, 199, 199, 1);
  box-shadow: 0px 2px 18px 0px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  opacity: 0.8;
  box-sizing: border-box;
  font-weight: 400;
  cursor: pointer;
}
.prompt-box-title {
  font-size: 12px;
  padding: 0 2px;
  background-color: #eaeaea;
  width: 100%;
  font-weight: 500;
  color: #434a58;
}
.prompt-box p {
  padding: 0 2px;
  margin: 0;
  font-size: 12px;
  padding: 0;
  line-height: 19px;
  color: rgba(67, 74, 88, 1);
}
.tip-img:hover .prompt-box {
  display: inline-block;
}
.edit,
.btnadd,
.del {
  // display: inline-block;
  position: relative;
  cursor: pointer;
  .item {
    position: absolute;
    left: 0px;
    top: 32px;
    width: 50px;
    height: 31px;
    text-align: center;
    line-height: 31px;
    border-radius: 2px;
    border: 1px solid silver;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
    font-weight: 400;
    color: rgba(67, 74, 88, 1);
    display: none;
  }
}
.edit:hover .item {
  display: inline-block;
}
.btnadd:hover .item {
  display: inline-block;
}
.del:hover .item {
  display: inline-block;
}
}
</style>
