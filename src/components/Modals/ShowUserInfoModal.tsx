import classNames from '@/utils/bindClassNames';
import DefaultAvatar from '@/utils/defaultAvatar';
import { Dialog, Transition } from '@headlessui/react';
import {
  CalendarDaysIcon,
  EnvelopeIcon,
  HomeIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_type: 'Admin' | 'Cliente';
    firebase_id: string;
    avatar: string | null;
    addresses: Address[];
    created_at: string;
  };
  onCloseModal: () => void;
}

export default function ShowUserInfoModal({
  isOpen,
  user,
  onCloseModal,
}: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  function handleCloseModal() {
    onCloseModal();
    setIsModalOpen(false);
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
              <Dialog.Panel className="w-full max-h-[34rem] overflow-auto space-y-5 max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900"
                >
                  {`Dados do usuário ${user.name}`}

                  <button
                    className="flex justify-center p-1 rounded-md border border-transparent hover:bg-gray-100"
                    type="button"
                    onClick={() => handleCloseModal()}
                  >
                    <XMarkIcon className="h-5 text-gray-700" />
                  </button>
                </Dialog.Title>
                <div className="flex flex-col space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm ">
                      {user.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.avatar}
                          alt="user avatar"
                        />
                      ) : (
                        <DefaultAvatar height={8} width={8} />
                      )}

                      <span
                        className={classNames(
                          user.user_type === 'Admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800',
                          'ml-3 rounded-full px-3 py-1 font-medium',
                        )}
                      >
                        {user.user_type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-6 mr-2 text-gray-600" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-6 mr-2 text-gray-600" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CalendarDaysIcon className="h-6 mr-2 text-gray-600" />
                      <span>{moment(user.created_at).format('LL')}</span>
                    </div>
                  </div>

                  {user.addresses.length > 0 && (
                    <div>
                      <div className="flex items-center">
                        <HomeIcon className="h-6 mr-2 text-gray-600" />
                        <span>Endereços</span>
                      </div>

                      <div className="grid grid-cols-2">
                        {user.addresses.map(address => (
                          <div
                            key={address.id}
                            className="group relative flex items-center py-2 px-2 text-gray-800 sm:text-sm text-xs font-semibol focus:outline-none sm:flex-1 sm:py-4"
                          >
                            <div className="flex justify-between w-full">
                              <span className="text-sm font-medium text-gray-800">
                                {`${address.street}${
                                  address.number ? `, ${address.number}` : ''
                                }`}
                                <span className="block my-1 text-xs font-medium text-gray-500">
                                  {`${address.district}, ${address.state}`}
                                  <br />
                                  {address.postal_code}
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
