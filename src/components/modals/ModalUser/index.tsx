import Button from '@/components/base/Button';
import { api } from '@/services/api';
import { states } from '@/utils/states';
import { AuthContext } from '@/_contexts/authContext';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { FocusEvent, useContext, useEffect } from 'react';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup';

interface ModalUser {
    id: number | undefined;
    accessType: string;
    showModal: boolean;
    hideModal: () => void;
    handleReload: () => void;
}

const defaultUserValues: FormDataUser = {
    isCreate: false,
    name: '',
    cpf: '',
    email: '',
    cellphone: '',
    cep: '',
    password: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    number: 0,
};

const schema = yup
    .object({
        isCreate: yup.bool(),
        cellphone: yup.string().required('Campo Obrigatório!'),
        name: yup.string().required('Campo Obrigatório!'),
        cpf: yup.string().required('Campo Obrigatório!'),
        email: yup.string().email().required('Campo Obrigatório!'),
        password: yup.string().when('isCreate', {
            is: true,
            then: yup.string().required('Campo Senha necessário!'),
        }),
        cep: yup.string().required('Campo Obrigatório!'),
        state: yup.string().required('Campo Obrigatório!'),
        city: yup.string().required('Campo Obrigatório!'),
        neighborhood: yup.string().required('Campo Obrigatório!'),
        address: yup.string().required('Campo Obrigatório!'),
        number: yup.number().typeError('Número inválido'),
    })
    .required();

type FormDataUser = yup.InferType<typeof schema>;

