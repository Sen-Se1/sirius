import { z } from "zod";
import { parse } from "date-fns";

// Define EntityType Enum
const EntityTypeEnum = z.enum(["Workspace", "Board", "List", "Card"], {
  errorMap: () => ({
    message:
      "Invalid entity type, accepted values: Workspace, Board, List, Card.",
  }),
});

// Define ActionType Enum
const ActionTypeEnum = z.enum(["create", "view", "update", "delete"], {
  errorMap: () => ({
    message:
      "Invalid action type, accepted values: create, view, update, delete.",
  }),
});

// Define PriorityEnum Enum
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"], {
  errorMap: () => ({
    message: "Invalid priority, accepted values: LOW, MEDIUM, HIGH.",
  }),
});

// Define Payment Method Enum
const PaymentMethodEnum = z.enum(["Flouci", "Stripe"], {
  errorMap: () => ({
    message: "Invalid payment method, accepted values: Flouci, Stripe.",
  }),
});

// Register Schema
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The name must be at least 2 characters long" })
    .max(100, { message: "The name must be at most 100 characters long" }),
  email: z
    .string()
    .min(3, { message: "The email must be at least 3 characters long" })
    .max(200, { message: "The email must be at most 200 characters long" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "The password must be at least 6 characters long" }),
});

// Login Schema
export const LoginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "The email must be at least 3 characters long" })
    .max(200, { message: "The email must be at most 200 characters long" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "The password must be at least 6 characters long" }),
  twoFactorCode: z.string().optional(),
});

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(3, { message: "The email must be at least 3 characters long" })
    .max(200, { message: "The email must be at most 200 characters long" })
    .email({ message: "Invalid email format" }),
});

// Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "The password must be at least 6 characters long",
    }),
    passwordConfirm: z.string().min(6, {
      message:
        "The password confirmation must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "The passwords do not match",
    path: ["passwordConfirm"],
  });

// Password Update Schema
export const PasswordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "The current password is required"),
    newPassword: z
      .string()
      .min(6, "The new password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "The password confirmation must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

// Profile Schema
export const ProfileSchema = z.object({
  name: z.string().min(1, "The name is required"),
  bio: z.string().optional(),
});

// Update Profile Schema
export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "The name is required").optional(),
  bio: z.string().optional(),
  avatar: z
    .instanceof(File, { message: "The image must be a valid file" })
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // Optional: Max 5MB
      { message: "The image must not exceed 5 MB" }
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type), // Optional: Allowed types
      { message: "The image must be in JPEG, PNG, or GIF format" }
    ),
});

// Contact Us Schema
export const ContactUsSchema = z.object({
  name: z.string().min(2, {
    message: "The name must be at least 2 characters long",
  }),
  email: z
    .string()
    .min(3, { message: "The email must be at least 3 characters long" })
    .max(200, { message: "The email must be at most 200 characters long" })
    .email({ message: "Invalid email format" }),
  message: z.string().min(10, {
    message: "The message must be at least 10 characters long",
  }),
});

// Role Schema
export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The role name must be at least 2 characters long" })
    .max(50, { message: "The role name must be at most 50 characters long" }),
  description: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val.trim()))
    .refine((val) => val === undefined || val.length >= 10, {
      message: "The description must be at least 10 characters long",
    })
    .refine((val) => val === undefined || val.length <= 200, {
      message: "The description must be at most 200 characters long",
    })
    .optional(),
});

// Update Role Schema
export const UpdateRoleSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The role name must be at least 2 characters long" })
    .max(50, { message: "The role name must be at most 50 characters long" })
    .optional(),
  description: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val.trim()))
    .refine((val) => val === undefined || val.length >= 10, {
      message: "The description must be at least 10 characters long",
    })
    .refine((val) => val === undefined || val.length <= 200, {
      message: "The description must be at most 200 characters long",
    })
    .optional(),
});

// Permission Schema
export const CreatePermissionSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "The permission name must be at least 2 characters long",
    })
    .max(50, {
      message: "The permission name must be at most 50 characters long",
    }),
});

