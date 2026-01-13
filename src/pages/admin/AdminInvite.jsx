import React, { useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";

const AdminInvite = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const invitePromise = api.post("/admin/invite", { email });
      await toast.promise(invitePromise, {
        loading: "Sending Email. Please wait...",
        success: "If the email exists, an invite link has been sent",
        error: (err) => err?.response?.data?.message || "Something went wrong",
      });

      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-6"
      >
        <label htmlFor="email" className="text-2xl font-bold">
          Enter the email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3"
        />
        <button
          type="submit"
          disabled={loading}
          className=" p-3 rounded-md bg-purple-500"
        >
          {loading ? "Inviting..." : "Invite"}
        </button>
      </form>
    </div>
  );
};

export default AdminInvite;
