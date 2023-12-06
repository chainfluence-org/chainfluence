import { getProjectByContractAddress } from "~~/app/actions";
import CreateCampaign from "~~/components/project/CreateCampaign";

export default async function Page({ params }: { params: { address: string } }) {
  const project = await getProjectByContractAddress(params.address);

  console.log(project);

  return <CreateCampaign />;
}
