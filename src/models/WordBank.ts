import { Timestamp } from "firebase/firestore";

export interface WordBank {
  id?: string;
  word: string;
  phoneticTranscription: string;
  meaning: string;
  exampleSentence?: string;
  createdAt: Timestamp;
}
