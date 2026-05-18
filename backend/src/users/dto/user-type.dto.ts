export enum UserType {
  B2C = 'B2C',
  B2B = 'B2B',
}

export interface UserTypeMetadata {
  type: UserType;
  organizationId?: string; // For B2B users
  organizationName?: string; // For B2B users
}

