import { Lock, Sparkles, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { qnaAPI } from "../../api/qna.api";

export default function AskFinwiseWidget({
  hasTransactions,
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  const askQuestion = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !hasTransactions || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: trimmedQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const result = await qnaAPI.ask(trimmedQuestion);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text:
            result?.answer ||
            "I couldn't find an answer for that.",
        },
      ]);
    } catch (error) {
      console.error("Q&A request failed:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text:
            "I couldn't process that question right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[476px] min-h-[430px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="flex shrink-0 items-center justify-between">
        <h2 className="text-sm font-semibold">
          Ask Finwise
        </h2>

        <span className="text-xs text-muted-foreground">
          Natural language
        </span>
      </div>

      <div
        ref={chatContainerRef}
        className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1"
      >
        {!hasTransactions ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Lock className="h-5 w-5 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              Ask Finwise
            </p>

            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Upload a statement to start asking questions about
              your spending.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Sparkles className="h-5 w-5 text-primary" />

            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Ask me anything about your spending.
            </p>

            <p className="mt-2 max-w-xs text-xs text-muted-foreground">
              Try: "How much did I spend on Food this week?"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-secondary text-foreground"
                    }`}
                  >
                    {message.text}
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>

                <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex shrink-0 items-center gap-2">
        <input
          value={question}
          disabled={!hasTransactions || loading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askQuestion();
            }
          }}
          placeholder="Ask about a merchant, month or category..."
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-xs outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          disabled={
            !hasTransactions ||
            loading ||
            !question.trim()
          }
          onClick={askQuestion}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}