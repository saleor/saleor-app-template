export type ValidationError = {
  status: number;
  message: string;
};

export type ValidationResult = Promise<ValidationError | null>;
