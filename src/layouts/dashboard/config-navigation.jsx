import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'subastas',
    path: '/subastas',
    icon: icon('ic_auction'),
  },
  { 
    title: 'ofertar',
    path: '/ofertar',
    icon: icon('ic_offer'),
  }
];

export default navConfig;
