import { navigation } from "@govops/content/generated";
import { Outlet } from "react-router";

import { DocsSectionNav, DocsSidebar } from "~/features/docs/sidebar";

export default function DocsLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <DocsSectionNav sections={navigation} />
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <DocsSidebar sections={navigation} />
        <Outlet />
      </div>
    </div>
  );
}
