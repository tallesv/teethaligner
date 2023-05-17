import api from '@/client/api';
import Layout from '@/components/Layout';
import classNames from '@/utils/bindClassNames';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import SelectStatus from '@/components/Request/SelectStatus';
import Report from '@/components/Request/Report';
import withSSRRequestProtect from '@/utils/withSSRRequestProtect';

const tabs = [
  { title: 'Relatório da programação' },
  { title: 'Dados da requisição' },
];

export default function ShowGuiasCirurgicos() {
  const { userLogged } = useAuth();

  const { query } = useRouter();
  const caseId = query.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState<GuiasCirurgicos>();

  const { isLoading, error, refetch } = useQuery(
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

  async function handleEditRequest(values: object) {
    await api.put(`requests/${caseId}?user_id=${userLogged?.firebase_id}`, {
      ...values,
    });

    refetch();
  }

  async function handleRequestCorrectionsSubmit(content: string) {
    try {
      setIsSubmitting(true);

      await api.post(
        `comments?user_id=${userLogged?.firebase_id}&request_id=${caseId}`,
        {
          content,
        },
      );
      handleEditRequest({ accepted: false });

      refetch();
    } catch (err) {
      toast.error(
        `Não foi possível enviar as correções, por favor tente novamente.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  return (
    <Layout>
      {request && userLogged && (
        <div
          className={classNames(
            isSubmitting ? 'pointer-events-none' : '',
            'overflow-hidden bg-white shadow sm:rounded-lg',
          )}
        >
          <Tab.Group>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {`Informações do Setup - ${request.patient_name}`}
              </h3>
              <Tab.List className="grid grid-cols-4 gap-4 mt-2 rounded-xl py-1">
                {tabs.map(tab => (
                  <Tab
                    key={tab.title}
                    className={({ selected }) =>
                      classNames(
                        'col-span-3 sm:col-span-2 md:col-span-1 rounded-lg py-2.5 px-6 text-sm font-medium leading-5',
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

                {userLogged.user_type === 'Admin' && (
                  <div className="col-span-3 sm:col-span-2 md:col-span-1">
                    <SelectStatus
                      status={request.status}
                      onSelectStatus={status => handleEditRequest({ status })}
                    />
                  </div>
                )}
              </Tab.List>
            </div>
            <Tab.Panels className="mt-2">
              <div className="border-t border-gray-200">
                <Tab.Panel>
                  <Report
                    request={request}
                    user={userLogged}
                    onAcceptReport={accepted => handleEditRequest({ accepted })}
                    comments={request.comments}
                    onSendDesiredFixes={content =>
                      handleRequestCorrectionsSubmit(content)
                    }
                    onDeleteComment={() => refetch()}
                    onSaveReport={() => handleEditRequest({ accepted: null })}
                  />
                </Tab.Panel>
                <Tab.Panel>
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
                        {`${request?.addresses[0].street}${
                          request?.addresses[0].number
                            ? ` ${request?.addresses[0].number},`
                            : ','
                        } ${request?.addresses[0].district}, ${
                          request?.addresses[0].state
                        }, ${request?.addresses[0].postal_code}`}
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
                              <li
                                key={arcoSuperior}
                                className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                              >
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
                              <li
                                key={arcoInferior}
                                className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                              >
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
                              <li
                                key={registrDeMordida}
                                className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                              >
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
              </div>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = withSSRRequestProtect(async () => {
  return {
    props: {},
  };
});
