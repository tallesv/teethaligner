import {
  DocumentCheckIcon,
  DocumentMinusIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Menu, Transition } from '@headlessui/react';

import { Fragment, useState } from 'react';
import classNames from '@/utils/bindClassNames';
import api from '@/client/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/pt-br';
import uploadFile from '@/utils/uploadFile';
import TextArea from '../Form/Textarea';
import Pagination from '../Pagination';
import UploadFileButton from '../Form/UploadFileButton';
import Spinner from '../Spinner';

interface ReportProps {
  user: {
    id: number;
    user_type: 'Admin' | 'Cliente';
  };
  request: {
    id: number;
    accepted: boolean | null;
    reports: {
      id: number;
      url: string;
      created_at: string;
    }[];
  };
  onAcceptReport: (accepted: boolean) => void;
  comments: CommentType[];
  onSendDesiredFixes: (content: string) => void;
  onDeleteComment: () => void;
  onSaveReport: () => void;
  isSubmitting?: boolean;
}

type RequestCorrectionsFormData = {
  content: string;
};

const requestCorrectionFormSchema = yup.object().shape({
  content: yup.string().required('Por favor preencha as correções desejadas.'),
});

export default function Report({
  user,
  request,
  onAcceptReport,
  comments,
  onSendDesiredFixes,
  onDeleteComment,
  onSaveReport,
}: ReportProps) {
  const [showAddReportInput, setShowAddReportInput] = useState(false);
  const [isUploadingReport, setIsUploadingReport] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  moment.locale('pt-br');

  const { register, handleSubmit, formState, reset } =
    useForm<RequestCorrectionsFormData>({
      resolver: yupResolver(requestCorrectionFormSchema),
    });

  async function handleCommentSubmit({ content }: RequestCorrectionsFormData) {
    onSendDesiredFixes(content);
    reset();
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await api.delete(`comments/${commentId}`);
      onDeleteComment();
    } catch (err) {
      toast.error(
        `Não foi possível deletar as correções, por favor tente novamente.`,
      );
    }
  }

  async function handleReportSubmit(file: File) {
    try {
      setIsUploadingReport(true);
      const fileUrl = await uploadFile(file);
      await api.post(`reports?request_id=${request.id}`, {
        url: fileUrl,
      });
      setShowAddReportInput(false);
      onSaveReport();
    } catch (err) {
      toast.error(
        'Não foi possível salvar o relatório,  por favor tente novamente.',
      );
    } finally {
      setIsUploadingReport(false);
    }
  }

  return (
    <dl>
      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="mb-2 sm:mb-0 text-sm font-medium text-gray-600">
          Relatórios da programação do seu tratamento
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {request.reports.length > 0 ? (
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {request.reports.map((report, index) => (
                <li
                  key={report.id}
                  className="flex flex-col sm:flex-row items-center justify-between py-3 pl-3 pr-4 text-sm"
                >
                  <div className="flex w-full sm:w-0 flex-1 items-center">
                    <DocumentTextIcon className="w-6 text-gray-800" />
                    <div className="ml-2 w-0 flex-1 truncate">
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {`Relatório ${index + 1}`}
                      </a>
                      <br />
                      <span className="text-xs text-gray-500">
                        {/* {`Relatório ${index + 1} · `} */}
                        <span>{moment(report.created_at).format('LLL')}</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-right font-medium">
              Relatório a ser adicionado.
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div className="flex flex-row-reverse space-x-4">
              {user.user_type === 'Admin' && !showAddReportInput && (
                <div>
                  {isUploadingReport ? (
                    <Spinner />
                  ) : (
                    <UploadFileButton
                      label="Adicionar relatório"
                      onChange={e =>
                        e.target.files && handleReportSubmit(e.target.files[0])
                      }
                    />
                  )}
                </div>
              )}
              {user.user_type !== 'Admin' && request.reports.length > 0 && (
                <>
                  <button
                    type="button"
                    className="ml-3 rounded-md px-3 py-1 border border-transparent bg-blue-500 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                    onClick={() => onAcceptReport(true)}
                  >
                    Aprovar
                  </button>

                  <button
                    type="button"
                    className="cursor-pointer rounded-md border-gray-300 border bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                    onClick={() => onAcceptReport(false)}
                  >
                    Solicitar alterações
                  </button>
                </>
              )}
            </div>
          </div>
        </dd>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-5 sm:px-6">
        {request.accepted === null && (
          <>
            <DocumentTextIcon className="w-16 sm:w-28 text-blue-500" />
            <h3 className="md:text-2xl mt-2 text-base text-gray-900 font-semibold text-center">
              Relatório pendente do aceite.
            </h3>
          </>
        )}
        {request.accepted && (
          <>
            <DocumentCheckIcon className="w-16 sm:w-28 text-green-500" />
            <h3 className="md:text-2xl mt-2 text-base text-gray-900 font-semibold text-center">
              Relatório aceito!
            </h3>
          </>
        )}
        {!request.accepted && request.accepted !== null && (
          <>
            <DocumentMinusIcon className="w-16 sm:w-28 text-red-500" />
            <h3 className="md:text-2xl mt-2 text-base text-gray-900 font-semibold text-center">
              Relatório negado.
            </h3>
          </>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit(handleCommentSubmit)}
          className="bg-white px-3 py-5"
        >
          <span className="block text-sm font-medium text-gray-600">
            Preencha aqui qualquer informação relevante sobre as correções
            desejadas:
          </span>
          <TextArea
            label="Descreva se deseja que algum movimento ocorra primeiro, se existe alguma taxa de movimentação especifica para algum dos movimentos, todos os detalhes que achar relevante. Quanto maior a quantidade de informação, mais personalizado seu tratamento."
            {...register('content')}
            error={!!formState.errors.content}
          />
          {formState.errors.content && (
            <span className="ml-1 text-sm font-medium text-red-500">
              {formState.errors.content?.message}
            </span>
          )}
          <div className="mt-2 flex flex-row-reverse">
            <button
              type="submit"
              className="flex items-center justify-center rounded-md border border-transparent py-2 px-7 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="px-3">
          {[...comments]
            .reverse()
            .slice((currentPage - 1) * 10, 10 * currentPage)
            .map(comment => (
              <article
                key={comment.id}
                className="p-6 text-base bg-white border-t border-gray-200"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="inline-flex items-center mr-1 text-sm text-gray-900 space-x-2">
                      {comment.user.avatar ? (
                        <img
                          className="mr-2 w-6 h-6 rounded-full"
                          src={comment.user.avatar}
                          alt={comment.user.name}
                        />
                      ) : (
                        <div className="relative w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <svg
                            className="absolute w-8 h-8 text-gray-400 -left-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      <span>{comment.user.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <time dateTime="2022-02-08" title="February 8th, 2022">
                        {` · ${moment(comment.updated_at).fromNow()}`}
                      </time>
                    </p>
                  </div>
                  {user.id === comment.user_id && (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-600 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50">
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          <span className="sr-only">Comment settings</span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute -right-11 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="button"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block w-full text-left px-4 py-2 text-sm text-gray-700',
                                )}
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Remover
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </footer>
                <p className="text-gray-500">{comment.content}</p>
              </article>
            ))}
        </div>
        {comments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalQuantityOfData={comments.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </dl>
  );
}