const ModalUser = ({ showModal, hideModal, handleReload, id, accessType }: ModalUser) => {
    const { userInfo } = useContext(AuthContext);
    const {
        reset,
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<FormDataUser>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const getUser = async () => {
            await api
                .get(`/users/${Number(id)}`)
                .then((res) => {
                    reset(res?.data.user);
                    console.log(res?.data.user);
                })
                .catch((err) => console.log(err));
        };
        if (accessType === 'edit') {
            getUser();
        }
    }, [reset, id, accessType]);

    const handleCepInformation = async (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
        const valueCep = e.target.value;

        if (valueCep.length < 10) {
            return;
        }

        const pureValueCep = valueCep.replace(/[.-]/g, '');

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${pureValueCep}/json/ `);

            setValue('state', response.data.uf);
            setValue('city', response.data.localidade);
            setValue('neighborhood', response.data.bairro);
            setValue('address', response.data.logradouro);
        } catch (err) {}
    };

    const handleCloseModal = () => {
        reset({ ...defaultUserValues });
        hideModal();
    };

    const onSubmit: SubmitHandler<FormDataUser> = async (data) => {
        if (accessType === 'create') {
            await api
                .post(`/users`, data)
                .then((res) => {
                    if (res.status === 201) {
                        reset({ ...defaultUserValues });
                        hideModal();
                        handleReload();
                    }
                })
                .catch((err) => {});
        } else {
            delete data.isCreate;
            delete data.password;

            await api
                .put(`/users/${id}`, data)
                .then((res) => {
                    if (res.status === 201) {
                        toast.error('Usuário criado com sucesso!', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        hideModal();
                        handleReload();
                    }
                })
                .catch((err) => {
                    if (err?.message) {
                        toast.error(`${err.message}`, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                });
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adicionar Usuário</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container className="my-3">
                            <Row>
                                <Col className="my-1">
                                    <Form.Label htmlFor="name">Nome</Form.Label>

                                    <Form.Control {...register('name')} className={`${errors.name ? 'is-invalid' : ''}`} type="text" id="name" aria-describedby="passwordHelpBlock" />
                                </Col>
                                <Col className="my-1">
                                    <Form.Label htmlFor="cpf">CPF</Form.Label>
                                    <Controller
                                        control={control}
                                        name="cpf"
                                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                            <Form.Control
                                                as={IMaskInput}
                                                mask="000.000.000-00"
                                                className={`${errors.cpf ? 'is-invalid' : ''}`}
                                                onChange={onChange}
                                                value={value}
                                                type="text"
                                                id="cpf"
                                                aria-describedby="passwordHelpBlock"
                                            />
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="my-1">
                                    <Form.Label htmlFor="email">Email</Form.Label>
                                    <Form.Control {...register('email')} className={`${errors.email ? 'is-invalid' : ''}`} autoComplete="off" type="email" id="email" aria-describedby="email" />
                                </Col>
                                <Col className="my-1">
                                    <Form.Label htmlFor="client_cellphone">N° do Cliente</Form.Label>

                                    <Controller
                                        control={control}
                                        name="cellphone"
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                            <Form.Control
                                                as={IMaskInput}
                                                mask="(00) 00000-0000"
                                                value={value}
                                                className={`${errors.cellphone ? 'is-invalid' : ''}`}
                                                onChange={onChange}
                                                type="text"
                                                id="cellphone"
                                                aria-describedby="passwordHelpBlock"
                                            />
                                        )}
                                    />
                                </Col>

                                {accessType !== 'edit' && (
                                    <Col className="my-1">
                                        <Form.Label htmlFor="password">Password</Form.Label>
                                        <Form.Control
                                            {...register('password')}
                                            className={`${errors.password ? 'is-invalid' : ''}`}
                                            autoComplete="off"
                                            type="password"
                                            id="email"
                                            aria-describedby="email"
                                        />
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                <Col className="my-1" xs={3}>
                                    <Form.Label htmlFor="cep">CEP</Form.Label>
                                    <Controller
                                        control={control}
                                        name="cep"
                                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                            <Form.Control
                                                as={IMaskInput}
                                                mask="00.000-000"
                                                className={`${errors.cep ? 'is-invalid' : ''}`}
                                                onChange={onChange}
                                                onBlur={(e) => handleCepInformation(e)}
                                                type="text"
                                                value={value}
                                                id="client_cellphone"
                                                aria-describedby="passwordHelpBlock"
                                            />
                                        )}
                                    />
                                </Col>
                                <Col className="my-1" xs={3}>
                                    <Form.Label htmlFor="state">Estado</Form.Label>
                                    <Form.Select {...register('state')} className={`${errors.state ? 'is-invalid' : ''}`} autoComplete="off" id="state" aria-describedby="passwordHelpBlock">
                                        {states.map((state: any) => {
                                            return (
                                                <option key={state.value} value={state.value}>
                                                    {state.label}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                </Col>
                                <Col className="my-1" xs={6}>
                                    <Form.Label htmlFor="city">Cidade</Form.Label>
                                    <Form.Control
                                        {...register('city')}
                                        autoComplete="off"
                                        className={`${errors.city ? 'is-invalid' : ''}`}
                                        type="text"
                                        id="city"
                                        aria-describedby="passwordHelpBlock"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="my-1">
                                    <Form.Label htmlFor="neighborhood">Bairro</Form.Label>
                                    <Form.Control
                                        {...register('neighborhood')}
                                        className={`${errors.neighborhood ? 'is-invalid' : ''}`}
                                        autoComplete="off"
                                        type="text"
                                        id="neighborhood"
                                        aria-describedby="passwordHelpBlock"
                                    />
                                </Col>
                                <Col className="my-1">
                                    <Form.Label htmlFor="address">Rua</Form.Label>
                                    <Form.Control
                                        {...register('address')}
                                        className={`${errors.address ? 'is-invalid' : ''}`}
                                        autoComplete="off"
                                        type="text"
                                        id="address"
                                        aria-describedby="passwordHelpBlock"
                                    />
                                </Col>
                                <Col className="my-1">
                                    <Form.Label htmlFor="number">Número</Form.Label>
                                    <Form.Control
                                        {...register('number')}
                                        className={`${errors.number ? 'is-invalid' : ''}`}
                                        autoComplete="off"
                                        type="number"
                                        id="number"
                                        aria-describedby="passwordHelpBlock"
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" size="lg">
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default ModalUser;
