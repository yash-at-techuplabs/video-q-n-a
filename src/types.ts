// Type definitions for Video Q&A App

export interface UserInfo {
  name: string;
  email: string;
}

export interface RecordingData {
  blob: Blob;
  videoUrl: string;
  questionIndex: number;
}

export interface AppState {
  currentQuestionIndex: number;
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  userInfo: UserInfo | null;
  videoStream: MediaStream | null;
  isRecording: boolean;
  facingMode: 'user' | 'environment';
  currentRecording: RecordingData | null;
}

export interface Question {
  id: number;
  text: string;
  isThankYou?: boolean;
}

export const questions: Question[] = [
  { id: 1, text: "Tell us about yourself and your background." },
  { id: 2, text: "What interests you most about this opportunity?" },
  { id: 3, text: "Describe a challenge you faced and how you overcame it." },
  { id: 4, text: "Thank you for your participation!", isThankYou: true }
];