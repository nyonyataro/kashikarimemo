export interface Memo {
  id: string;
  lentByName: string;
  borrowedByName: string;
  amountOrItem: string;
  loanDate: string;
  dueDate?: string;
  memo?: string;
  status: 'active' | 'returned';
  createdAt: string;
  updatedAt: string;
  histories: MemoHistory[];
}

export interface MemoHistory {
  id: string;
  editorName: string;
  action: 'created' | 'edited' | 'returned';
  changes?: Record<string, { from: unknown; to: unknown }>;
  createdAt: string;
}

export interface CreateMemoRequest {
  lentByName: string;
  borrowedByName: string;
  amountOrItem: string;
  loanDate: string;
  dueDate?: string;
  memo?: string;
}

export interface UpdateMemoRequest {
  lentByName?: string;
  borrowedByName?: string;
  amountOrItem?: string;
  loanDate?: string;
  dueDate?: string;
  memo?: string;
  editorName: string;
}