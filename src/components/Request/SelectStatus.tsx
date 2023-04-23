import classNames from '@/utils/bindClassNames';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';

const allStatus = [
  { id: 1, name: 'Nova', badgeColor: 'bg-green-600' },
  { id: 2, name: 'Em planejamento', badgeColor: 'bg-purple-600' },
  { id: 3, name: 'Em produção', badgeColor: 'bg-blue-600' },
  { id: 4, name: 'Enviado/Entregue', badgeColor: 'bg-red-600' },
];

interface SelecStatus {
  status: string;
  onSelectStatus: (status: string) => void;
}

export default function SelectStatus({ status, onSelectStatus }: SelecStatus) {
  const currentStatus =
    allStatus.find(item => item.name === status) ?? allStatus[0];

  return (
    <Listbox
      value={currentStatus}
      onChange={statusObject => onSelectStatus(statusObject.name)}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 px-6 pr-10 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 font-medium leading-5 text-sm">
          <div className="flex items-center justify-center">
            <span className="block truncate">{currentStatus.name}</span>
            <span
              className={classNames(
                'ml-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                currentStatus.badgeColor,
              )}
            />
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {allStatus.map(item => (
              <Listbox.Option
                key={item.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {item.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
