import api from '@/client/api';
import Layout from '@/components/Layout';
import classNames from '@/utils/bindClassNames';
import withSSRAuth from '@/utils/withSSRAuth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

const tabs = [
  { title: ' Dados da requisição' },
  { title: ' Relatório da programação' },
];

export default function ShowSetup() {
  const { query } = useRouter();
  const caseId = query.id as string;

  const [tabSelected, setTabSelected] = useState('Dados da requisição');

  const [request, setRequest] = useState<Setup>();

  const { isLoading, error } = useQuery(
    'users',
    () =>
      api.get(`/requests/${caseId}`).then(res => {
        const fields = JSON.parse(res.data.fields);
        const treatedRequest = {
          ...res.data,
          ...fields,
        };
        delete treatedRequest.fields;
        setRequest(treatedRequest);
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  return (
    <Layout>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Informações do Setup
          </h3>
          <div className="flex space-x-3">
            {tabs.map(tab => (
              <p
                key={tab.title}
                className={classNames(
                  tabSelected === tab.title ? 'text-blue-600' : 'text-gray-400',
                  'mt-1 max-w-2xl text-sm font-semibold',
                )}
              >
                {tab.title}
              </p>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">Paciente</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.patient_name}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">Endereço</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {`${request?.addresses[0].street} ${request?.addresses[0].number}, ${request?.addresses[0].district}, ${request?.addresses[0].state}, ${request?.addresses[0].postal_code}`}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Personalizando o planejamento
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.personalizando_o_planejamento}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Dentes a serem movimentados
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.dentes_a_serem_movimentados.join(' ')}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Prioridade para realização dos movimentos dentários
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.movimento_dentario}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Relação de caninos
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.relacao_de_caninos}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Relação de Molares
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.relacao_de_molares}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Sobremordida
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.sobremordida}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">Linha média</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.linha_media}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Informação relevante sobre como deseja que o tratamento ocorre
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.informacoes_adicionais}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Escaneamento
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 w-0 flex-1 truncate">
                        {request?.escaneamento_do_arco_superior}
                        <br />
                        <span className="text-xs text-gray-500">
                          Arco superior
                        </span>
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={request?.escaneamento_do_arco_superior}
                        target="_blank"
                        className="font-medium text-blue-600 hover:text-blue-500"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 w-0 flex-1 truncate">
                        {request?.escaneamento_do_arco_inferior}
                        <br />
                        <span className="text-xs text-gray-500">
                          Arco inferior
                        </span>
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={request?.escaneamento_do_arco_inferior}
                        target="_blank"
                        className="font-medium text-blue-600 hover:text-blue-500"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 w-0 flex-1 truncate">
                        {request?.escaneamento_do_registro_de_mordida}
                        <br />
                        <span className="text-xs text-gray-500">
                          Registro de mordida
                        </span>
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={request?.escaneamento_do_registro_de_mordida}
                        target="_blank"
                        className="font-medium text-blue-600 hover:text-blue-500"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Link do escaneamento
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <a
                  href={request?.escaneamento_link}
                  target="_blank"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  rel="noreferrer"
                >
                  {request?.escaneamento_link}
                </a>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-600">
                Encaminhei o email com os arquivos do escaneamento para
                alignerteeth@gmail.com
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {request?.encaminhei_email ? 'Sim' : 'Não'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
