import Layout from '@/components/base/Layout';
import TableProject from '@/components/Tables/TableProject';
import { AuthContext } from '@/_contexts/authContext';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

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
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const verifyAccess = () => {
            if (isAuthenticated) {
                router.push('/home');
                setIsLoading(false);
            } else {
                router.push('/login');
            }
        };

        verifyAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    if (isLoading) {
        return <div></div>;
    }

    return (
        <Layout>
            <main>
                <TableProject />
            </main>
        </Layout>
    );
};

export default Home;
