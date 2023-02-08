import Button from '@/components/base/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import * as yup from 'yup';

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFuYWlzIiwiaWF0IjoxNjc1ODgyNjIwLCJleHAiOjE2NzU4ODYyMjB9.FVIDsxsUZuMXufBjyQnsyxWFTL2B3hT8tEVxHyniWLo';

const schema = yup
    .object({
        cellphone: yup.string().required('Campo Obrigatório!'),
        name: yup.string().required('Campo Obrigatório!'),
        cpf: yup.string().required('Campo Obrigatório!'),
        email: yup.string().email().required('Campo Obrigatório!'),
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

const ModalProject = () => {
    const {
        reset,
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormDataProject>({
        resolver: yupResolver(schema),
    });

    const [defaultValueProjet, setDefaultValueProject] = useState<any>([]);

    console.log(errors);

    useEffect(() => {
        const getProject = async () => {
            try {
                const response: any = await axios.get('http://localhost:8080/projects/2', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log(
                    '🚀 ~ file: index.tsx:55 ~ getProject ~ response',
                    response.data.project,
                );

                reset({ ...response.data.project });
            } catch (err) {
                console.log(err);
            }
        };

        getProject();
    }, [reset]);

    const onSubmit: SubmitHandler<FormDataProject> = async (data) => {
        try {
            const response = await axios.put('http://localhost:8080/projects/2', data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            console.log(response.status);
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
        <Modal show={true} size="lg">
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
                                            id="client_cellphone"
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
