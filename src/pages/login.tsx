import Button from '@/components/base/Button';
import Header from '@/components/base/Header';
import styles from '@/styles/pages/login.module.scss';
import { AuthContext } from '@/_contexts/authContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup
    .object({
        email: yup.string().email().required('Campo Obrigatório!'),
        password: yup.string().required('Campo Obrigatório!'),
    })
    .required();

type FormDataLogin = yup.InferType<typeof schema>;

const Login = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { signIn, isAuthenticated } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataLogin>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const verifyAccess = () => {
            if (isAuthenticated) {
                router.push('/home');
            } else {
                router.push('/login');
                setIsLoading(false);
            }
        };

        verifyAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const onSubmit: SubmitHandler<FormDataLogin> = async (data: FormDataLogin) => {
        const userLogged = await signIn(data);

        if (!userLogged) {
            toast.error('Usuário ou Email inválida !', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    if (isLoading) {
        return <div></div>;
    }

    return (
        <>
            <Header />

            <div className={styles.login__container}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Container>
                        <Row>
                            <Col className="my-1">
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <Form.Control {...register('email')} className={`${errors.email ? 'is-invalid' : ''}`} autoComplete="off" type="email" id="email" aria-describedby="email do usuário" />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="my-1">
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
            </div>
        </>
    );
};

export default Login;
