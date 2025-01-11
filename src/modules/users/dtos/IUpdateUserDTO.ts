interface IUpdateUserDTO {
  name: string;
  nickname: string;
  email: string;
  profession: string;
  specialization: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  image?: string | null;
}

export default IUpdateUserDTO;
