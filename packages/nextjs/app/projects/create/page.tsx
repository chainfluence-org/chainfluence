import { redirect } from "next/navigation";
import { getProject } from "~~/app/actions";
import { auth } from "~~/auth";
import CreateProject from "~~/components/project/CreateProject";

export default async function Page() {
  const user = await auth();

  console.log({ user });

  if (!user) {
    redirect("/");
  }

  const data = await getProject(user.id);

  if (data) {
    redirect(`/projects/${data.token_contract_address}`);
  }

  return <CreateProject />;
}
