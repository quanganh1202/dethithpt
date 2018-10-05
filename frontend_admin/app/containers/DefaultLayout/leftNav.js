export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
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
          url: '/documents?approved=2',
          icon: 'fa fa-table',
        },
      ],
    },
    {
      name: 'Tạo mục',
      url: '/create',
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
          name: 'Tin tức',
          url: '/modules/news',
          icon: 'fa fa-table',
        },
      ],
    },
  ],
};