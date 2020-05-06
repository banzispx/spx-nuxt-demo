import enLocale from 'element-ui/lib/locale/lang/en';
const en = {
  ...enLocale,
  index: {
    title: 'Title',
    factory: {
      title: 'Dam Details',
      baseInfo: {
        Capacity: 'Capacity',
        Type: 'Type',
        Height: 'Height',
        Completion: 'Completion',
        Equipment: 'Equipment',
        Time: 'Time',
        Province: 'Province',
        Level: 'Level',
        Unit: 'Unit',
        Operation: 'Operation'
      },
      bar: {
        a: 'Monitor',
        b: 'Watch',
        c: 'Danger'
      }
    }
  },
  select: 'please choose',
  leftNavs:
    {
      index: 'index',
      singleDam: 'single dam',
      business: {
        title: 'total',
        subNav: {
          total: 'total',
          problem: 'problem',
          watch: 'watch',
          monitor: 'monitor',
          checkIn: 'checkIn'
        }
      }
    },
  login: {
    remember: 'auto login',
    login: 'login'
  }
};

export default en;
