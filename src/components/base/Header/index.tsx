import LogoImg from '@/assets/sollar-power.png';
import { AuthContext } from '@/_contexts/authContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Button from '../Button';
import styles from './header.module.scss';

const Header = () => {
    const router = useRouter();
    const { logout, isAuthenticated } = useContext(AuthContext);

    // const signOut = () => {
    //     const { auth_token } = parseCookies();
    //     if (!!auth_token) {
    //         destroyCookie(null, 'auth_token');
    //         router.push('/login');
    //     }

    //     router.push('/login');
    // };

    return (
        <header className={styles.header}>
            <div className={styles.header__logo}>
                <Image src={LogoImg} alt="Logo Image" width={150} />
            </div>
            {isAuthenticated && (
                <nav className={styles.header__nav}>
                    <ul>
                        <li>
                            <Link href="/home">Projetos</Link>
                        </li>
                        <li>
                            <Link href="/users">Usuários</Link>
                        </li>

                        <li>
                            <Button bg="" size="lg" onClick={logout}>
                                Logout
                            </Button>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
