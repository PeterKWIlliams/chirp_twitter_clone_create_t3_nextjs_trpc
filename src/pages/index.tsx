import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/clerk-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api, RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.post.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  console.log(user);
  if (!user) return null;
  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mutate({ content: input });
          }
        }}
      />
      {input !== "" && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};
const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>something went wrong</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  //return empty div if user is not loaded
  if (!userLoaded) return <div></div>;
  //just used to start fetching data early
  api.post.getAll.useQuery();

  return (
    <PageLayout>
      <div className="flex justify-center">
        {!isSignedIn && (
          <div className="flex justify-center border-b border-slate-400 p-4">
            <SignInButton />
          </div>
        )}
        {!!isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
