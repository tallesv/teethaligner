import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import api from '@/client/api';
import Modal from '@/components/Modal';
import withSSRAuth from '@/utils/withSSRAuth';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import Select from '@/components/Form/Select';

type UserProps = {
  id: number;
  name: string;
  email: string;
  user_type: string;
  created_at: string;
};

type orderProps = {
  field: string;
  order: 'ascending' | 'descending';
};

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [openEditUserTypeModal, setEditUserTypeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termSearched, setTermSearched] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<orderProps>({
    field: `birthDate`,
    order: `ascending`,
  });

  const { isLoading, error, refetch } = useQuery(
    'users',
    () => api.get('/users').then(response => setUsers(response.data)),
    {
      refetchOnWindowFocus: false,
    },
  );

  function handleChangeDataOrder(
    field: string,
    order: 'ascending' | 'descending',
  ) {
    setDataOrder({ field, order });
  }

  const filteredUsers = users
    .filter(
      (user: UserProps) =>
        user.name.toLowerCase().includes(termSearched.toLowerCase()) ||
        user.email.toLowerCase().includes(termSearched.toLowerCase()),
    )
    .sort((a, b) =>
      dataOrder?.field === 'created_at' && dataOrder.order === `ascending`
        ? new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
        : new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
    );

  const [selectedUserId, setSelectedUserId] = useState<number>();
  const selectedUser = users.find(user => user.id === selectedUserId);

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  function handleOpenModalToDeleteUser(userId: number) {
    setSelectedUserId(userId);
    setOpenDeleteUserModal(true);
  }

  async function handleDeleteUser() {
    if (selectedUser?.user_type === 'Admin') {
      toast.warning(`Não é possível deletar contas do tipo "Admin"`);
      setOpenDeleteUserModal(false);
    } else {
      try {
        setIsSubmitting(true);
        await api.delete(`users/${selectedUser?.id}`);
        refetch();
      } catch (err) {
        toast.error(
          'Ocorreu um erro ao tentar exlucir usuário, por favor tente novamente.',
        );
      } finally {
        setIsSubmitting(false);
        setOpenDeleteUserModal(false);
      }
    }
  }
  function handleOpenModalToEditType(userId: number) {
    setSelectedUserId(userId);
    setEditUserTypeModal(true);
  }

  async function handleEditTypeUser() {
    try {
      setIsSubmitting(true);
      await api.put(`users/${selectedUser?.id}`, {});
      refetch();
    } catch (err) {
      toast.error(
        'Ocorreu um erro ao tentar exlucir usuário, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
      setOpenDeleteUserModal(false);
    }
  }

  return (
    <Layout>
      <Modal
        isOpen={openDeleteUserModal}
        title="Excluir usuário"
        content={
          <>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {`Você deseja exlcuir o usuário ${selectedUser?.name}(${selectedUser?.email})?`}
              </p>
            </div>
            <div className="mt-4 space-x-3 text-right">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                onClick={() => setOpenDeleteUserModal(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleDeleteUser}
              >
                <Spinner hidden={isSubmitting} />
                Deletar
              </button>
            </div>
          </>
        }
      />

      <Modal
        isOpen={openEditUserTypeModal}
        title="Editar tipo do usuário"
        content={
          <>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {`${selectedUser?.name}(${selectedUser?.email})`}
                <Select
                  id="user_type"
                  label="Tipo"
                  options={[
                    { label: `Admin`, value: 'Admin' },
                    { label: 'Cliente', value: 'Client' },
                  ]}
                />
              </p>
            </div>
            <div className="mt-4 space-x-3 text-right">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                onClick={() => setEditUserTypeModal(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleEditTypeUser}
              >
                <Spinner hidden={isSubmitting} />
                Editar
              </button>
            </div>
          </>
        }
      />

      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex flex-row-reverse my-4 mx-2">
            <div className="relative ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <MagnifyingGlassCircleIcon className="w-6 text-gray-500" />
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg w-80 bg-gray-200 focus:ring-blue-500 focus:outline-blue-500"
                placeholder="Procure por usuários"
                onChange={e => {
                  setCurrentPage(1);
                  setTermSearched(e.target.value);
                }}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">
                    Data de criação
                    <div className="mx-2">
                      <ChevronUpIcon
                        onClick={() =>
                          handleChangeDataOrder('created_at', `ascending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `created_at` &&
                          dataOrder.order === `ascending`
                            ? `text-blue-500`
                            : `text-gray-600`
                        }`}
                      />
                      <ChevronDownIcon
                        onClick={() =>
                          handleChangeDataOrder('created_at', `descending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `created_at` &&
                          dataOrder.order === `descending`
                            ? `text-blue-500`
                            : `text-gray-600`
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Opções
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers
                .slice((currentPage - 1) * 10, 10 * currentPage)
                .map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b ${
                      index % 2 === 1 ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
                    >
                      {user.name}
                    </th>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.user_type}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {/* <button
                        type="button"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => handleOpenModalToDeleteUser(user.id)}
                      >
                        Excluir
                      </button> */}
                      {/* <button
                        type="button"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => handleOpenModalToEditType(user.id)}
                      >
                        Alterar tipo
                      </button> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalQuantityOfData={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
