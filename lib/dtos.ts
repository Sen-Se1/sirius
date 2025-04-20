import { EntityType } from "@prisma/client";
import { ActionType } from "./types";

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
  ipAddress: string;
  userAgent: string;
  geoData: {
    country: string;
    region: string;
    city: string;
  };
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  password: string;
  passwordConfirm: string;
}

export interface PasswordUpdateDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ContactUsDto {
  name: string;
  email: string;
  message: string;
}

export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  avatar?: File
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface CreatePermissionDto {
  name: string;
}

export interface UpdatePermissionDto {
  name?: string;
}

export interface CreateAssignPermissionDto {
  roleId: number;
  permissionId: number;
}

export interface UpdateAssignPermissionDto {
  roleId?: number;
  permissionId?: number;
}

export interface CreateAssignRoleDto {
  userId: number;
  roleId: number;
  entityType: "Workspace" | "Board" | "List" | "Card";
  entityId: number;
}

export interface UpdateAssignRoleDto {
  userId?: number;
  roleId?: number;
  entityType?: "Workspace" | "Board" | "List" | "Card";
  entityId?: number;
}

export interface CreateWorkspaceDto {
  name: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  image?: File
}

export interface CreateBoardDto {
  name: string;
  workspaceId: number;
  image: string;
}

export interface UpdateBoardDto {
  name?: string;
  workspaceId?: number;
  image?: string;
}

export interface CreateListDto {
  title: string;
  boardId: number;
  position: number;
  color: string;
}

export interface UpdateListDto {
  title?: string;
  boardId?: number;
  position?: number;
}

export interface CreateCardDto {
  title: string;
  description: string;
  responsible: string;
  dueDate: string;
  listId: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  responsible?: string;
  dueDate?: Date;
  listId?: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RequestBody {
  workspaceId?: number;
}

export interface HasPermissionViewDto {
  userId: number;
  entityType: EntityType;
}

export interface HasPermissionDto {
  userId: number;
  action: ActionType;
  entityType: EntityType;
  entityId?: number;
  requestBody: RequestBody;
}

export interface PaymentDto{
  amount: number;
  method: string;
}

export interface VerifyPaymentDto{
  payment_id: string;
}

export interface CreateFavoriteDto {
  entityType: "Workspace" | "Board" | "List" | "Card",
  entityId: number,
};

export interface CreateSettingsDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
  timeZone?: string;
}

export interface UpdateCompanysDto {
  name?: string;
  address?: string;
  telephone?: string;
  email?: string;
}

export interface DeleteUserDto {
  userId: number;
}

export interface UpdateProfileByOwnerDto {
  userId: number;
  name?: string;
  bio?: string;
  avatar?: File
  newPassword?: string;
  confirmPassword?: string;
}