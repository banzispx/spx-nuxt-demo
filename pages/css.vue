<template>
  <section class="container px-4">
    <div v-for="(list, listIndex) in lists" :key="listIndex">
      <h5>{{ list.name }}</h5>
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in list.items"
          :key="index"
          :span="4"
          class="line-height-30 height-3 my-2"
        >
          <div :class="item">
            {{ item }}
          </div>
        </el-col>
      </el-row>
    </div>
    <h5>padding、margin(1-20)</h5>
    <el-row>
      <el-col
        v-for="(item, index) in pm"
        :key="index"
        :span="index < 2 ? 3 : 5"
        class="m-2"
      >
        {{ item }}
      </el-col>
    </el-row>
    <h5>overflow</h5>
    <el-row>
      <el-col
        v-for="(item, index) in overflow"
        :key="index"
        :span="5"
        class="m-2"
      >
        {{ item }}
      </el-col>
    </el-row>
    <h5>width、height(width,height: 0-80, w, h: 0-100)</h5>
    <el-row>
      <el-col v-for="(item, index) in size" :key="index" :span="5" class="m-2">
        {{ item }}
      </el-col>
    </el-row>
  </section>
</template>
<script>
export default {
  layout: 'none',
  data() {
    return {
      lists: [
        {
          name: '字体颜色',
          items: [
            'text-primary',
            'text-primary-alt',
            'text-primary-lighter',
            'text-secondary',
            'text-info',
            'text-info-alt',
            'text-success',
            'text-success-alt',
            'text-success-light',
            'text-warning',
            'text-warning-alt',
            'text-warning-light',
            'text-warning-light1',
            'text-danger',
            'text-black',
            'text-black-light',
            'text-black-light1',
            'text-gray',
            'text-gray-dark',
            'text-gray-light',
            'text-gray-light1',
            'text-gray-light3',
            'text-white',
            'text-info-light',
            'text-info-light2',
            'text-first',
            'text-second',
            'text-third',
            'text-disease',
            'text-dangerous',
            'text-indigo',
            'text-purple'
          ]
        },
        {
          name: '背景颜色',
          items: [
            'bg-linear',
            'bg-linear-primary',
            'bg-linear-success',
            'bg-linear-indigo',
            'bg-linear-warning',
            'bg-linear-danger',
            'bg-primary',
            'bg-primary-light',
            'bg-primary-light1',
            'bg-secondary',
            'bg-secondary-alt',
            'bg-secondary-light',
            'bg-info',
            'bg-success',
            'bg-success-alt',
            'bg-warning',
            'bg-warning-alt',
            'bg-danger',
            'bg-black',
            'bg-gray-light',
            'bg-gray-light2',
            'bg-gray-light3',
            'bg-white',
            'bg-info-light',
            'bg-blue-light',
            'bg-indigo'
          ]
        },
        {
          name: 'font-size(10-60)',
          items: ['text-10', 'text-13', 'text-60']
        },
        {
          name: 'line-height',
          items: [
            'line-height',
            'line-height-20',
            'line-height-25',
            'line-height-30',
            'line-height-35',
            'line-height-40',
            'line-height-50',
            'line-height-70'
          ]
        },
        {
          name: 'vertical-align',
          items: [
            'align-baseline',
            'align-top',
            'align-middle',
            'align-bottom',
            'align-text-bottom',
            'align-text-top'
          ]
        },
        {
          name: 'border',
          items: [
            'border-top',
            'border-bottom',
            'border border-x',
            'border border-y',
            'border border-top-0',
            'border border-sm',
            'border border-md',
            'border border-lg',
            'border border-xl',
            'border border-color-primary',
            'border border-color-danger',
            'border rounded',
            'border rounded-15',
            'border rounded-circle'
          ]
        },
        {
          name: 'display',
          items: [
            'd-none',
            'd-inline',
            'd-inline-block',
            'd-block',
            'd-table',
            'd-table-cell',
            'd-flex',
            'd-inline-flex'
          ]
        },
        {
          name: 'float',
          items: ['fl', 'fr', 'fn']
        },
        {
          name: 'opacity(0-100)',
          items: ['opacity-10', 'opacity-50', 'opacity-100']
        },
        {
          name: 'position',
          items: [
            '.position-fixed',
            'position-relative',
            'position-absolute',
            'position-static'
          ]
        },
        {
          name: 'headline',
          items: [
            'headline-primary',
            'headline-secondary',
            'headline-info',
            'headline-success',
            'headline-success-alt',
            'headline-warning',
            'headline-danger',
            'headline-black'
          ]
        }
      ],
      pm: [
        '.pl-1: (padding-left: 5px)',
        '.ml-1: (margin-left: 5px)',
        '.mx-2: (margin-left, margin-right)',
        '.my-2: (margin-top, margin-bottom)',
        'm-1: (margin)'
      ],
      size: [
        '.width-1: (width: 10px)',
        '.height-80: (height: 800px)',
        '.w-10: (width: 10%)',
        '.h-50: (height: 50%)',
        '.full-width: (width: 100%)',
        '.minw-100: (min-width: 100%)'
      ],
      overflow: [
        'of-auto: (overflow: auto)',
        'ofx-hidden: (overflow-x: hidden)',
        'ofy-scroll: (overflow-y: scroll)'
      ]
    };
  }
};
</script>
