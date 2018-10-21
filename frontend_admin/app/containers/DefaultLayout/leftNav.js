export default {
  items: [
    {
      name: 'Dashboard',
      url: '/',
      icon: 'icon-speedometer',
    },
    {
      name: 'Thành viên',
      url: '/users',
      icon: 'fa fa-database',
      children: [
        {
          name: 'Thành viên',
          url: '/users',
          icon: 'fa fa-table',
        },
      ],
    },
    {
      name: 'Đề thi',
      url: '/documents',
      icon: 'fa fa-database',
      children: [
        {
          name: 'Quản lý đề thi',
          url: '/documents',
          icon: 'fa fa-table',
        },
        {
          name: 'Đề thi cần duyệt',
          url: '/documents?approved=0',
          icon: 'fa fa-table',
        },
      ],
    },
    {
      name: 'Tạo mục',
      url: '/filter',
      icon: 'fa fa-database',
      children: [
        {
          name: 'Danh mục',
          url: '/categories',
          icon: 'fa fa-table',
        },
        {
          name: 'Môn',
          url: '/subjects',
          icon: 'fa fa-table',
        },
        {
          name: 'Lớp',
          url: '/classes',
          icon: 'fa fa-table',
        },
        {
          name: 'Bộ sưu tập',
          url: '/collections',
          icon: 'fa fa-table',
        },
      ],
    },
    {
      name: 'Quản lý module',
      url: '/modules',
      icon: 'fa fa-database',
      children: [
        {
          name: 'Thông tin chung',
          url: '/modules/general',
          icon: 'fa fa-table',
        },
        {
          name: 'Tạo menu',
          url: '/modules/menu',
          icon: 'fa fa-table',
        },
      ],
    },
    {
      name: 'Quản lý tin tức',
      url: '/news',
      icon: 'fa fa-database',
      children: [
        {
          name: 'Tin tức',
          url: '/news',
          icon: 'fa fa-table',
        },
      ],
    },
  ],
};