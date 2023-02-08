import Layout from '@/components/base/Layout';
import TableProject from '@/components/Tables/TableProject';
import NextAuth from '@/pages/api/auth/[...nextauth]';
import { Inter } from '@next/font/google';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
const inter = Inter({ subsets: ['latin'] });

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFuYWlzIiwiaWF0IjoxNjc1ODg2NjAxLCJleHAiOjE2NzU4OTAyMDF9.1TFilADLpJ4cA4Boj5pxjIHfPzuxbMeH6SACqdxOc6k';

function Home({ projects }: any) {
    const { status, data: session } = useSession();
    const router = useRouter();
    console.log('🚀 ~ file: index.tsx:19 ~ Home ~ router', router.pathname);

    if (status === 'loading') {
        return null;
    }

    if (status === 'unauthenticated') {
        Router.replace('/home');
    }

    // useEffect(() => {
    //     const getProjects = async () => {
    //         const response = await axios.get('http://localhost:8080/projects', {
    //             headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    //         });
    //         console.log('🚀 ~ file: index.tsx:31 ~ getProjects ~ response', response);
    //     };
    //     getProjects();
    // }, []);

    if (status === 'authenticated') {
        return (
            <Layout>
                <main>
                    <TableProject dataGrid={projects} />
                </main>
            </Layout>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // console.log("🚀 ~ file: index.tsx:143 ~ getServerSideProps ~ context", context)
    const session = await getServerSession(context.req, context.res, NextAuth);

    console.log('🚀 ~ file: index.tsx:145 ~ getServerSideProps ~ session', session);

    const response = await axios.get('http://localhost:8080/projects', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    console.log('🚀 ~ file: index.tsx:31 ~ getProjects ~ response', response.data);

    // if (!session) {
    //   return {
    //     redirect: {
    //       destination: '/',
    //       permanent: false,
    //     },
    //   }
    // }

    return {
        props: {
            projects: response.data,
        },
    };
};

export default Home;
