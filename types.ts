export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  text: string;
  timestamp: number;
}