// Update Permission Schema
export const UpdatePermissionSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "The permission name must be at least 2 characters long",
    })
    .max(50, {
      message: "The permission name must be at most 50 characters long",
    })
    .optional(),
});

// Assign Permission Schema
export const AssignPermissionSchema = z.object({
  roleId: z
    .number({ message: "The role ID must be an integer" })
    .int(),
  permissionId: z
    .number({ message: "The permission ID must be an integer" })
    .int(),
});

// Update Assign Permission Schema
export const UpdateAssignPermissionSchema = z.object({
  roleId: z
    .number({ message: "The role ID must be an integer" })
    .int()
    .optional(),
  permissionId: z
    .number({ message: "The permission ID must be an integer" })
    .int()
    .optional(),
});

// Assign Role Schema
export const AssignRoleSchema = z.object({
  userId: z
    .number({ message: "The user ID must be an integer" })
    .int(),
  roleId: z
    .number({ message: "The role ID must be an integer" })
    .int(),
  entityType: EntityTypeEnum,
  entityId: z
    .number({ message: "The entity ID must be an integer" })
    .int(),
});

// Update Assign Role Schema
export const UpdateAssignRoleSchema = z.object({
  userId: z
    .number({ message: "The user ID must be an integer" })
    .int()
    .optional(),
  roleId: z
    .number({ message: "The role ID must be an integer" })
    .int()
    .optional(),
  entityType: EntityTypeEnum.optional(),
  entityId: z
    .number({ message: "The entity ID must be an integer" })
    .int()
    .optional(),
});

// Workspace Schema
export const CreateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The workspace name must be at least 2 characters long" })
    .max(100, { message: "The workspace name must be at most 100 characters long" }),
});

// Update Workspace Schema
export const UpdateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The workspace name must be at least 2 characters long" })
    .max(100, { message: "The workspace name must be at most 100 characters long" })
    .optional(),
  image: z
    .instanceof(File, { message: "The image must be a valid file" })
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // Optional: Max 5MB
      { message: "The image must not exceed 5 MB" }
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type), // Optional: Allowed types
      { message: "The image must be in JPEG, PNG, or GIF format" }
    ),
});

// Board Schema
export const CreateBoardSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The board name must be at least 2 characters long" })
    .max(100, { message: "The board name must be at most 100 characters long" }),
  workspaceId: z
    .number({ message: "The workspace ID must be an integer" })
    .int(),
  image: z.string({
    required_error: "The image is required",
    invalid_type_error: "The image must be a string",
  }),
});

// Update Board Schema
export const UpdateBoardSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The board name must be at least 2 characters long" })
    .max(100, { message: "The board name must be at most 100 characters long" })
    .optional(),
  workspaceId: z
    .number({ message: "The workspace ID must be an integer" })
    .int()
    .optional(),
  image: z
    .string({
      required_error: "The image is required",
      invalid_type_error: "The image must be a string",
    })
    .optional(),
});

// List Schema
export const CreateListSchema = z.object({
  title: z
    .string()
    .min(2, { message: "The list title must be at least 2 characters long" })
    .max(100, { message: "The list title must be at most 100 characters long" }),
  boardId: z
    .number({ message: "The board ID must be an integer" })
    .int(),
  color: z
    .string()
    .min(6, { message: "The color must be in #RRGGBB format" }),
  position: z.number().min(1, {
    message: "The order must be an integer greater than or equal to 1",
  }),
});

// Update List Schema
export const UpdateListSchema = z.object({
  title: z
    .string()
    .min(2, { message: "The list title must be at least 2 characters long" })
    .max(100, { message: "The list title must be at most 100 characters long" })
    .optional(),
  boardId: z
    .number({ message: "The board ID must be an integer" })
    .int()
    .optional(),
  position: z
    .number()
    .min(1, { message: "The order must be an integer greater than or equal to 1" })
    .optional(),
});

