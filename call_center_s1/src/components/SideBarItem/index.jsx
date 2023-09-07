import clsx from 'clsx';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const SidebarItem = props => {
  const { title, icon: Icon, link, className, active } = props;
  return (
    <Link className={clsx(styles.container, className, {[styles.active]: active})} to={link}>
      <div className={styles.icon}>
        <Icon />
      </div>
      <div className={styles.title}>{title}</div>
    </Link>
  );
};

export default SidebarItem;
