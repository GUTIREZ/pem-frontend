
const Items =   [

  {
    avatar: '/static/avatar/a1.jpg',
    timeString: 'Just now',
    color: 'primary',
    text: 'Michael finished  one task just now.'
  },
  {
    avatar: '/static/avatar/a2.jpg',
    timeString: '30 min ago',
    color: 'teal',
    text: 'Jim created a new  task.'
  },
  {
    avatar: '/static/avatar/a3.jpg',
    timeString: '1 hour ago',
    color: 'indigo',
    text: 'Li completed the PSD to html convert.'
  },
  {
    avatar: '/static/avatar/a4.jpg',
    timeString: '3 hour ago',
    color: 'pink',
    text: 'Michael upload a new pic.'
  },
  {
    avatar: '/static/avatar/man_1.jpg',
    timeString: '10 min ago',
    color: 'cyan',
    text: 'Li assigned a a task to Michael'
  },

];

const getActivity = (limit) => {
  return (limit) ? Items.slice(0, limit) : Items;
};


export default {
  getActivity
};