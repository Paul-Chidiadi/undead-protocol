export interface ICounter {
  _id: string;
  seq: number;
}

export interface IQuestion {
  question_id: number;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface ILearningContent {
  summary: string;
  big_note: string[];
  battle_relevance: string;
}

export interface ITopic {
  topic_id: number;
  title: string;
  learning_content: ILearningContent;
  questions: IQuestion[];
}

export interface IConcept {
  concept_id: number;
  title: string;
  description: string;
  topics: ITopic[];
}
