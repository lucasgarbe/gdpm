import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import ky from "ky-universal";

export default function PyMCModal({ id, closeModal }: any) {
  const { data, isLoading } = useQuery({
    queryKey: ["pymc", id],
    queryFn: () => {
      return ky.get(`${process.env.NEXT_PUBLIC_API_URL}/pymc/${id}/`).json();
    },
  });

  const { data: ipynb, isLoading: ipynbIsLoading } = useQuery({
    queryKey: ["ipynb", id],
    queryFn: () => {
      return ky.get(`${process.env.NEXT_PUBLIC_API_URL}/ipynb/${id}/`).json();
    },
  });

  return (
    <div className="fixed z-50 top-20 bottom-12 left-1/2 -translate-x-1/2 w-1/2 rounded bg-gray-100 flex flex-col gap-2 p-4">
      <div className="flex justify-end gap-4">
        <>
          {ipynb && (
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(ipynb)
              )}`}
              download={`gdpm-${id}.ipynb`}
              className="flex gap-1 p-1 bg-white rounded hover:bg-gray-200"
            >
              <ArrowDownTrayIcon className="w-5" />
              Download ipynb
            </a>
          )}
          {data && (
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                data.toString()
              )}`}
              download={`gdpm-${id}.py`}
              className="flex gap-1 p-1 bg-white rounded hover:bg-gray-200"
            >
              <ArrowDownTrayIcon className="w-5" />
              Download PyMC Code
            </a>
          )}
          <button
            onClick={() => closeModal()}
            className="p-1 bg-white rounded hover:bg-gray-200"
          >
            <XMarkIcon className="w-5" />
          </button>
        </>
      </div>
      <>
        {isLoading && <p>loading...</p>}
        {data && (
          <pre
            dangerouslySetInnerHTML={{
              __html: data.toString(),
            }}
            className="bg-white rounded p-2 h-full overflow-auto"
          ></pre>
        )}

        {ipynbIsLoading && <p>loading ipynb</p>}
        {ipynb && (
          <pre
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(ipynb),
            }}
            className="bg-white rounded p-2 h-full overflow-auto"
          ></pre>
        )}
      </>
    </div>
  );
}
