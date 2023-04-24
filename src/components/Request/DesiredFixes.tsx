import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Menu, Transition } from '@headlessui/react';

import { Fragment, useState } from 'react';
import classNames from '@/utils/bindClassNames';
import api from '@/client/api';
import { toast } from 'react-toastify';
import TextArea from '../Form/Textarea';
import Pagination from '../Pagination';

interface DesiredFixedProps {
  comments: CommentType[];
  onSendDesiredFixes: (content: string) => void;
  onDeleteComment: () => void;
  isSubmitting?: boolean;
}

type RequestCorrectionsFormData = {
  content: string;
};

const requestCorrectionFormSchema = yup.object().shape({
  content: yup.string().required('Por favor preencha as correções desejadas.'),
});

export default function DesiredFixes({
  comments,
  onSendDesiredFixes,
  onDeleteComment,
}: DesiredFixedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { register, handleSubmit, formState, reset } =
    useForm<RequestCorrectionsFormData>({
      resolver: yupResolver(requestCorrectionFormSchema),
    });

  async function handleRequestCorrectionsSubmit({
    content,
  }: RequestCorrectionsFormData) {
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

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit(handleRequestCorrectionsSubmit)}
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

      <div className="px-3">
        {comments
          .slice((currentPage - 1) * 10, 10 * currentPage)
          .map(comment => (
            <article
              key={comment.id}
              className="p-6 text-base bg-white border-t border-gray-200"
            >
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                      alt="Michael Gough"
                    />
                  </p>
                  <p className="text-sm text-gray-600">
                    <time dateTime="2022-02-08" title="February 8th, 2022">
                      {new Date(comment.updated_at).toLocaleDateString('pt-BR')}
                    </time>
                  </p>
                </div>
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
              </footer>
              <p className="text-gray-500">{comment.content}</p>
              <div className="flex items-center mt-4 space-x-4">
                {/* <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:underline"
        >
          <svg
            aria-hidden="true"
            className="mr-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Reply
        </button> */}
              </div>
            </article>
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalQuantityOfData={comments.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
