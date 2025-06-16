import { useUser } from "@/contexts";

export const Settings = () => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="font-bold">Email</h2>
        <p>{user?.email}</p>
      </div>
      <div>
        <h2 className="font-bold">Household</h2>
        <p>{user?.groupName}</p>
      </div>
    </div>
  );
};
