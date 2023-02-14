import Layout from '@/components/base/Layout';
import TableUser from '@/components/Tables/TableUser';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

const Users = () => {
    return (
        <Layout>
            <main>
                <TableUser />
            </main>
        </Layout>
    );
};

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
            // data: cookies;
        },
    };
};

export default Users;
