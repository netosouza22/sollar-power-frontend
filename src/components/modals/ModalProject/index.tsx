import Button from '@/components/base/Button';
import { api } from '@/services/api';
import { states } from '@/utils/states';
import { AuthContext } from '@/_contexts/authContext';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { FocusEvent, useContext, useEffect } from 'react';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
// const a from "@/";
import { IMaskInput } from 'react-imask';
import * as yup from 'yup';

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
        number: yup.number().typeError('Número inválido!'),
        file: yup.mixed().test('file', 'Campo arquivo obrigatório!', (value) => {
            if (value.length > 0) {
                return true;
            }
            return false;
        }),
    })
    .required();

type FormDataProject = yup.InferType<typeof schema>;

interface ModalProject {
    id: number | undefined;
    accessType: string;
    showModal: boolean;
    hideModal: () => void;
    handleReload: () => void;
}

const defaultProjectValues = {
    client_cellphone: '',
    client_name: '',
    company_distribution: '',
    total_potency: 0,
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    number: 0,
    file: '',
};

const ModalProject = ({ showModal, hideModal, handleReload, id, accessType }: ModalProject) => {
    const { userInfo } = useContext(AuthContext);
    console.log('🚀 ~ file: index.tsx:61 ~ ModalProject ~ userInfo', userInfo);

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
            ...defaultProjectValues,
        },
    });

    useEffect(() => {
        const getProject = async () => {
            api.get(`/projects/${id}`)
                .then((res) => {
                    reset(res.data.project);
                    console.log(res.data);
                })
                .catch((err) => console.log(err));
        };

        if (accessType === 'edit') {
            getProject();
        }
    }, [accessType, id, reset]);

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
        reset({ ...defaultProjectValues });
        hideModal();
    };

    const onSubmit: SubmitHandler<FormDataProject> = async (data) => {
        const formData = new FormData();

        for (const property in data) {
            if (property === 'file') {
                let file = data.file[0];
                formData.append(`${property}`, file);
            }

            if (property !== 'file') {
                formData.append(`${property}`, data[property as keyof typeof data]);
            }
        }

        if (accessType === 'create') {
            await api
                .post(`/projects/${userInfo?.id}`, formData, { headers: { 'content-type': 'multipart/form-data' } })
                .then((res) => {
                    if (res.status === 201) {
                        reset({ ...defaultProjectValues });
                        hideModal();
                        handleReload();
                    }
                })
                .catch((err) => {});
        } else {
            await api
                .put(`/projects/${id}`, data)
                .then((res) => {
                    if (res.status === 201) {
                        reset({ ...defaultProjectValues });
                        hideModal();
                        handleReload();
                    }
                })
                .catch((err) => {
                    if (err.response.data.errors) {
                    }
                });
        }
    };

    return (
        <Modal show={showModal} onHide={() => handleCloseModal()} size="lg">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Projeto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="my-3">
                        <Row>
                            <Col className="my-1">
                                <Form.Label htmlFor="company_distribution">Concessionária</Form.Label>

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
                                <Form.Label htmlFor="total_potency">Potência Total em Volts</Form.Label>
                                <Form.Control
                                    {...register('total_potency')}
                                    className={`${errors.total_potency ? 'is-invalid' : ''}`}
                                    autoComplete="off"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="total_potency"
                                    aria-describedby="passwordHelpBlock"
                                />
                            </Col>
                        </Row>
                        <Row className="my-1">
                            <Col>
                                <Form.Label htmlFor="file">Arquivo do Projeto</Form.Label>
                                <Form.Control {...register('file')} className={`${errors.file ? 'is-invalid' : ''}`} autoComplete="off" type="file" id="file" aria-describedby="file" />
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
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                        <Form.Control
                                            as={IMaskInput}
                                            mask="(00) 00000-0000"
                                            value={value}
                                            className={`${errors.client_cellphone ? 'is-invalid' : ''}`}
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
                                <Form.Select {...register('state')} className={`${errors.state ? 'is-invalid' : ''}`} autoComplete="off" id="state" aria-describedby="passwordHelpBlock">
                                    {states.map((state) => {
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
                                <Form.Control {...register('city')} autoComplete="off" className={`${errors.city ? 'is-invalid' : ''}`} type="text" id="city" aria-describedby="passwordHelpBlock" />
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
                                    min="0"
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
