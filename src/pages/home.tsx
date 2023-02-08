import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect } from 'react';

const Home = () => {
    const { status, data: session } = useSession();
    console.log('🚀 ~ file: home.tsx:7 ~ Home ~ status', status);

    useEffect(() => {
        if (status === 'unauthenticated') {
            Router.replace('/login');
        }
    }, [status]);

    return <div>Home</div>;
};

export default Home;
