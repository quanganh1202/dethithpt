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
          name: 'Tạo danh mục',
          url: '/categories/create',
          icon: 'fa fa-table',
        },
        {
          name: 'Tạo môn',
          url: '/subjects/create',
          icon: 'fa fa-table',
        },
        {
          name: 'Tạo lớp',
          url: '/classes/create',
          icon: 'fa fa-table',
        },
        {
          name: 'Tạo bộ sưu tập',
          url: '/collections/create',
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
          url: '/news',
          icon: 'fa fa-table',
        },
      ],
    },
  ],
};