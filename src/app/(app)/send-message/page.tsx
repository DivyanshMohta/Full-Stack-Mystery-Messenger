"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SendMessage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const findUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSearching(true);
    try {
      const response = await axios.get(
        `/api/find-user?username=${encodeURIComponent(username.trim())}`,
      );

      router.push(`/u/${encodeURIComponent(response.data.username)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      setErrorMessage(
        axiosError.response?.data.message ?? "Unable to find username",
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={findUser}>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter username"
      />

      <button type="submit" disabled={isSearching || !username.trim()}>
        {isSearching ? "Searching..." : "Continue"}
      </button>

      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
};

export default SendMessage;
