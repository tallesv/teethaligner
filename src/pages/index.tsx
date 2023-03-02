import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type UserProps = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  gender: string;
  birthDate: string;
};

type orderProps = {
  field: string;
  order: 'ascending' | 'descending';
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [termSearched, setTermSearched] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<orderProps>({
    field: `birthDate`,
    order: `ascending`,
  });

  const { isLoading, error } = useQuery(
    'users',
    () =>
      fetch('https://dummyjson.com/users')
        .then(res => res.json())
        .then(json => setUsers(json.users)),
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
        user.firstName.toLowerCase().includes(termSearched.toLowerCase()) ||
        user.lastName.toLowerCase().includes(termSearched.toLowerCase()),
    )
    .sort((a, b) =>
      dataOrder?.field === 'birthDate' && dataOrder.order === `ascending`
        ? new Date(b.birthDate).valueOf() - new Date(a.birthDate).valueOf()
        : new Date(a.birthDate).valueOf() - new Date(b.birthDate).valueOf(),
    );

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  return (
    <Layout>
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between mb-6 mx-2">
            <Link href="/select-product">
              <button
                type="button"
                className="
            text-gray-500 bg-gray-200 border border-gray-300
              focus:outline-none hover:bg-gray-300 focus:ring-gray-200 font-medium
              rounded-lg text-sm px-3 py-1.5"
              >
                Adicionar solicitação
              </button>
            </Link>
            <div className="relative ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <MagnifyingGlassCircleIcon className="w-6 text-gray-500" />
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg w-80 bg-gray-200 focus:ring-blue-500 focus:outline-blue-500"
                placeholder="Procure por solicitações"
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
                  Solicitante
                </th>
                <th scope="col" className="px-6 py-3">
                  Paciente
                </th>
                <th scope="col" className="px-6 py-3">
                  Responsável
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Produto</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">
                    Data
                    <div className="mx-2">
                      <ChevronUpIcon
                        onClick={() =>
                          handleChangeDataOrder('birthDate', `ascending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `birthDate` &&
                          dataOrder.order === `ascending`
                            ? `text-blue-500`
                            : `text-gray-600`
                        }`}
                      />
                      <ChevronDownIcon
                        onClick={() =>
                          handleChangeDataOrder('birthDate', `descending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `birthDate` &&
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
                      {user.firstName}
                    </th>
                    <td className="px-6 py-4 text-gray-700">{user.lastName}</td>
                    <td className="px-6 py-4 text-gray-700">{user.age}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.birthDate}
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
