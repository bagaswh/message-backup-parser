export interface Message {
  dateSent: string;
  sender?: string;
  messageContent: string;
  messageType?: string;
  additionalInfo?: { [key: string]: string };
}

export interface MessageGroup {
  dateBegin: string;
  messages: Message[];
}

export interface ParsedMessage {
  chatName: string;
  chatParticipants: string[];
  dateSaved?: string;
  groups: MessageGroup[];
  totalMessages: number;
}
