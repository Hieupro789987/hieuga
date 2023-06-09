import { useAuth } from "../../../lib/providers/auth-provider";
import { ThreadProvider } from "../../shared/chat/thread-provider";
import { ThreadBox } from "../../shared/chat/thread-box";
import { ThreadList } from "../../shared/chat/thread-list";

export function ChatPage() {
  const { user } = useAuth();
  return (
    <div
      className="w-full border shadow bg-white rounded flex"
      style={{ height: "calc(100vh - 104px)" }}
    >
      <ThreadProvider senderId={user.id} senderRole="ADMIN" receiverRole="MEMBER">
        <ThreadList />
        <ThreadBox height="calc(100vh - 180px)" />
      </ThreadProvider>
    </div>
  );
}
