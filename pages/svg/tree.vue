<template>
  <section class="treeSvg">
    <div ref="svgSection" />
  </section>
</template>
<script>
export default {
  data() {
    return {
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
          riskId: 1,
          damId: 371,
          damName: '新丰江',
          operator: '运行单位',
          supervisor: '主管单位',
          riskTypeId: 1,
          riskType: '风险类型1',
          name: '风险源名称',
          riskStatement: '',
          volumnOfEarch: 0,
          riverDistance: 0,
          latitude: 36.11944466068729,
          longitude: 100.91757774353027,
          riskLevelValue: 8,
          riskLevel: '一般风险',
          complexRiskLevel: 0,
          dailyResponse: '',
          danger: '',
          img: '/resources/1577427487133-龙羊峡.jpg',
          evaluationReports: [

          ],
          emergencyPlans: [

          ]
        }
      ],
      riskSourceMap: {
        1: [
          {
            id: 1,
            damId: 371,
            riskId: 1,
            parentId: 0,
            endPoint: 0,
            name: '可能后果1',
            eventTypeId: 6,
            eventType: '风险事件,泥石流',
            probability: 5,
            consequence: 3,
            riskLevelValue: 15,
            complexRiskLevel: 0,
            riskLevel: '较大风险',
            resultStatement: '',
            parameter1: '自选参数一',
            parameter2: '自选参数二',
            parameter3: '自选参数三',
            parameter4: '自选参数四',
            changeConditions: [
              {
                id: 1,
                possibleResultId: 1,
                damId: 371,
                name: '变化条件1.1',
                conditionTypeId: 1,
                conditionType: '地震',
                centerDistance: 150,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 0,
                monitoringPoint: '',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              },
              {
                id: 2,
                possibleResultId: 1,
                damId: 371,
                name: '变化条件1.2',
                conditionTypeId: 3,
                conditionType: '降雨',
                centerDistance: 0,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 2,
                monitoringPoint: 'xx监测点',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              }
            ],
            mark: 0
          },
          {
            id: 2,
            damId: 371,
            riskId: 0,
            parentId: 1,
            endPoint: 1,
            name: '可能后果2',
            eventTypeId: 6,
            eventType: '风险事件,泥石流',
            probability: 4,
            consequence: 2,
            riskLevelValue: 8,
            complexRiskLevel: 0,
            riskLevel: '一般风险',
            resultStatement: '',
            parameter1: '自选参数一',
            parameter2: '自选参数二',
            parameter3: '自选参数三',
            parameter4: '自选参数四',
            changeConditions: [
              {
                id: 3,
                possibleResultId: 2,
                damId: 371,
                name: '变化条件1-1 end.1',
                conditionTypeId: 1,
                conditionType: '地震',
                centerDistance: 150,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 0,
                monitoringPoint: '',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              },
              {
                id: 4,
                possibleResultId: 2,
                damId: 371,
                name: '变化条件1-1 end.2',
                conditionTypeId: 3,
                conditionType: '降雨',
                centerDistance: 0,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 2,
                monitoringPoint: 'xx监测点',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              }
            ],
            mark: 0
          },
          {
            id: 3,
            damId: 371,
            riskId: 0,
            parentId: 1,
            endPoint: 0,
            name: '可能后果3',
            eventTypeId: 6,
            eventType: '风险事件,泥石流',
            probability: 1,
            consequence: 5,
            riskLevelValue: 5,
            complexRiskLevel: 0,
            riskLevel: '一般风险',
            resultStatement: '',
            parameter1: '自选参数一',
            parameter2: '自选参数二',
            parameter3: '自选参数三',
            parameter4: '自选参数四',
            changeConditions: [
              {
                id: 5,
                possibleResultId: 3,
                damId: 371,
                name: '变化条件1-2.1',
                conditionTypeId: 1,
                conditionType: '地震',
                centerDistance: 150,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 0,
                monitoringPoint: '',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              },
              {
                id: 6,
                possibleResultId: 3,
                damId: 371,
                name: '变化条件1-2.2',
                conditionTypeId: 3,
                conditionType: '降雨',
                centerDistance: 0,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 2,
                monitoringPoint: 'xx监测点',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              }
            ],
            mark: 0
          },
          {
            id: 4,
            damId: 371,
            riskId: 0,
            parentId: 3,
            endPoint: 1,
            name: '可能后果4',
            eventTypeId: 6,
            eventType: '风险事件,泥石流',
            probability: 4,
            consequence: 3,
            riskLevelValue: 12,
            complexRiskLevel: 0,
            riskLevel: '较大风险',
            resultStatement: '',
            parameter1: '自选参数一',
            parameter2: '自选参数二',
            parameter3: '自选参数三',
            parameter4: '自选参数四',
            changeConditions: [
              {
                id: 7,
                possibleResultId: 4,
                damId: 371,
                name: '变化条件1-2.1',
                conditionTypeId: 1,
                conditionType: '地震',
                centerDistance: 150,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 0,
                monitoringPoint: '',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              },
              {
                id: 8,
                possibleResultId: 4,
                damId: 371,
                name: '变化条件1-2.2',
                conditionTypeId: 3,
                conditionType: '降雨',
                centerDistance: 0,
                levelMin: 5,
                levelMax: 7,
                monitoringTypeId: 2,
                monitoringPoint: 'xx监测点',
                possibilityChange: 1.5,
                independent: 0,
                lat: null,
                lng: null
              }
            ],
            mark: 0
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
    window.delNode = function (nodeId, nodeRiskId) {
      that.delNodeConf(nodeId, nodeRiskId);
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
  },
  methods: {
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
      // 根据nodeId是否存在判断是否是风险源 如果不存在 说明是 请求节点信息
      // if (!node.id) {
      //   // console.log(node);
      //   let riskDetail = await this.findRiskSourceDetail(node.riskId, this.damId);
      //   // riskDetail.then(res => {
      //   //   node.level = res.level;
      //   //   node.riverDistance = res.riverDistance;
      //   //   node.volumnOfEarch = res.volumnOfEarch;
      //   //   node.possibleResultName = res.possibleResultName;
      //   //   // console.log(res, 'res');
      //   // });
      //   // console.log(riskDetail, 54545);
      // }
      // <div class="prompt-box"><p class="prompt-box-title">${node.name}</p>
      // <p class="prompt-box-content"><span>可能后果:${node.possibleResultName}</span> <span>风险等级:${node.level}</span></p>
      // <p class="prompt-box-content"><span>方量:${node.riverDistance}</span><span>距大坝距离:${node.volumnOfEarch}</span></p>
      // </div>
      this.riskTreeInnerHtml[rootnode.riskId] += `<rect x="${node.x}" y="${node.y}" rx="2" ry="2" width="150" height="40" 
      style="fill:rgb(255,255,255);stroke-width:2;stroke:rgba(255,208,165,0.5);
      fill-opacity:0.1;stroke-opacity:0.9;opacity:0.9;"></rect>
      <foreignObject class="nodeObj" x="${node.x}" y="${node.y +
        15}"  width="150" height="40" transform="translate(-1,-15)" >
        <div class="nodeObj">
          <span class="tip-img">
            ${node.name.length > 6 ? `${node.name.slice(0, 5)}...` : `${node.name}`}
            ${node.id ? '' : `<div class="prompt-box"><p class="prompt-box-title">${node.name}</p>
                              <p class="prompt-box-content"><span>可能后果:${node.possibleResultName}</span> <span>风险等级:${node.level}</span></p>
                              <p class="prompt-box-content"><span>方量:${node.riverDistance}</span><span>距大坝距离:${node.volumnOfEarch}</span></p>
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
            <span class="del" onclick="delNode(${node.id}, ${node.riskId})"> <span style="font-size:25px"> × </span>
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
    delNodeConf(nodeId, nodeRiskId) {
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
          this.delNode(nodeId, nodeRiskId);
        });
    },
    // 删除节点的操作 添加节点 编辑节点
    delNode(nodeId, nodeRiskId) {
      console.log(nodeId, 'ndoeId', this.$parent);
      // let svgJson = _.cloneDeep(this.originRoot);
      // this.calcLayerAndHeight(svgJson, null);
      // // svgJson.children[0].children = [];
      // // 拿到处理后的Json数据
      // this.findJson(svgJson, nodeId);
      // // 找到到父节点的路径数组
      // this.findnodeArr = [];
      // this.findParentArr(this.findnode);
      // let rootToNodeArr = this.findnodeArr.reverse();
      // let drawJson;
      // if (rootToNodeArr.length === 0) {
      //   svgJson = {};
      // } else if (rootToNodeArr.length === 1) {
      //   svgJson.children.splice(rootToNodeArr[0], 1);
      // } else {
      //   for (let index = 0; index < rootToNodeArr.length; index++) {
      //     if (index === 0) {
      //       drawJson = svgJson.children[rootToNodeArr[index]];
      //     } else if (index === rootToNodeArr.length - 1) {
      //       drawJson.children.splice(rootToNodeArr[index], 1);
      //     } else {
      //       drawJson = drawJson.children[rootToNodeArr[index]];
      //     }
      //   }
      // }
      // this.initSvg(svgJson);
    },
    addNode(nodeId, nodeRiskId) {
      // this.$emit('addSvgNode', nodeId, nodeRiskId);
      console.log(nodeId, nodeRiskId);
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
