import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import withSSRAuth from '@/utils/withSSRAuth';
import api from '@/client/api';
import DeleteRequestModal from '@/components/Modals/DeleteRequestModal';
import useAuth from '@/hooks/useAuth';
import moment from 'moment';
import getRequestURLByType from '@/utils/getRequestURLByType';

type RequestsFromApi = {
  id: number;
  patient_name: string;
  user_id: number;
  product_name: string;
  created_at: string;
  fields: string;
  status: string;
};

type Request = {
  id: number;
  author: string;
  patient_name: string;
  user_id: number;
  product_name: string;
  created_at: string;
  updated_at: string;
  status: string;
  escaneamento_do_arco_inferior: string[];
  escaneamento_do_arco_superior: string[];
  escaneamento_do_registro_de_mordida: string[];
  logomarca?: string;
  reports: {
    id: number;
    url: string;
    updated_at: string;
  }[];
};

type orderProps = {
  field: 'created_at' | 'updated_at' | 'patient_name';
  order: 'ascending' | 'descending';
};

export default function Home() {
  const { userLogged } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<Request[]>([]);
  const [termSearched, setTermSearched] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<orderProps>({
    field: `updated_at`,
    order: `ascending`,
  });

  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] =
    useState(false);
  const [requestToDelete, setRequestToDelete] = useState({} as Request);

  function handleRequestsFromApi(data: RequestsFromApi[]) {
    const treatedRequests = data.map(item => {
      const fields = JSON.parse(item.fields);

      const requestInMap = {
        ...item,
        ...fields,
      };

      delete requestInMap.fields;
      return requestInMap;
    });

    setRequests(treatedRequests);
  }

  const { refetch: refetchRequestsFromUser } = useQuery('user', () => {
    if (userLogged && userLogged.user_type !== 'Admin') {
      api
        .get(`users/${userLogged?.firebase_id}`)
        .then(res => handleRequestsFromApi(res.data.requests));
    }
  });

  const { isLoading, error, refetch } = useQuery(
    'requests',
    () => {
      if (userLogged && userLogged.user_type === 'Admin') {
        api
          .get('/requests')
          .then(res => handleRequestsFromApi(res.data.requests));
      }
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    refetch();
    refetchRequestsFromUser();
  }, [refetch, refetchRequestsFromUser, userLogged]);

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  function handleChangeDataOrder(
    field: 'created_at' | 'updated_at' | 'patient_name',
    order: 'ascending' | 'descending',
  ) {
    setDataOrder({ field, order });
  }

  function sortRequests(a: Request, b: Request) {
    if (dataOrder.field === 'patient_name') {
      if (dataOrder.order === 'ascending') {
        return a.patient_name.toLowerCase() > b.patient_name.toLowerCase()
          ? 1
          : -1;
      }
      return b.patient_name.toLowerCase() > a.patient_name.toLowerCase()
        ? 1
        : -1;
    }
    if (dataOrder.order === 'ascending') {
      return (
        new Date(b[dataOrder.field]).valueOf() -
        new Date(a[dataOrder.field]).valueOf()
      );
    }
    return (
      new Date(a[dataOrder.field]).valueOf() -
      new Date(b[dataOrder.field]).valueOf()
    );
  }

  const filteredRequests = requests
    .filter((request: Request) =>
      request.patient_name.toLowerCase().includes(termSearched.toLowerCase()),
    )
    .sort((a, b) => sortRequests(a, b));

  function getBadgetByStatus(requestStatus: string) {
    switch (requestStatus) {
      case 'Nova':
        return (
          <span className="flex items-center space-x-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
            <span className="-ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
            <span>{requestStatus}</span>
          </span>
        );
      case 'Em planejamento':
        return (
          <span className="flex items-center space-x-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
            <span className="-ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
            <span>{requestStatus}</span>
          </span>
        );
      case 'Em produção':
        return (
          <span className="flex items-center space-x-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
            <span className="-ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{requestStatus}</span>
          </span>
        );
      case 'Enviado/Entregue':
        return (
          <span className="flex items-center space-x-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
            <span className="-ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
            <span>{requestStatus}</span>
          </span>
        );
      default:
        return requestStatus;
    }
  }

  return (
    <Layout>
      <DeleteRequestModal
        isOpen={isDeleteRequestModalOpen}
        request={requestToDelete}
        onCloseModal={() => {
          setIsDeleteRequestModalOpen(false);
          setRequestToDelete({} as Request);
        }}
        onDelete={() => refetch()}
      />

      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between my-4 mx-2">
            <Link href="/products">
              <button
                type="button"
                className="
                text-white bg-blue-600 border border-transparent
                  focus:outline-none hover:bg-blue-700 focus:ring-blue-500 font-medium
                  focus:ring-2 focus:ring-offset-2
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
                  <div className="flex items-center">
                    Paciente
                    <div className="mx-2">
                      <ChevronUpIcon
                        onClick={() =>
                          handleChangeDataOrder('patient_name', `ascending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `patient_name` &&
                          dataOrder.order === `ascending`
                            ? `text-blue-500`
                            : `text-gray-600`
                        }`}
                      />
                      <ChevronDownIcon
                        onClick={() =>
                          handleChangeDataOrder('patient_name', `descending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `patient_name` &&
                          dataOrder.order === `descending`
                            ? `text-blue-500`
                            : `text-gray-600`
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">
                    Data de solicitação
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
                  <div className="flex items-center">
                    Data de atualização
                    <div className="mx-2">
                      <ChevronUpIcon
                        onClick={() =>
                          handleChangeDataOrder('updated_at', `ascending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `updated_at` &&
                          dataOrder.order === `ascending`
                            ? `text-blue-500`
                            : `text-gray-600`
                        }`}
                      />
                      <ChevronDownIcon
                        onClick={() =>
                          handleChangeDataOrder('updated_at', `descending`)
                        }
                        className={`w-4 cursor-pointer ${
                          dataOrder?.field === `updated_at` &&
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
              {filteredRequests
                .slice((currentPage - 1) * 10, 10 * currentPage)
                .map((request, index) => (
                  <tr
                    key={request.id}
                    className={`border-b ${
                      index % 2 === 1 ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <td className="px-3 py-4 text-gray-700">
                      <div className="flex items-center ">
                        <span>{request.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {request.patient_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {request.product_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {getBadgetByStatus(request.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(request.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {moment(new Date(request.updated_at)).format(
                        'DD/MM/YYYY HH:mm:ss',
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`${getRequestURLByType(request.product_name)}/${
                          request.id
                        }`}
                        legacyBehavior
                      >
                        <a
                          href={`${getRequestURLByType(request.product_name)}/${
                            request.id
                          }`}
                          className="mx-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Visualizar
                        </a>
                      </Link>
                      {/* <Link href={getEditRequestUrl(request)} legacyBehavior>
                        <a
                          href={getEditRequestUrl(request)}
                          className="font-medium mx-1 text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Editar
                        </a>
                      </Link> */}
                      {userLogged?.user_type === 'Admin' && (
                        <button
                          type="button"
                          className="contents font-medium text-blue-600 dark:text-blue-500 hover:cursor-pointer"
                          onClick={() => {
                            setIsDeleteRequestModalOpen(true);
                            setRequestToDelete(request);
                          }}
                        >
                          <span className="hover:underline">Excluir</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalQuantityOfData={filteredRequests.length}
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
