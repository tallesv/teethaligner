import api from '@/client/api';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import deleteFile from '@/utils/deleteFile';
import Spinner from '../Spinner';

interface ModalProps {
  isOpen: boolean;
  request: {
    id: number;
    patient_name: string;
    product_name: string;
    escaneamento_do_arco_inferior: string[];
    escaneamento_do_arco_superior: string[];
    escaneamento_do_registro_de_mordida: string[];
    logomarca?: string;
  };
  onCloseModal: () => void;
  onDelete: () => void;
}

export default function DeleteRequestModal({
  isOpen,
  request,
  onCloseModal,
  onDelete,
}: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [isSubmiting, setIsSubmiting] = useState(false);

  function handleCloseModal() {
    onCloseModal();
    setIsModalOpen(false);
  }

  async function handleDeleteRequest() {
    try {
      setIsSubmiting(true);

      await Promise.all(
        request.escaneamento_do_arco_superior.map(item => deleteFile(item)),
      );
      await Promise.all(
        request.escaneamento_do_arco_inferior.map(item => deleteFile(item)),
      );
      await Promise.all(
        request.escaneamento_do_registro_de_mordida.map(item =>
          deleteFile(item),
        ),
      );

      if (request.logomarca) {
        await deleteFile(request.logomarca);
      }

      await api.delete(`requests/${request.id}`);

      toast.success('A requisição foi excluída.');
      onDelete();
      handleCloseModal();
    } catch (err) {
      toast.error(
        'Não foi possível excluir a requisição, por favor tente novamente.',
      );
    } finally {
      setIsSubmiting(false);
    }
  }

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => handleCloseModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full space-y-5 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Excluir Requisição
                </Dialog.Title>
                <div>
                  <p className="text-sm text-gray-500">
                    {`Você deseja exlcuir a requisição ${request.product_name} do paciente ${request.patient_name}?`}
                  </p>
                </div>
                <div className="space-x-3 text-right">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2"
                    onClick={() => handleCloseModal()}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleDeleteRequest}
                  >
                    <Spinner hidden={!isSubmiting} />
                    Deletar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
