import { Outlet, useRouteLoaderData } from "react-router";

import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import type { Theme } from "~/lib/theme";

type RootData = { readonly theme: Theme; readonly version: string | null };

export default function Shell() {
  const data = useRouteLoaderData<RootData>("root");

  return (
    <div className="flex min-h-dvh flex-col">
      <Header theme={data?.theme ?? "system"} version={data?.version ?? null} />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
