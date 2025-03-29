import { Role } from '@application/common/roles/constants/roles.constant';

export interface AuthenticatedUser {
  id: string;
  username: string;
  roles: Role[];
}
