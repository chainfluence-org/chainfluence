import { getProjectByContractAddress } from "~~/app/actions";
import { auth } from "~~/auth";
import CreateCampaign from "~~/components/project/CreateCampaign";

export default async function Page({ params }: { params: { address: string } }) {
  const project = await getProjectByContractAddress(params.address);

  const userId = (await auth())?.id;

  const isOwner = userId === project?.id;

  if (!isOwner) {
    return <div>Not authorized</div>;
  }

  return <CreateCampaign name={project?.name || ""} address={project?.token_contract_address || ""} />;
}
