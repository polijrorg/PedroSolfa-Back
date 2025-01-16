export default interface ICreateDutyDTO {
  description: string;
  date: Date;
  duration: number;
  group_id: string;
  users: { id: string; role?: string }[];
}