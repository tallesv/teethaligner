import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '@/client/api';
import TextArea from '@/components/Form/Textarea';
import Layout from '@/components/Layout';
import classNames from '@/utils/bindClassNames';
import withSSRAuth from '@/utils/withSSRAuth';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

const tabs = [
  { title: 'Dados da requisição' },
  { title: 'Relatório da programação' },
  { title: 'Correções desejadas' },
];

type RequestCorrectionsFormData = {
  corrections: string;
};

const requestCorrectionFormSchema = yup.object().shape({
  corrections: yup
    .string()
    .required('Por favor preencha as correções desejadas.'),
});

export default function ShowGuiasCirurgicos() {
  const { query } = useRouter();
  const caseId = query.id as string;

  const { register, handleSubmit, formState } =
    useForm<RequestCorrectionsFormData>({
      resolver: yupResolver(requestCorrectionFormSchema),
    });

  const [tabSelected, setTabSelected] = useState('Dados da requisição');

  const [request, setRequest] = useState<GuiasCirurgicos>();

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

  function handleRequestCorrectionsSubmit({
    corrections,
  }: RequestCorrectionsFormData) {
    console.log(corrections);
  }

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  return (
    <Layout>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <Tab.Group>
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Informações do Setup
            </h3>
            <Tab.List className="flex mt-2 space-x-4 rounded-xl py-1">
              {tabs.map(tab => (
                <Tab
                  key={tab.title}
                  onClick={() => setTabSelected(tab.title)}
                  className={({ selected }) =>
                    classNames(
                      'rounded-lg py-2.5 px-6 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'text-blue-600 shadow'
                        : ' text-gray-400 hover:bg-gray-100 hover:text-gray-900',
                    )
                  }
                >
                  {tab.title}
                </Tab>
              ))}
            </Tab.List>
          </div>
          <Tab.Panels className="mt-2">
            <div className="border-t border-gray-200">
              <Tab.Panel hidden={tabSelected !== 'Dados da requisição'}>
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
                      Paciente
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {request?.patient_name}
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
                      Endereço
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {`${request?.addresses[0].street} ${request?.addresses[0].number}, ${request?.addresses[0].district}, ${request?.addresses[0].state}, ${request?.addresses[0].postal_code}`}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
                      Escaneamento
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                        {request?.escaneamento_do_arco_superior.map(
                          arcoSuperior => (
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
                                  {arcoSuperior.slice(73)}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    Arco superior
                                  </span>
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a
                                  href={arcoSuperior}
                                  target="_blank"
                                  className="font-medium text-blue-600 hover:text-blue-500"
                                  rel="noreferrer"
                                >
                                  Download
                                </a>
                              </div>
                            </li>
                          ),
                        )}
                        {request?.escaneamento_do_arco_inferior.map(
                          arcoInferior => (
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
                                  {arcoInferior.slice(73)}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    Arco inferior
                                  </span>
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a
                                  href={arcoInferior}
                                  target="_blank"
                                  className="font-medium text-blue-600 hover:text-blue-500"
                                  rel="noreferrer"
                                >
                                  Download
                                </a>
                              </div>
                            </li>
                          ),
                        )}
                        {request?.escaneamento_do_registro_de_mordida.map(
                          registrDeMordida => (
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
                                  {registrDeMordida.slice(73)}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    Registro de mordida
                                  </span>
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a
                                  href={registrDeMordida}
                                  target="_blank"
                                  className="font-medium text-blue-600 hover:text-blue-500"
                                  rel="noreferrer"
                                >
                                  Download
                                </a>
                              </div>
                            </li>
                          ),
                        )}
                      </ul>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
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
                    <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
                      Encaminhei o email com os arquivos do escaneamento para
                      alignerteeth@gmail.com
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {request?.encaminhei_email ? 'Sim' : 'Não'}
                    </dd>
                  </div>
                </dl>
              </Tab.Panel>
              <Tab.Panel hidden={tabSelected !== 'Relatório da programação'}>
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
                      Relatório da programação do seu tratamento
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                        <li className="flex flex-col sm:flex-row items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-full sm:w-0 flex-1 items-center">
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
                              {request?.escaneamento_do_arco_superior.slice(73)}
                            </span>
                          </div>
                          <div className="ml-4 space-x-2 flex-shrink-0">
                            <a
                              href="/"
                              target="_blank"
                              className="font-medium text-blue-600 hover:text-blue-500"
                              rel="noreferrer"
                            >
                              Download
                            </a>
                            <button
                              type="button"
                              className="rounded-md px-3 py-1 border border-gray-300 bg-white text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                            >
                              Rejeitar
                            </button>

                            <button
                              type="button"
                              className="rounded-md px-3 py-1 border border-transparent bg-blue-500 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                            >
                              Aprovar
                            </button>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>

                  <form
                    onSubmit={handleSubmit(handleRequestCorrectionsSubmit)}
                    className="bg-white px-4 py-5"
                  >
                    <span className="block text-sm font-medium text-gray-600">
                      Preencha aqui qualquer informação relevante sobre as
                      correções desejadas:
                    </span>
                    <TextArea
                      label="Descreva se deseja que algum movimento ocorra primeiro, se existe alguma taxa de movimentação especifica para algum dos movimentos, todos os detalhes que achar relevante. Quanto maior a quantidade de informação, mais personalizado seu tratamento."
                      {...register('corrections')}
                      error={!!formState.errors.corrections}
                    />
                    <span className="ml-1 text-sm font-medium text-red-500">
                      {formState.errors.corrections?.message}
                    </span>
                    <div className="mt-2 flex flex-row-reverse">
                      <button
                        type="submit"
                        className="flex items-center justify-center rounded-md border border-transparent py-2 px-7 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      >
                        Solicitar correções
                      </button>
                    </div>
                  </form>
                </dl>
              </Tab.Panel>
            </div>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
