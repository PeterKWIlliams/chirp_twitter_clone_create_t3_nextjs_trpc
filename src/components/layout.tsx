import Link from "next/link";
import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="flex-col">
        <Link href={"/index"}></Link>
      </div>
      <div className="h-full w-full overflow-y-scroll border-x border-slate-400 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