// Create Card Schema
export const CreateCardSchema = z.object({
  title: z
    .string()
    .min(2, { message: "The card title must be at least 2 characters long" })
    .max(100, { message: "The card title must be at most 100 characters long" }),
  description: z
    .string()
    .min(5, { message: "The description must be at least 5 characters long" })
    .max(500, { message: "The description must be at most 500 characters long" }),
  dueDate: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return parse(val, "dd-MM-yyyy", new Date());
      } catch {
        return undefined;
      }
    }
    return val;
  }, z.date({ message: "The due date must be a valid date (DD-MM-YYYY)" })),
  listId: z
    .string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error("The list ID must be an integer");
      }
      return parsed;
    }) // Transform the string to a number
    .refine((val) => Number.isInteger(val), {
      message: "The list ID must be an integer",
    }),
  priority: PriorityEnum,
});

// Update Card Schema
export const UpdateCardSchema = z.object({
  title: z
    .string()
    .min(2, { message: "The card title must be at least 2 characters long" })
    .max(100, { message: "The card title must be at most 100 characters long" })
    .optional(),
  description: z
    .string()
    .min(5, { message: "The description must be at least 5 characters long" })
    .max(500, { message: "The description must be at most 500 characters long" })
    .optional(),
  responsible: z
    .string()
    .min(2, { message: "The responsible person is required" })
    .optional(),
  dueDate: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return parse(val, "dd-MM-yyyy", new Date());
      } catch {
        return undefined;
      }
    }
    return val;
  }, z.date({ message: "The due date must be a valid date (DD-MM-YYYY)" }).optional()),
  listId: z
    .number()
    .int({ message: "The list ID must be an integer" })
    .optional(),
  priority: PriorityEnum.optional(),
});

// Define the schema for requestBody
const RequestBodySchema = z.object({
  workspaceId: z
    .number({ message: "The workspace ID must be an integer" })
    .int()
    .optional(),
});

// Has Permission View Schema
export const HasPermissionViewSchema = z.object({
  userId: z
    .number({ message: "The user ID must be an integer" })
    .int(),
  entityType: EntityTypeEnum,
});

// Has Permission Schema
export const HasPermissionSchema = z.object({
  userId: z
    .number({ message: "The user ID must be an integer" })
    .int(),
  action: ActionTypeEnum,
  entityType: EntityTypeEnum,
  entityId: z
    .number({ message: "The entity ID must be an integer" })
    .int()
    .nullable()
    .optional(),
  requestBody: RequestBodySchema.optional(),
});

// Payment Schema
export const PaymentSchema = z.object({
  amount: z.number().min(0, { message: "The amount must be positive" }),
  method: PaymentMethodEnum,
});

// Verify Payment Schema
export const VerifyPaymentSchema = z.object({
  payment_id: z
    .string()
    .min(1, { message: "The payment ID is required" }),
});

// Form Contact Schema
export const formContactSchema = z.object({
  name: z.string().min(2, {
    message: "The name must be at least 2 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "The message must be at least 10 characters long.",
  }),
});

// Create Favorite Schema
export const CreateFavoriteSchema = z.object({
  entityType: EntityTypeEnum,
  entityId: z
    .number({ message: "The entity ID must be an integer" })
    .int(),
});

// Update Settings Schema
export const CreateSettingsSchema = z.object({
  emailNotifications: z.boolean().optional().default(false),
  pushNotifications: z.boolean().optional().default(false),
  language: z.string().optional().default("en"),
  timeZone: z.string().optional().default("UTC-5"),
});

// Update Company Schema
export const UpdateCompanySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
});

// Delete User Schema
export const DeleteUserSchema = z.object({
  userId: z
    .number({ message: "The user ID must be an integer" })
    .int(),
});

// Update Profile By Owner Schema
export const UpdateProfileByOwnerSchema = z.object({
  userId: z
    .number({ message: "The user ID must be an integer" })
    .int(),
  name: z.string().min(1, "The name is required").optional(),
  bio: z.string().optional(),
  avatar: z
    .instanceof(File, { message: "The image must be a valid file" })
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      { message: "The image must not exceed 5 MB" }
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "The image must be in JPEG, PNG, or GIF format" }
    ),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => !data.newPassword || data.newPassword === data.confirmPassword,
  { message: "The passwords do not match", path: ["confirmPassword"] }
).refine(
  (data) => !data.newPassword || data.newPassword.length >= 6,
  { message: "The password must be at least 6 characters long", path: ["newPassword"] }
);