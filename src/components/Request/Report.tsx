import {
  DocumentCheckIcon,
  DocumentMinusIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

import UploadFileButton from '../Form/UploadFileButton';

interface ReportProps {
  user: {
    user_type: 'Admin' | 'Cliente';
  };
  request: {
    accepted: boolean | null;
  };
  onAcceptReport: (accepted: boolean) => void;
}

export default function Report({ user, request, onAcceptReport }: ReportProps) {
  return (
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
                <span className="ml-2 w-0 flex-1 truncate">filee</span>
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
                {user.user_type !== 'Admin' && (
                  <>
                    <button
                      type="button"
                      className="rounded-md px-3 py-1 border border-gray-300 bg-white text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                      onClick={() => onAcceptReport(false)}
                    >
                      Rejeitar
                    </button>

                    <button
                      type="button"
                      className="rounded-md px-3 py-1 border border-transparent bg-blue-500 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                      onClick={() => onAcceptReport(true)}
                    >
                      Aprovar
                    </button>
                  </>
                )}
              </div>
            </li>
          </ul>

          {user.user_type === 'Admin' && (
            <div className="mt-4 flex flex-row-reverse">
              <UploadFileButton
                label="Enviar Relatório"
                onChange={e => console.log(e)}
              />
            </div>
          )}
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
    </dl>
  );
}
