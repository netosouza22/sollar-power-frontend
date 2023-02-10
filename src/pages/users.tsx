import Layout from '@/components/base/Layout';
import TableUser from '@/components/Tables/TableUser';
import { AuthContext } from '@/_contexts/authContext';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

const Users = () => {
    const router = useRouter();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <Layout>
            <main>
                <TableUser />
            </main>
        </Layout>
    );
};

export default Users;
