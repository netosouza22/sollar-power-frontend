import Layout from '@/components/base/Layout';
import TableProject from '@/components/Tables/TableProject';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

// type Project = {
//     client_cellphone: string;
//     client_name: string;
//     total_potency: number;
//     company_distribution: string;
//     file: string;

//     cep: string;
//     state: string;
//     city: string;
//     neighborhood: string;
//     address: string;
//     number: number;
// };

interface IProps {
    let: string;
}

export default function Home() {
    return (
        <Layout>
            <main>
                <TableProject />
            </main>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { auth_token } = parseCookies(ctx);

    if (!auth_token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    return {
        props: {
            let: 'a',
        },
    };
};
