import { Inter } from '@next/font/google';
import { useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
const inter = Inter({ subsets: ['latin'] });

function Home() {
    const { status, data: session } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        <div>carregando</div>;
    }

    if (status === 'unauthenticated') {
        Router.replace('/');
    }

    if (status === 'authenticated') {
        console.log(session.user);
        if (session?.user) {
            const token = session?.user?.jwt;
        }
    }

    if (router.pathname === '/' && status === 'authenticated') {
        Router.replace('/home');
        // return (
        //     <Layout>
        //         <main>
        //             <TableProject dataGrid={projects} />
        //         </main>
        //     </Layout>
        // );
    }
}

export default Home;
