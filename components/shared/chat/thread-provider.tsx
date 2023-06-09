import { cloneDeep } from "lodash";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { Thread, ThreadRole, ThreadService } from "../../../lib/repo/thread.repo";
import { Spinner } from "../utilities/misc";
import { useChatContext } from "./chat-provider";
export const ThreadContext = createContext<
  Partial<{
    selecThread: Thread;
    setSelectThread: Dispatch<SetStateAction<Thread>>;
    threads: Thread[];
    setThreads: (items: Thread[]) => any;
    total: number;
    senderId: string;
    senderRole: ThreadRole;
    receiverRole: ThreadRole;
    selectedThread: Thread;
    selectThread: (thread: Thread) => any;
    fetchThread: (id: string, selectAfterFetch?: boolean) => Promise<Thread>;
    loadMore: () => Promise<Thread[]>;
  }>
>({});
interface Props extends ReactProps {
  senderRole: ThreadRole;
  receiverRole: ThreadRole;
  senderId: string;
}
export function ThreadProvider({ senderId, senderRole, receiverRole, ...props }: Props) {
  const [selectedThread, setSelectedThread] = useState<Thread>();
  const [threads, setThreads] = useState<Thread[]>();
  const [total, setTotal] = useState<number>(0);
  const toast = useToast();
  const { threadStream } = useChatContext();

  useEffect(() => {
    ThreadService.getAll({
      query: {
        limit: 10,
        order: { lastMessageAt: -1 },
        filter: { messageId: { $exists: true } },
      },
      cache: false,
    }).then((res) => {
      setTotal(res.total);
      setThreads(cloneDeep(res.data));
    });
  }, []);

  const loadMore = async () => {
    const res = await ThreadService.getAll({
      query: {
        limit: 10,
        order: { lastMessageAt: -1 },
        filter: { _id: { $nin: threads.map((x) => x.id) }, messageId: { $exists: true } },
      },
      toast,
      cache: false,
    });
    setThreads([...threads, ...cloneDeep(res.data)]);
    return res.data;
  };

  useEffect(() => {
    if (threads && !selectedThread) {
      selectThread(threads[0]);
    }
  }, [threads]);

  useEffect(() => {
    if (threadStream && threads) {
      fetchThread(threadStream.thread.id, false, threadStream.thread.snippet);
    }
  }, [threadStream]);

  const selectThread = (thread: Thread) => {
    setSelectedThread(null);
    setTimeout(() => {
      setSelectedThread(thread);
    });
  };

  const fetchThread = async (id: string, selectAfterFetch?: boolean, snippet?: string) => {
    const index = threads.findIndex((x) => x.id == id);
    if (index >= 0) {
      const item = threads[index];
      threads.splice(index, 1);
      threads.splice(0, 0, item);
      if (snippet) {
        item.snippet = snippet;
      }
      setThreads([...threads]);
      if (selectAfterFetch) selectThread(threads[0]);
      return threads[0];
    } else {
      try {
        const thread = await ThreadService.getOne({ id, fragment: ThreadService.shortFragment });
        setThreads([cloneDeep(thread), ...threads]);
        if (selectAfterFetch) selectThread(thread);
        return thread;
      } catch (err) {
        console.error(err);
        toast.error("Không tìm thấy cuộc trò chuyện. " + err.message);
      }
    }
  };

  return (
    <ThreadContext.Provider
      value={{
        threads,
        setThreads,
        total,
        loadMore,
        senderId,
        senderRole,
        receiverRole,
        selectedThread,
        selectThread,
        fetchThread,
      }}
    >
      {threads ? <>{props.children}</> : <Spinner />}
    </ThreadContext.Provider>
  );
}

export const useThreadContext = () => useContext(ThreadContext);
