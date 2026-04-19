const sidebarSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Search', path: '/search' }
    ]
  },
  {
    title: 'Study',
    items: [
      { label: 'Materie', path: '/subjects' },
      { label: 'Task', path: '/tasks' },
      { label: 'Esami', path: '/exams' },
      { label: 'Appunti', path: '/notes' }
    ]
  },
  {
    title: 'Account',
    items: [{ label: 'Settings', path: '/settings' }]
  }
];

export default sidebarSections;
