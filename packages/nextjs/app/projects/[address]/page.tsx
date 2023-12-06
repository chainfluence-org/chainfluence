import { getProjectByContractAddress } from "~~/app/actions";
import ViewProject from "~~/components/project/ViewProject";

export default async function Page({ params }: { params: { address: string } }) {
  const project = await getProjectByContractAddress(params.address);

  return <ViewProject {...project} />;
}
