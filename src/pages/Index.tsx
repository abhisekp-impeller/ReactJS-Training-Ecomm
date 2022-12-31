import { useRouteLoaderData } from "react-router-dom";
import { User } from "../types/User";

export const Index = () => {
  const { user } = useRouteLoaderData("root") as { user: User }
  return <>
    <h1 className="display-1">
      Dashboard {user.name}
    </h1>
  </>
}