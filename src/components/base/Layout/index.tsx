import Header from '../Header';
import styles from './layout.module.scss';

type Props = {
    children: JSX.Element;
};

const Layout = ({ children }: Props) => {
    return (
        <div className={styles.layout}>
            <Header />
            {children}
        </div>
    );
};

export default Layout;
