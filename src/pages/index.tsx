import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import withSSRAuth from '@/utils/withSSRAuth';
import api from '@/client/api';
import DeleteRequestModal from '@/components/Modals/DeleteRequestModal';

type RequestsFromApi = {
  id: number;
  patient_name: string;
  user_id: number;
  product_name: string;
  created_at: string;
  fields: string;
  status: string;
};

type orderProps = {
  field: string;
  order: 'ascending' | 'descending';
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<RequestsFromApi[]>([]);
  const [termSearched, setTermSearched] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<orderProps>({
    field: `birthDate`,
    order: `ascending`,
  });

  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] =
    useState(false);
  const [requestToDelete, setRequestToDelete] = useState({} as RequestsFromApi);

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

  const { isLoading, error, refetch } = useQuery(
    'users',
    () => api.get('/requests').then(res => handleRequestsFromApi(res.data)),
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

  const filteredRequests = requests
    .filter((request: RequestsFromApi) =>
      request.patient_name.toLowerCase().includes(termSearched.toLowerCase()),
    )
    .sort((a, b) =>
      dataOrder?.field === 'created_at' && dataOrder.order === `ascending`
        ? new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
        : new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf(),
    );

  function getRequestUrl(request: RequestsFromApi) {
    switch (request.product_name) {
      case 'Setup':
        return `/products/setup/${request.id}`;
      case 'Alinhadores - Programação TeethAligner':
        return `/products/alinhadores/programacao-teethaligner/${request.id}`;
      case 'Alinhadores - Apenas Imprimir':
        return `/products/alinhadores/apenas-imprimir/${request.id}`;
      case 'Moldagem de Transferência Virtual':
        return `/products/transferencia-virtual/${request.id}`;
      case 'Modelos/Guias Cirúrgicos':
        return `/products/guias-cirurgicos/${request.id}`;
      default:
        return '';
    }
  }

  function getEditRequestUrl(request: RequestsFromApi) {
    switch (request.product_name) {
      case 'Setup':
        return `/products/setup/edit/${request.id}`;
      case 'Alinhadores - Programação TeethAligner':
        return `/products/alinhadores/programacao-teethaligner/edit/${request.id}`;
      case 'Alinhadores - Apenas Imprimir':
        return `/products/alinhadores/apenas-imprimir/edit/${request.id}`;
      case 'Moldagem de Transferência Virtual':
        return `/products/transferencia-virtual/edit/${request.id}`;
      case 'Modelos/Guias Cirúrgicos':
        return `/products/guias-cirurgicos/edit/${request.id}`;
      default:
        return '';
    }
  }

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  return (
    <Layout>
      <DeleteRequestModal
        isOpen={isDeleteRequestModalOpen}
        request={requestToDelete}
        onCloseModal={() => {
          setIsDeleteRequestModalOpen(false);
          setRequestToDelete({} as RequestsFromApi);
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
                  Paciente
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
                    <td className="px-6 py-4 text-gray-700" />
                    <td className="px-6 py-4 text-gray-700">
                      {request.patient_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {request.product_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {request.status}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(request.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={getRequestUrl(request)} legacyBehavior>
                        <a
                          href={getRequestUrl(request)}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Visualizar
                        </a>
                      </Link>
                      <Link href={getEditRequestUrl(request)} legacyBehavior>
                        <a
                          href={getEditRequestUrl(request)}
                          className="font-medium mx-3 text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Editar
                        </a>
                      </Link>
                      <button
                        type="button"
                        className="contents font-medium text-blue-600 dark:text-blue-500 hover:underline hover:cursor-pointer"
                        onClick={() => {
                          setIsDeleteRequestModalOpen(true);
                          setRequestToDelete(request);
                        }}
                      >
                        Excluir
                      </button>
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
