import Link from "next/link";
import { getProjects } from "~~/app/actions";

export default async function Page() {
  const projects = (await getProjects()) as any[];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-10">
      {projects.map(project => (
        <div
          key={project.name}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={project?.twitter_image_url || ""} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/projects/${project.token_contract_address}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{project.name}</p>
              <p className="truncate text-sm text-gray-500">{project.token_symbol}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
