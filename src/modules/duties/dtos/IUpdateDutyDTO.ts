interface IUpdateDutyDTO {
  description: string;
  date: Date;
  duration: number;
  users: { id: string; role?: string }[];
}