import LogoImg from '@/assets/sollar-power.png';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Button from '../Button';
import styles from './header.module.scss';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.header__logo}>
                <Image src={LogoImg} alt="Logo Image" width={150} />
            </div>
            <nav className={styles.header__nav}>
                <ul>
                    <li>Projetos</li>
                    <li>Usuários</li>

                    <li>
                        <Button
                            bg=""
                            size="lg"
                            onClick={() => signOut({ redirect: false, callbackUrl: '/login' })}
                        >
                            Logout
                        </Button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
