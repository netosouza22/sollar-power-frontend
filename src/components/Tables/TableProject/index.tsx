import deleteIcon from '@/assets/icons/delete.svg';
import editIcon from '@/assets/icons/edit.svg';
import Button from '@/components/base/Button';
import ModalProject from '@/components/modals/ModalProject';
import { api } from '@/services/api';
import { states } from '@/utils/states';
import { AuthContext } from '@/_contexts/authContext';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import styles from '../table.module.scss';

type ModalPropHandle = {
    id: number;
    accessTypeModal: string;
};

type Projects = {
    client_cellphone: string;
    client_name: string;
    total_potency: number;
    company_distribution: string;
    file: string;

    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    number: number;
};

const TableProject = () => {
    const { userInfo } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [idProject, setIdProject] = useState<number>(-1);
    const [accessType, setAccessType] = useState('create');
    const [filter, setFilter] = useState('');
    console.log('🚀 ~ file: index.tsx:39 ~ TableProject ~ filter', filter);

    const [reload, setReload] = useState(false);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [allProjects, setAllProjects] = useState<Projects[]>([]);

    useEffect(() => {
        const getProjects = async () => {
            await api
                .get('/projects')
                .then((res) => {
                    setProjects(res.data);
                    setAllProjects(res.data);
                })
                .catch((err) => console.log(err));
        };

        getProjects();
    }, [reload]);

    const hideProjectModal = () => {
        setShowModal(false);
    };

    const handleReload = () => {
        setReload((s) => !s);
    };

    const handleDeleteProject = async (id: number) => {
        await api
            .delete(`/projects/${id}`)
            .then((res) => {
                handleReload();
            })
            .catch((err) => console.log(err));
    };

    const handleShowModalProject = (id: number, accessTypeModal: string) => {
        setIdProject(id);
        setAccessType(accessTypeModal);
        setShowModal(true);
    };

    const handleFilter = () => {
        const filteredProjects = allProjects?.filter((item) => {
            return item.state === filter;
        });

        setProjects(filteredProjects);
    };

    const resetFilter = () => {
        setProjects(allProjects);
    };

    return (
        <>
            <ModalProject handleReload={handleReload} showModal={showModal} hideModal={hideProjectModal} id={idProject} accessType={accessType} />

            <div className={styles.table__container}>
                <header className={styles.t__container__header}>
                    <div className={styles.t__container__info}>
                        <h5>Projetos</h5>
                        <span>{projects?.length} Projetos</span>

                        <div className={styles.t__container__filter}>
                            <Form.Select onChange={(e) => setFilter(e.target.value)} autoComplete="off" id="state" aria-describedby="passwordHelpBlock">
                                <option value="">Estados</option>
                                {states.map((state) => {
                                    return (
                                        <option key={state.value} value={state.value}>
                                            {state.label}
                                        </option>
                                    );
                                })}
                            </Form.Select>

                            <div className={styles.t__filter__buttons}>
                                <Button size="md" onClick={handleFilter}>
                                    Filtrar
                                </Button>
                                <Button size="md" onClick={resetFilter}>
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.t__container__action}>
                        <Button onClick={() => handleShowModalProject(Number(-1), 'create')} size="lg">
                            Novo Projeto
                        </Button>
                    </div>
                </header>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.table__tr}>
                            <th className={styles.table__th}>Nome do Cliente</th>
                            <th className={styles.table__th}>Concessionária</th>
                            <th className={styles.table__th}>Potência do Projeto(V)</th>
                            <th className={styles.table__th}>Estado</th>
                            <th className={styles.table__th}>Cidade</th>
                            <th className={styles.table__th}>Arquivo</th>
                            <th className={styles.table__th}>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map((item: any) => {
                            return (
                                <tr key={item.id} className={styles.table__tr}>
                                    <td className={styles.table__td}>{item.client_name}</td>
                                    <td className={styles.table__td}>{item.company_distribution}</td>
                                    <td className={styles.table__td}>{item.total_potency}</td>
                                    <td className={styles.table__td}>{item.state}</td>
                                    <td className={styles.table__td}>{item.city}</td>
                                    <td className={styles.table__td}>{item.city}</td>
                                    <td className={styles.table__td}>
                                        <div className={styles.td__group__button}>
                                            <Button bg="none" onClick={() => handleDeleteProject(Number(item.id))}>
                                                <Image src={deleteIcon} alt="delete icon" width={30} height={30}></Image>
                                            </Button>
                                            <Button bg="none" onClick={() => handleShowModalProject(Number(item.id), 'edit')}>
                                                <Image src={editIcon} alt="delete icon" width={27} height={30}></Image>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TableProject;
