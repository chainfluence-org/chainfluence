import { getProjectByContractAddress } from "~~/app/actions";
import ProjectDetails from "~~/components/project/ProjectDetails";

export default async function Page({ params }: { params: { address: string } }) {
  const project = await getProjectByContractAddress(params.address);

  return <ProjectDetails {...project} />;
}
