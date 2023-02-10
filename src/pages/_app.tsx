import '@/styles/globals.scss';
import { AuthProvider } from '@/_contexts/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ToastContainer />
            <Component {...pageProps} />
        </AuthProvider>
    );
}
