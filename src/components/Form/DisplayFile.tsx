import classNames from '@/utils/bindClassNames';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler } from 'react';

interface DisplayFileProps {
  fileURL?: string;
  fileName: string;
  onRemoveFile?: (e: MouseEventHandler<HTMLButtonElement>) => void;
}

export default function DisplayFile({
  fileName,
  fileURL,
  onRemoveFile,
}: DisplayFileProps) {
  return (
    <div className="w-full">
      <div
        className={classNames(
          'flex justify-between py-3 px-2 border-2 rounded-md border-gray-300',
        )}
      >
        <div className="flex items-center flex-1 min-w-0 px-1">
          <PhotoIcon className="w-7 text-blue-500" />
          {fileURL ? (
            <a
              href={fileURL}
              target="_blank"
              rel="noreferrer"
              className="ml-2 flex-1 truncate hover:text-blue-500 hover:underline"
            >
              {fileName}
            </a>
          ) : (
            <span className="ml-2 flex-1 truncate">{fileName}</span>
          )}
        </div>

        <button
          type="button"
          className="group relative rounded-md p-1 hover:bg-gray-100 hover:cursor-pointer"
          onClick={onRemoveFile}
        >
          {/* <span
            className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2
                  -translate-x-1/2 translate-y-full opacity-0 mx-auto"
          >
            Remover arquivo
          </span> */}
          <TrashIcon className="w-5 text-gray-400 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
}
