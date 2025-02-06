import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function DocumentsPage() {
  return (
    <div className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base/7 font-semibold text-white">Documents</h1>
            <p className="mt-2 text-sm text-gray-400">View and manage your documents and knowledge base.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="flex items-center gap-x-2 rounded-md bg-primary px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <DocumentTextIcon className="size-5" aria-hidden="true" />
              Upload Document
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="rounded-lg border border-white/5 bg-gray-900/50 px-6 py-14 text-center">
            <DocumentTextIcon className="mx-auto size-12 text-gray-500" />
            <h3 className="mt-4 text-sm font-semibold text-white">No documents</h3>
            <p className="mt-2 text-sm text-gray-400">Upload documents to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
