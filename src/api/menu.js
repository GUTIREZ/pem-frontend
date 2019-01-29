const Menu =  [
  // { header: 'Apps' },
  {
    title: 'Dashboard',
    group: 'apps',
    icon: 'account_box',
    name: 'Dashboard',
  },
  {
    title: 'Chat',
    group: 'apps',
    icon: 'chat_bubble',
    target: '_blank',
    name: 'Chat',
  },
  {
    title: 'Inbox',
    group: 'apps',
    name: 'Mail',
    target: '_blank',
    icon: 'email',
  },
  {
    title: 'Media',
    group: 'apps',
    name: 'Media1',
    path: '/media',
    // disabled : true,
    // href: '/media',
    icon: 'perm_media',
  },
  {
    title: 'Widgets',
    group: 'widgets',
    // path: 'widgets',
    icon: 'widgets',
    items: [
      { name: 'social', title: 'Social', path: 'components/social' },
      { name: 'statistic', title: 'Statistic', badge: 'new', path: 'components/statistic' },
      { name: 'chart', title: 'Chart', path: 'components/chart' },
      { name: 'list', title: 'List', path: 'components/widget-list' },
    ]
  },  
  // { divider: true },
  // { header: 'UI Elements' },
  {
    title: 'General',
    group: 'components',
    path: 'components',
    icon: 'tune',
    items: [
      { name: 'alerts', title: 'Alerts', path: 'alerts' },
      { name: 'avatars', title: 'Avatars', path: 'components/avatars' },
      { name: 'badges', title: 'Badges', path: 'components/badges' },
      { name: 'buttons', title: 'Buttons', path: 'components/buttons' },
      { name: 'cards', title: 'Cards', path: 'components/cards' },
      { name: 'carousels', title: 'Carousels', path: 'components/carousels' },
      { name: 'chips', title: 'Chips', path: 'components/chips' },
      { name: 'dialogs', title: 'Dialogs', path: 'components/dialogs' },
      { name: 'icons', title: 'Icons', path: 'components/icons' },
      { name: 'tables', title: 'Data Tables', path: 'components/tables' },
      { name: 'parallax', title: 'Parallax  image', path: 'components/parallax' },
      { name: 'snackbar', title: 'Snackbar', path: 'components/snackbar' },
      { name: 'progress', title: 'Progress', path: 'components/progress' },      
      { name: 'slider', title: 'Slider', path: 'components/sliders' },      
      { name: 'tooltip', title: 'Tooltip', path: 'components/tooltips' },      
      { name: 'pagination', title: 'Pagination', path: 'components/paginations' },      
      { name: 'typography', title: 'Typography', path: 'components/typography' },      
      { name: 'color', title: 'Color', path: 'components/color' },      

    ]
  },
  {
    title: 'Pickers',
    group: 'pickers',
    path: 'picker',
    icon: 'filter_vintage',
    items: [
      { name: 'timepicker', title: 'Timepicker', path: 'pickers/timepicker' },     
      { name: 'datepicker', title: 'Datepicker', path: 'pickers/datepicker' },      

    ]
  },
  {
    title: 'Layout',
    group: 'layout',
    path: 'layout',
    icon: 'view_compact',
    items: [
      { name: 'bottom-sheets', title: 'Bottom panels', path: 'components/bottom-sheets' },
      { name: 'expansion-panels', title: 'Expansion panels', path: 'components/expansion-panels' },
      { name: 'footer', title: 'Footer', path: 'components/footer' },
      { name: 'lists', title: 'Lists', path: 'components/lists' },
      { name: 'jumbotrons', title: 'Jumbotrons', badge: 'new', path: 'components/jumbotrons' },
      { name: 'menus', title: 'Menus', path: 'components/menus' },
      { name: 'tabs', title: 'Tabs', path: 'components/tabs' },
      { name: 'toolbar', title: 'Toolbars', path: 'components/toolbar' },
      { name: 'timeline', title: 'Timeline', path: 'components/timeline' },
    ]
  },  
  {
    title: 'Forms & Controls',
    group: 'forms',
    path: 'forms',
    icon: 'edit',
    items: [
      { name: 'basic', title: 'General', path: 'components/basic-forms' },
      { name: 'selects', title: 'Selects', badge: 'new', path: 'components/selects' },
      { name: 'selection-controls', title: 'Selection Controls', path: 'components/selection-controls' },
      { name: 'text-fields', title: 'Text Fields', path: 'components/text-fields' },
      { name: 'steppers', title: 'Steppers', path: 'components/steppers' },
      { name: 'editors', title: 'Editors', path: 'components/editors' },
    ]
  },
  // { divider: true },
  // { header: 'Extras' },
  {
    title: 'Pages',
    group: 'extra',
    icon: 'list',
    items: [
      { name: 'Login', title: 'Login', path: 'Login' },
      { name: '404', title: '404', path: 'NotFound' },
      { name: '403', title: '403', path: 'AccessDenied' },
      { name: '500', title: '500', path: 'ServerError' },
    ]
  },
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
});

export default Menu;
