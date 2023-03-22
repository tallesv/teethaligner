import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import api from '@/client/api';

type UserProps = {
  id: number;
  name: string;
  email: string;
  user_type: number;
  created_at: string;
};

type orderProps = {
  field: string;
  order: 'ascending' | 'descending';
};

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [termSearched, setTermSearched] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<orderProps>({
    field: `birthDate`,
    order: `ascending`,
  });

  const { isLoading, error } = useQuery(
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

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  return (
    <Layout>
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
                    <td className="px-6 py-4">
                      <a
                        href="/"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Visualizar
                      </a>
                      <a
                        href="/"
                        className="font-medium mx-3 text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Editar
                      </a>
                      <a
                        href="/"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Excluir
                      </a>
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
