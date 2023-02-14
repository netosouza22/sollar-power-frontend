import LogoImg from '@/assets/sollar-power.png';
import { AuthContext } from '@/_contexts/authContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import Button from '../Button';
import styles from './header.module.scss';

const Header = () => {
    // const router = useRouter();
    const { logout } = useContext(AuthContext);

    return (
        <header className={styles.header}>
            <div className={styles.header__logo}>
                <Link href="/home">
                    <Image src={LogoImg} alt="Logo Image" width={150} />
                </Link>
            </div>

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
        </header>
    );
};

export default Header;
