import Button from '@/components/base/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { FocusEvent, useEffect } from 'react';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import * as yup from 'yup';

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFuYWlzIiwiaWF0IjoxNjc1ODg2NjAxLCJleHAiOjE2NzU4OTAyMDF9.1TFilADLpJ4cA4Boj5pxjIHfPzuxbMeH6SACqdxOc6k';

const schema = yup
    .object({
        client_cellphone: yup.string().required('Campo Obrigatório!'),
        client_name: yup.string().required('Campo Obrigatório!'),
        company_distribution: yup.string().required('Campo Obrigatório!'),
        total_potency: yup.number().required('Campo Obrigatório!'),
        cep: yup.string().required('Campo Obrigatório!'),
        state: yup.string().required('Campo Obrigatório!'),
        city: yup.string().required('Campo Obrigatório!'),
        neighborhood: yup.string().required('Campo Obrigatório!'),
        address: yup.string().required('Campo Obrigatório!'),
        number: yup.number().typeError('Número inválido'),
        file: yup.string(),
    })
    .required();

type FormDataProject = yup.InferType<typeof schema>;

interface ModalProject {
    showModal: boolean;
    hideModal: () => void;
}

const ModalProject = ({ showModal, hideModal }: ModalProject) => {
    const {
        reset,
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<FormDataProject>({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            file: 'qeqwe',
        },
    });

    useEffect(() => {
        let a = 'b';
        const getProject = async () => {
            try {
                const response: any = await axios.get('http://localhost:8080/projects/1', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                reset({ ...response.data.project });
            } catch (err) {
                console.log(err);
            }
        };

        if (a === 'a') {
            getProject();
        }
    }, [reset]);

    const handleCepInformation = async (
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    ) => {
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

    const onSubmit: SubmitHandler<FormDataProject> = async (data) => {
        try {
            const response = await axios.put('http://localhost:8080/projects/1', data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                reset();
                hideModal();
            }
        } catch (err: any) {
            if (err.response.data.errors) {
                console.log(
                    '🚀 ~ file: index.tsx:59 ~ constonSubmit:SubmitHandler<FormDataProject>= ~ err',
                    err.response.data.errors.default,
                );
            }

            console.log(err.response.data.message);
        }
    };

    return (
        <Modal show={showModal} onHide={() => hideModal()} size="lg">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Projeto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="my-3">
                        <Row>
                            <Col className="my-1">
                                <Form.Label htmlFor="company_distribution">
                                    Concessionária
                                </Form.Label>

                                <Form.Control
                                    {...register('company_distribution')}
                                    className={`${errors.company_distribution ? 'is-invalid' : ''}`}
                                    // autoComplete="off"
                                    type="text"
                                    id="company_distribution"
                                    aria-describedby="passwordHelpBlock"
                                />
                            </Col>
                            <Col className="my-1">
                                <Form.Label htmlFor="total_potency">
                                    Potência Total em Volts
                                </Form.Label>
                                <Form.Control
                                    {...register('total_potency')}
                                    className={`${errors.total_potency ? 'is-invalid' : ''}`}
                                    autoComplete="off"
                                    type="number"
                                    id="total_potency"
                                    aria-describedby="passwordHelpBlock"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="my-1">
                                <Form.Label htmlFor="client_name">Nome do Cliente</Form.Label>
                                <Form.Control
                                    {...register('client_name')}
                                    className={`${errors.client_name ? 'is-invalid' : ''}`}
                                    autoComplete="off"
                                    type="text"
                                    id="client_name"
                                    aria-describedby="passwordHelpBlock"
                                />
                            </Col>
                            <Col className="my-1">
                                <Form.Label htmlFor="client_cellphone">N° do Cliente</Form.Label>

                                <Controller
                                    control={control}
                                    name="client_cellphone"
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => (
                                        <Form.Control
                                            as={IMaskInput}
                                            mask="(00) 00000-0000"
                                            value={value}
                                            className={`${
                                                errors.client_cellphone ? 'is-invalid' : ''
                                            }`}
                                            onChange={onChange}
                                            type="text"
                                            id="client_cellphone"
                                            aria-describedby="passwordHelpBlock"
                                        />
                                    )}
                                />
                            </Col>
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
                                            type="text"
                                            value={value}
                                            onBlur={(e) => handleCepInformation(e)}
                                            id="cep"
                                            aria-describedby="passwordHelpBlock"
                                        />
                                    )}
                                />
                            </Col>
                            <Col className="my-1" xs={3}>
                                <Form.Label htmlFor="state">Estado</Form.Label>
                                <Form.Control
                                    {...register('state')}
                                    className={`${errors.state ? 'is-invalid' : ''}`}
                                    autoComplete="off"
                                    type="text"
                                    id="state"
                                    aria-describedby="passwordHelpBlock"
                                />
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
    );
};

export default ModalProject;
