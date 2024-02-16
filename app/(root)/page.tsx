import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import User from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";

type FetchPostsResult = {
  posts: any[]; // Adjust the type according to your post structure
};

export default async function Home() {
  const fetchedPosts: FetchPostsResult = await fetchPosts(1, 30);
  const user = await currentUser();
  // console.log(result);
  // console.log("hello world")
  // console.log(result._id)

  const result = fetchedPosts.posts.filter(post => !post.parentId);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      {/* console.log("hello");
      
      console.log(author.name);
       */}
      <section className="mt-9 flex flex-col gap-10">
        {result.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id} 
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.Children}
                isComment={false}
              />
            ))}
            {/* console.log("hello");
      
      console.log(author.name); */}
          </>
        )}
      </section>
    </>
  );
}
