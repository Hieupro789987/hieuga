import { createContext, useContext, useEffect, useState } from "react";
import { Post, PostService } from "../../../../lib/repo/post.repo";

export const WriterPostDetailContext = createContext<
  Partial<{
    post: Partial<Post>;
    setPost: (post: Partial<Post>) => void;
  }>
>({});

type PostProviderProps = ReactProps & {
  id: string;
};

export function WriterPostDetailProvider(props: PostProviderProps) {
  const { id } = props;
  const [post, setPost] = useState<Partial<Post>>(null);

  useEffect(() => {
    if (id !== null) {
      if (id) {
        PostService.getOne({ id }).then((res) => {
          setPost(res);
        });
      } else {
        setPost({});
      }
    } else {
      setPost(null);
    }
  }, [id]);

  return (
    <WriterPostDetailContext.Provider
      value={{
        post,
        setPost,
      }}
    >
      {props.children}
    </WriterPostDetailContext.Provider>
  );
}

export const useWriterPostDetailContext = () => useContext(WriterPostDetailContext);
