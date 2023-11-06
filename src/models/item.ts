export interface Item {
  id: string;
  name: string;
  added: boolean;
  completed: boolean;
  notes: string | undefined;
  category: string;
}
