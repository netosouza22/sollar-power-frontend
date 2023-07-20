import deleteIcon from '@/assets/icons/delete.svg';
import editIcon from '@/assets/icons/edit.svg';
import eyePlusIcon from '@/assets/icons/eye-plus.svg';
import Button from '@/components/base/Button';
import ModalUser from '@/components/modals/ModalUser';
import { api } from '@/services/api';
import { states } from '@/utils/states';
import { Backdrop } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import styles from '../table.module.scss';

type Users = {
    id: number;
    name: string;
    email: string;
    cpf: number;
    cellphone: string;

    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    number: number;
};

const TableUser = () => {
    const [showModal, setShowModal] = useState(false);
    console.log('🚀 ~ file: index.tsx:32 ~ TableUser ~ showModal', showModal);
    const [idProject, setIdProject] = useState<number>(-1);
    const [accessType, setAccessType] = useState('create');
    const [filter, setFilter] = useState('');

    const [reload, setReload] = useState(false);
    const [users, setUsers] = useState<Users[]>([]);
    const [allUsers, setAllUsers] = useState<Users[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            await api
                .get('/users')
                .then((res) => {
                    setUsers(res.data);
                    setAllUsers(res.data);
                })
                .catch((err) => console.log(err));
        };

        getUsers();
    }, [reload]);

    const handleReload = () => {
        setReload((s) => !s);
    };

    const filterUsers = () => {
        const filteredProjects = allUsers?.filter((item) => {
            return item.state === filter;
        });

        setUsers(filteredProjects);
    };

    const resetFilter = () => {
        setUsers(allUsers);
    };

    const handleDeleteUser = async (id: number) => {
        await api
            .delete(`/users/${id}`)
            .then((res) => {
                handleReload();
            })
            .catch((err) => console.log(err));
    };

    const handleShowModalUser = useCallback((id: number, accessTypeModal: string) => {
        setIdProject(id);
        setAccessType(accessTypeModal);
        setShowModal(true);
    }, []);

    const handleHideModal = () => {
        setShowModal(false);
    };

    if (allUsers.length === 0) {
        return <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} />;
    }

    return (
        <>
            {showModal && <ModalUser handleReload={handleReload} showModal={showModal} hideModal={handleHideModal} id={idProject} accessType={accessType} />}

            <div className={styles.table__container}>
                <header className={styles.t__container__header}>
                    <div className={styles.t__container__info}>
                        <h5>Usuários</h5>
                        <span>{users?.length} Usuários</span>

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
                                <Button size="md" onClick={filterUsers}>
                                    Filtrar
                                </Button>
                                <Button size="md" onClick={resetFilter}>
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.t__container__action}>
                        <Button onClick={() => handleShowModalUser(Number(-1), 'create')} size="lg">
                            Novo Usuário
                        </Button>
                    </div>
                </header>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.table__tr}>
                            <th className={styles.table__th}>Nome</th>
                            <th className={styles.table__th}>email</th>
                            <th className={styles.table__th}>telefone</th>
                            <th className={styles.table__th}>CPF</th>
                            <th className={styles.table__th}>Estado</th>
                            <th className={styles.table__th}>Cidade</th>
                            <th className={styles.table__th}>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users?.map((item: Users) => {
                            return (
                                // <Link key={item.id} href="/home">
                                <tr key={item.id} className={styles.table__tr}>
                                    <td className={styles.table__td}>{item.name}</td>
                                    <td className={styles.table__td}>{item.email}</td>
                                    <td className={styles.table__td}>{item.cpf}</td>
                                    <td className={styles.table__td}>{item.cellphone}</td>
                                    <td className={styles.table__td}>{item.state}</td>
                                    <td className={styles.table__td}>{item.city}</td>
                                    <td className={styles.table__td}>
                                        <div className={styles.td__group__button}>
                                            <Button
                                                bg="none"
                                                // onClick={() => handleDeleteUser(Number(item.id))}
                                            >
                                                <Link href={`/user/${encodeURIComponent(item.id)}`}>
                                                    <Image src={eyePlusIcon} alt="delete icon" width={30} height={30}></Image>
                                                </Link>
                                            </Button>
                                            <Button bg="none" onClick={() => handleDeleteUser(Number(item.id))}>
                                                <Image src={deleteIcon} alt="delete icon" width={30} height={30}></Image>
                                            </Button>
                                            <Button bg="none" onClick={() => handleShowModalUser(Number(item.id), 'edit')}>
                                                <Image src={editIcon} alt="delete icon" width={27} height={30}></Image>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                // </Link>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TableUser;

// export async function getStaticPaths() {
//     // Return a list of possible value for id
// }

// export const getStaticProps: GetStaticProps = async () => {
//     return {
//         props: {},
//         revalidate: 60 * 60 * 1,
//     };
// };
