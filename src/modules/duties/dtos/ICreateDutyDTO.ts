interface ICreateDutyDTO {
  description: string;
  date: Date;
  duration: number;
  group_id: string;
  users_id: string[];
}