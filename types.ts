export interface ChangeItem {
  original: string;
  corrected: string;
  type: 'spelling' | 'grammar' | 'spacing' | 'other';
  explanation: string;
}

export interface ProofreadResult {
  original_text: string;
  corrected_text: string;
  changes: ChangeItem[];
  overall_comment: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}