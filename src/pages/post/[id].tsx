import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  console.log("this is the", id);
  if (typeof id !== "string") throw new Error("no slug");

  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.post.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
