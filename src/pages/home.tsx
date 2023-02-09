import Layout from '@/components/base/Layout';
import TableProject from '@/components/Tables/TableProject';
import { AuthContext } from '@/_contexts/authContext';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

type Project = {
    client_cellphone: string;
    client_name: string;
    total_potency: number;
    company_distribution: string;
    file: string;

    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    number: number;
};

const Home = () => {
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
                <TableProject />
            </main>
        </Layout>
    );
};

export default Home;
