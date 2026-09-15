import { Ability, AbilityBuilder } from '@casl/ability';
import type { AbilityClass, InferSubjects } from '@casl/ability';
import type { User } from '~/store/user';

// Định nghĩa các actions có thể thực hiện
export type Actions = 'manage' | 'read' | 'create' | 'update' | 'delete';

// Định nghĩa các subjects (đối tượng) trong hệ thống
export type Subjects = 'Document' | 'Profile' | 'User' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

// Hàm tạo ability rules dựa trên user
export function defineAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

  if (user.PER_CODE === 'ADMIN') {
    can('manage', 'all'); // Admin có toàn quyền
  } else {
    // Phân quyền cho các chức vụ khác
    cannot('manage', 'Admin');
    cannot('manage', 'Dataspy');
  }

  return build();
} 