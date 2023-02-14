import Layout from '@/components/base/Layout';
import TableProject from '@/components/Tables/TableProject';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
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

const Home = (props: any) => {
    // console.log('🚀 ~ file: home.tsx:25 ~ Home ~ props', JSON.stringify(props.data));
    const router = useRouter();
    // const [isLoading, setIsLoading] = useState(true);
    // const { isAuthenticated } = useContext(AuthContext);

    // useEffect(() => {
    //     const verifyAccess = () => {
    //         if (isAuthenticated) {
    //             router.replace(router.pathname);
    //             setIsLoading(false);
    //         } else {
    //             router.push('/');
    //         }
    //     };

    //     verifyAccess();

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isAuthenticated]);

    // if (isLoading) {
    //     return <div style={{ backgroundColor: 'red', width: '50%' }}>\\\///</div>;
    // }

    return (
        <Layout>
            <main>
                <TableProject />
            </main>
        </Layout>
    );
};

export default Home;

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
        props: {},
    };
};
