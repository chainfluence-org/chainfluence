import { getProjectByContractAddress } from "~~/app/actions";
import { auth } from "~~/auth";
import ProjectDetails from "~~/components/project/ProjectDetails";

export default async function Page({ params }: { params: { address: string } }) {
  const project = await getProjectByContractAddress(params.address);

  const userId = (await auth())?.id;

  const isOwner = userId === project?.id;

  return <ProjectDetails {...project} isOwner={isOwner} />;
}
