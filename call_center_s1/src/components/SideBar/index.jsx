import { Dashboard, ExitToApp } from '@mui/icons-material';
import SidebarItem from '../SideBarItem';
import styles from './styles.module.scss';
import CallCenterIcon from '../Icons/CallCenter';
import { matchPath } from 'react-router-dom';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
const menuItems = [
  {
    title: 'Call Center S1',
    icon: CallCenterIcon,
    link: '/',
  },
  {
    title: 'Track location S2',
    icon: AddLocationAltIcon,
    link: '/S2',
  },
  {
    title: 'Driver Info S3',
    icon: SportsMotorsportsIcon,
    link: '/S3',
  },
  
];

const SideBar = () => {
  const activeRoute = (routeName: string) => {
    const match = matchPath({
      path: routeName,
      exact: false,
    }, window.location.pathname);
    return !!match;
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.menu}>
        {menuItems.map((item, index) => {
          const active = activeRoute(item.link);
          return (
            <SidebarItem
              key={index}
              title={item.title}
              icon={item.icon}
              link={item.link}
              active={active}
            />
          );
        })}
        <SidebarItem
          className={styles.logoutOption}
          title="Logout"
          icon={ExitToApp}
          link="/admin/logout"
        />
      </div>
    </div>
  );
};

export default SideBar;
