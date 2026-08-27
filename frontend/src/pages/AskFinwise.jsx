import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Send,
  User,
  Lock,
  Trash2,
  Lightbulb,
} from "lucide-react";

import { qnaAPI } from "../api/qna.api";
import { transactionAPI } from "../api/transaction.api";
import PageHeader from "../components/dashboard/PageHeader";

const suggestedQuestions = [
  "How much did I spend this month?",
  "How much did I spend on Food?",
  "What are my top spending categories?",
  "How much did I spend on Shopping?",
  "How much did I spend in the last 7 days?",
  "Which merchant did I spend the most on?",
];

export default function AskFinwise() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  const [hasTransactions, setHasTransactions] = useState(false);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  /*
   * Check whether the user has transactions.
   */
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);

        const data = await transactionAPI.list(1);

        setHasTransactions(
          (data?.transactions || []).length > 0
        );
      } catch (error) {
        console.error(
          "Failed to check transactions:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  /*
   * Keep the chat scrolled to the latest message.
   */
  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, asking]);

  /*
   * Ask Finwise.
   */
  const askQuestion = async (questionText = question) => {
    const trimmedQuestion = questionText.trim();

    if (
      !trimmedQuestion ||
      !hasTransactions ||
      asking
    ) {
      return;
    }

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
      setAsking(true);

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
      setAsking(false);
    }
  };

  /*
   * Clear conversation.
   */
  const clearChat = () => {
    if (asking) return;

    setMessages([]);
    setQuestion("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <PageHeader
          title="Ask Finwise"
          subtitle="Ask questions about your spending in natural language"
        />

        <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
          Loading your financial data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* HEADER */}
      <PageHeader
        title="Ask Finwise"
        subtitle="Ask questions about your spending in natural language"
        actions={
          messages.length > 0 ? (
            <button
              type="button"
              onClick={clearChat}
              disabled={asking}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                Clear chat
              </span>
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ================================
            CHAT
        ================================= */}

        <div
  className="
    flex h-[600px] max-h-[calc(100vh-180px)]
    min-h-[500px]
    flex-col overflow-hidden rounded-2xl
    border border-border bg-card
    lg:col-span-2 lg:self-start
  "
>
          {/* CHAT HEADER */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Ask Finwise
                </h2>

                <p className="text-xs text-muted-foreground">
                  Your personal spending assistant
                </p>
              </div>
            </div>

            <span className="hidden text-xs text-muted-foreground sm:block">
              Natural language
            </span>
          </div>

          {/* CHAT AREA */}
          <div
            ref={chatContainerRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
          >
            {!hasTransactions ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  Upload a statement first
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Ask Finwise uses your transaction history
                  to answer questions about your spending.
                  Upload a bank statement to get started.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-5 text-base font-semibold">
                  What would you like to know?
                </h3>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Ask questions about your spending,
                  categories, merchants, or recent activity.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {suggestedQuestions
                    .slice(0, 4)
                    .map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => askQuestion(item)}
                        disabled={asking}
                        className="rounded-full border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {item}
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => {
                  const isUser =
                    message.role === "user";

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
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                          isUser
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md bg-secondary text-foreground"
                        }`}
                      >
                        {message.text}
                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* THINKING */}
                {asking && (
                  <div className="flex items-end gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>

                    <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
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

          {/* INPUT */}
          <div className="shrink-0 border-t border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1.5 focus-within:border-primary">
              <input
                ref={inputRef}
                value={question}
                disabled={!hasTransactions || asking}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    askQuestion();
                  }
                }}
                placeholder="Ask about your spending..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                disabled={
                  !hasTransactions ||
                  asking ||
                  !question.trim()
                }
                onClick={() => askQuestion()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Ask Finwise answers using your uploaded
              transaction data.
            </p>
          </div>
        </div>

        {/* ================================
            SUGGESTIONS
        ================================= */}

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Try asking
                </h2>

                <p className="text-xs text-muted-foreground">
                  Examples of questions you can ask
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {suggestedQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={!hasTransactions || asking}
                  onClick={() => askQuestion(item)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-left text-xs leading-relaxed text-muted-foreground transition hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">
              How Ask Finwise works
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                  1
                </div>

                <div>
                  <p className="text-xs font-medium">
                    Ask a question
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Ask naturally, just like you would
                    ask a person.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                  2
                </div>

                <div>
                  <p className="text-xs font-medium">
                    Finwise checks your data
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Your transaction history is searched
                    for the information needed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                  3
                </div>

                <div>
                  <p className="text-xs font-medium">
                    Get a simple answer
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    The result is explained in natural
                    language using Indian Rupees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}