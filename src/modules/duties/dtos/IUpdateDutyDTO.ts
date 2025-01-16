export default interface IUpdateDutyDTO {
  description: string | null;
  date: Date;
  duration: number;
  users: { id: string; role?: string }[];
}