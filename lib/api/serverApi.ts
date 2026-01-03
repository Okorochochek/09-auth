import { nextServer } from "./api";
import type { Note } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotesServer(
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesResponse> {
  const cookie = await cookies();
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { page, perPage: 12, search, tag },
    headers: { cookie: cookie.toString() },
  });

  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookie = await cookies();
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookie.toString() },
  });
  return data;
}

export async function checkServerSession() {
  const cookie = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: { Cookie: cookie.toString() },
  });
  return res;
}

export async function getMeServer() {
  const cookie = await cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookie.toString() },
  });
  return data;
}
