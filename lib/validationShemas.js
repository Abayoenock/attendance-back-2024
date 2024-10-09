const { z } = require("zod")
const currentYear = new Date().getFullYear()
const nidSchema = z
  .string()
  .length(16, { message: "Must be exactly 16 characters long" })
  .regex(/^[123]/, {
    message:
      "First digit must be 1 (Rwandan citizen), 2 (refugee), or 3 (foreigner)",
  })
  .regex(/^[123]\d{4}[78]/, {
    message: "Gender identifier must be 8 (male) or 7 (female)",
  })
  .refine(
    (value) => {
      const birthYear = parseInt(value.slice(1, 5), 10)
      return birthYear <= currentYear
    },
    { message: "Birth year must not be greater than the current year" }
  )
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const passwordSchema = z
  .string()
  .regex(
    passwordRegex,
    "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
// schema for validating email address
const emailSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
})

const loginSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  password: z.string({}).min(1, { message: "Password is required " }),
})
const createAccountSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  NID: nidSchema,
  firstname: z
    .string({
      message: "firstname must be a string ",
    })
    .min(2, { message: "First name must be atleast two characters long " }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(2, { message: "Lastname must be atleast two characters long " }),

  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
  role: z.number({ message: "Invalid role type" }).optional(),
})
const updateAccountSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),

  firstname: z
    .string({
      message: "firstname must be a string ",
    })
    .min(2, { message: "First name must be atleast two characters long " }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(2, { message: "Lastname must be atleast two characters long " }),

  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
  role: z.number({ message: "Invalid role type" }).optional(),
})
const passwordResetSchema = z
  .object({
    currentPassword: z.string({
      message: "current Password is required and must be a string",
    }),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })

const forgotPasswordResetSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })

const guardianSchema = z.object({
  motherNames: z
    .string({
      message: "mother's must be a string",
    })
    .min(2, { message: "mother's name is required" }),
  fatherNames: z
    .string({
      message: "father's must be a string",
    })
    .min(2, { message: "father's name is required" }),
  fathersNID: nidSchema,
  mothersNID: nidSchema,
  guardiansNID: nidSchema,
  guardianNames: z.string(),
  guardianPhone: z.string(),
  isActive: z.boolean().default(true),
  province: z.string().min(2, { message: "Province is required" }),
  district: z.string().min(2, { message: "District is required" }),
  sector: z.string().min(2, { message: "Sector is required" }),
  cell: z.string().min(2, { message: "Cell is required" }),
  village: z.string().min(2, { message: "Village is required" }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
})
const DOBSchame = z.string().refine(
  (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return false
    }

    // Check if the date is not in the future
    if (date > now) {
      return false
    }

    // Check if the date is at least 3 years in the past
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(now.getFullYear() - 3)
    if (date > threeYearsAgo) {
      return false
    }

    return true
  },
  {
    message:
      "Date must be valid, not in the future, and at least 3 years in the past.",
  }
)
const studentsSchema = z.object({
  studentReg: z
    .string()
    .min(1, { message: "Student registration number is required" }),
  firstname: z.string().min(1, { message: "Firstname must be a string" }),
  lastname: z.string().min(1, { message: "Lastname must be a string" }),
  fingerPrint: z.string().transform((val) => parseInt(val, 10)),
  gender: z.enum(["Female", "Male"]),
  DOB: DOBSchame,
  department: z.string().min(1, { message: "Guardian must be selected" }),
  cardID: z.string().min(1, { message: "card is required" }).optional(),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
})
const EditstudentsSchema = z.object({
  studentReg: z
    .string()
    .min(1, { message: "Student registration number is required" }),
  firstname: z.string().min(1, { message: "Firstname must be a string" }),
  lastname: z.string().min(1, { message: "Lastname must be a string" }),
  deviceSN: z.string().optional(),
  gender: z.enum(["Female", "Male"]),
  DOB: DOBSchame,

  cardID: z.string({ message: "place RFID Card " }).optional(),
  department: z.string().min(1, { message: "Please select departement " }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
})

const teachersSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname must be a string" }),
  lastname: z.string().min(1, { message: "Lastname must be a string" }),
  NID: nidSchema,
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
})

const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90), // Latitude should be between -90 and 90
  lng: z.number().min(-180).max(180), // Longitude should be between -180 and 180
})
const geoFanceSchema = z.object({
  name: z.string().min(1, { message: "Geo fance name is required " }),
  coordinates: z.array(coordinateSchema),
})
const busesSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  seats: z
    .number()
    .int()
    .positive("Number of seats must be a positive integer"),
  deviceSN: z.string().optional(),
})

const careTakersSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname must be a string" }),
  lastname: z.string().min(1, { message: "Lastname must be a string" }),
})
const EditcareTakersSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname must be a string" }),
  lastname: z.string().min(1, { message: "Lastname must be a string" }),
})

const addTrip = z.object({
  bus: z
    .string({ message: "Please select a bus" })
    .min(1, { message: "Please select a bus" }),
  direction: z
    .string({ message: "please select the commute direction" })
    .min(1, { message: "please select the commute direction" }),
})
const DepartmentSchema = z.object({
  departmentCode: z
    .string()
    .min(1, { message: "Department Code is required " }),
  departmentName: z
    .string()
    .min(1, { message: "Department name is required " }),
})
const classesSchema = z.object({
  className: z.string().min(1, { message: "Department Code is required " }),
})
const modulesSchema = z.object({
  moduleCode: z.string().min(1, { message: "module  Code is required " }),
  moduleTitle: z.string().min(1, { message: "Module title Code is required " }),
})
module.exports = {
  loginSchema,
  createAccountSchema,
  passwordResetSchema,
  emailSchema,
  forgotPasswordResetSchema,
  updateAccountSchema,
  guardianSchema,
  geoFanceSchema,
  studentsSchema,
  busesSchema,
  EditstudentsSchema,
  careTakersSchema,
  EditcareTakersSchema,
  addTrip,
  DepartmentSchema,
  teachersSchema,
  classesSchema,
  modulesSchema,
}
