import { FormEvent, useState } from "react";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "success" | "error" | "loading" | "idle"
  >("idle");
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number>();

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await axios.post("/api/subscribe", { email });

      setStatus("success");
      setStatusCode(response.status);
      setEmail("");
      setResponseMsg(response.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatus("error");
        setStatusCode(err.response?.status);
        setResponseMsg(err.response?.data.error);
      }
    }

    setTimeout(() => {
      setEmail("");
      setStatus("idle");
      setStatusCode(0);
    }, 10000);
  }

  return (
    <>
      <form
        className="rounded px-8 pt-6 pb-8 mb-4 max-w-md"
        onSubmit={handleSubscribe}
      >
        <div className="flex">
          <input
            className={`grow mr-1 transition ease-out delay-75 focus-within:border-2 focus-within:border-purple-600 items-center h-14 pr-0.5 rounded caret-purple-700 outline-none px-4 disabled:border-slate-400 border ${statusCode == 400 ? "border-orange-500" : "border-purple-600"} `}
            type="email"
            placeholder="What is your email address?"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status == "loading"}
          />
          <button
            className="bg-violet-700 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-400"
            type="submit"
            disabled={status == "loading"}
          >
            Subscribe
          </button>
        </div>
        <div className="server-message pt-4 text-green-600">
          {status === "success" ? (
            <p className="text-green-600">{responseMsg}</p>
          ) : null}
          {status === "error" ? (
            <p className="text-orange-600">{responseMsg}</p>
          ) : null}
        </div>
      </form>
    </>
  );
};

export default Newsletter;
