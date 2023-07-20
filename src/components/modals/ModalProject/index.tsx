import { FormDataProject } from '@/@types/forms';
import { ModalProps } from '@/@types/modals';
import Button from '@/components/base/Button';
import MessageErrorInfo from '@/components/base/MessageErrorInfo';
import { api } from '@/services/api';
import { defaultProjectValues } from '@/utils/defaultValuesRHF';
import { schemaProject } from '@/utils/schemas';
import { states } from '@/utils/states';
import { AuthContext } from '@/_contexts/authContext';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { FocusEvent, useContext, useEffect } from 'react';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

const ModalProject = ({ showModal, hideModal, handleReload, id, accessType }: ModalProps) => {
    console.count('modal product');

    const { userInfo } = useContext(AuthContext);
    const {
        reset,
        register,
        handleSubmit,
        control,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<FormDataProject>({
        mode: 'all',
        resolver: yupResolver(schemaProject),
        defaultValues: {
            ...defaultProjectValues,
        },
    });

    useEffect(() => {
        const getProject = async () => {
            api.get(`/projects/${id}`)
                .then((res) => {
                    reset(res.data.project);
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

            trigger(['state', 'city', 'neighborhood', 'address']);
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
                                <MessageErrorInfo errorMessage={errors.company_distribution?.message}></MessageErrorInfo>
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
                                <MessageErrorInfo errorMessage={errors.total_potency?.message}></MessageErrorInfo>
                            </Col>
                        </Row>
                        <Row className="my-1">
                            <Col>
                                <Form.Label htmlFor="file">Arquivo do Projeto</Form.Label>
                                <Form.Control
                                    {...register('file')}
                                    className={`${errors.file ? 'is-invalid' : ''}`}
                                    autoComplete="off"
                                    type="file"
                                    id="file"
                                    aria-describedby="file"
                                />
                                {/* <MessageErrorInfo errorMessage={errors.file?.message}></MessageErrorInfo> */}
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
                                <MessageErrorInfo errorMessage={errors.client_name?.message}></MessageErrorInfo>
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
                                            className={`${errors.client_cellphone ? 'is-invalid' : ''}`}
                                            onChange={onChange}
                                            type="text"
                                            id="client_cellphone"
                                            aria-describedby="passwordHelpBlock"
                                        />
                                    )}
                                />
                                <MessageErrorInfo errorMessage={errors.client_cellphone?.message}></MessageErrorInfo>
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
                                <MessageErrorInfo errorMessage={errors.cep?.message}></MessageErrorInfo>
                            </Col>
                            <Col className="my-1" xs={3}>
                                <Form.Label htmlFor="state">Estado</Form.Label>
                                <Form.Select
                                    {...register('state')}
                                    className={`${errors.state ? 'is-invalid' : ''}`}
                                    autoComplete="off"
                                    id="state"
                                    aria-describedby="passwordHelpBlock"
                                >
                                    {states.map((state) => {
                                        return (
                                            <option key={state.value} value={state.value}>
                                                {state.label}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                                <MessageErrorInfo errorMessage={errors.state?.message}></MessageErrorInfo>
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
                                <MessageErrorInfo errorMessage={errors.city?.message}></MessageErrorInfo>
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
                                <MessageErrorInfo errorMessage={errors.neighborhood?.message}></MessageErrorInfo>
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
                                <MessageErrorInfo errorMessage={errors.address?.message}></MessageErrorInfo>
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
                                <MessageErrorInfo errorMessage={errors.number?.message}></MessageErrorInfo>
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
