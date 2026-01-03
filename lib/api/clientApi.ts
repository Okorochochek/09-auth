import type { Note } from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}
export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: Note["tag"];
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type CheckSessionRequest = {
  success: boolean;
};
export interface UpdateMeRequest {
  username: string;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search, tag },
  });

  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await nextServer.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
}

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export async function getMe(): Promise<User> {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
}
export async function updateMe(newData: UpdateMeRequest): Promise<User> {
  const { data } = await nextServer.patch<User>("/users/me", newData);
  return data;
}
