import LogoSollarPower from '@/assets/sollar-power.png';
import Button from '@/components/base/Button';
import styles from '@/styles/pages/login.module.scss';
import { AuthContext } from '@/_contexts/authContext';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useContext } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { FormDataLogin } from '@/@types/forms';
import { schemaLogin } from '@/utils/schemas';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

const Login = () => {
    const { signIn } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataLogin>({
        resolver: yupResolver(schemaLogin),
    });

    const onSubmit: SubmitHandler<FormDataLogin> = async (data: FormDataLogin) => {
        console.log('🚀 ~ file: index.tsx:53 ~ constonSubmit:SubmitHandler<FormDataLogin>= ~ data', data);
        const userLogged = await signIn(data);

        if (!userLogged) {
            toast.error('Usuário ou Email inválida !', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    return (
        <div className={styles.login__page}>
            <div className={styles.login__container}>
                <header className="d-flex w-100 justify-content-center align-items-center flex-column">
                    <Image src={LogoSollarPower} alt="system logo" width={200}></Image>
                    <h4 className={styles.login__text_info}>Bem vindo ao Sollar Power!</h4>
                </header>
                <main>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Container>
                            <Row>
                                <Col className="my-1" xs={12}>
                                    <Form.Label htmlFor="email">Email</Form.Label>
                                    <Form.Control
                                        {...register('email')}
                                        className={`${errors.email ? 'is-invalid' : ''}`}
                                        autoComplete="off"
                                        type="email"
                                        id="email"
                                        aria-describedby="email do usuário"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="my-1" xs={12}>
                                    <Form.Label htmlFor="password">Senha</Form.Label>
                                    <Form.Control
                                        {...register('password')}
                                        className={`${errors.password ? 'is-invalid' : ''}`}
                                        autoComplete="off"
                                        type="password"
                                        id="password"
                                        aria-describedby="senha do usuário"
                                    />
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center mt-4">
                                <Button type="submit" size="lg">
                                    Acessar
                                </Button>
                            </Row>
                        </Container>
                    </Form>
                </main>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { auth_token } = parseCookies(ctx);

    if (auth_token) {
        return {
            redirect: {
                destination: '/home',
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

export default Login;
