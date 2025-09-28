import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chit Fund Backend API",
      version: "1.0.0",
      description: "Backend API for chit fund application management",
      contact: {
        name: "API Support",
        email: "support@chitfund.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? `${process.env.URL}`
            : `http://localhost:${process.env.PORT || 3001}`,
        description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
            },
            data: {
              type: "object",
              description: "Response data (present on success)",
            },
            error: {
              type: "string",
              description: "Error type (present on failure)",
            },
            message: {
              type: "string",
              description: "Human-readable message",
            },
          },
          required: ["success", "message"],
        },
        DeactivateChitRequest: {
          type: "object",
          properties: {
            chit_id: {
              type: "string",
              format: "uuid",
              description: "Unique chit identifier to deactivate",
              example: "987fcdeb-51a2-43d1-9f12-345678901234",
            },
            reason: {
              type: "string",
              description: "Optional reason for deactivation",
              example: "Force closure requested by admin",
            },
          },
          required: ["chit_id"],
        },
        DeactivateChitResponse: {
          type: "object",
          properties: {
            chit_id: {
              type: "string",
              format: "uuid",
              description: "Deactivated chit identifier",
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "Associated user identifier",
            },
            is_active: {
              type: "boolean",
              description: "Active status (should be false after deactivation)",
              example: false,
            },
            deactivated_at: {
              type: "string",
              format: "date-time",
              description: "Deactivation timestamp in IST",
            },
            reason: {
              type: "string",
              description: "Reason for deactivation",
              example: "Force closure requested by admin",
            },
          },
          required: ["chit_id", "user_id", "is_active", "deactivated_at"],
        },
        DeactivateLoanRequest: {
          type: "object",
          properties: {
            loan_id: {
              type: "string",
              format: "uuid",
              description: "Unique loan identifier to deactivate",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            reason: {
              type: "string",
              description: "Optional reason for deactivation",
              example: "Force closure requested by admin",
            },
          },
          required: ["loan_id"],
        },
        DeactivateLoanResponse: {
          type: "object",
          properties: {
            loan_id: {
              type: "string",
              format: "uuid",
              description: "Deactivated loan identifier",
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "Associated user identifier",
            },
            is_active: {
              type: "boolean",
              description: "Active status (should be false after deactivation)",
              example: false,
            },
            deactivated_at: {
              type: "string",
              format: "date-time",
              description: "Deactivation timestamp in IST",
            },
            reason: {
              type: "string",
              description: "Reason for deactivation",
              example: "Force closure requested by admin",
            },
          },
          required: ["loan_id", "user_id", "is_active", "deactivated_at"],
        },
        AnalyticsResponse: {
          type: "object",
          properties: {
            total_persons_applied_for_chits: {
              type: "integer",
              description: "Total number of unique persons who applied for chits",
              example: 25,
            },
            total_persons_applied_for_loans: {
              type: "integer",
              description: "Total number of unique persons who applied for loans",
              example: 15,
            },
            total_number_of_active_chits: {
              type: "integer",
              description: "Total number of active chits in the system",
              example: 50,
            },
            total_pending_loans: {
              type: "integer",
              description: "Total number of active/pending loans",
              example: 8,
            },
            total_pending_chits: {
              type: "integer",
              description: "Total number of unpaid chit payments",
              example: 12,
            },
            amount_in_chits: {
              type: "integer",
              description: "Total amount paid in chits (sum of amount_paid from chit_payments)",
              example: 125000,
            },
            amount_pending_to_be_paid_chits: {
              type: "integer",
              description: "Total amount pending to be paid for chits (sum of balance from chit_payments)",
              example: 75000,
            },
            amount_provided_for_loans: {
              type: "integer",
              description: "Total amount provided as loans (sum of borrowed_amount from loans)",
              example: 500000,
            },
            amount_paid_for_loans: {
              type: "integer",
              description: "Total amount paid towards loans (sum of amount_paid from loans)",
              example: 150000,
            },
            count_of_unpaid_chits: {
              type: "integer",
              description: "Count of unpaid chit payments",
              example: 12,
            },
            count_of_unpaid_loans: {
              type: "integer",
              description: "Count of unpaid loans",
              example: 8,
            },
          },
          required: [
            "total_persons_applied_for_chits",
            "total_persons_applied_for_loans",
            "total_number_of_active_chits",
            "total_pending_loans",
            "total_pending_chits",
            "amount_in_chits",
            "amount_pending_to_be_paid_chits",
            "amount_provided_for_loans",
            "amount_paid_for_loans",
            "count_of_unpaid_chits",
            "count_of_unpaid_loans",
          ],
        },
        User: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "Unique user identifier",
            },
            name: {
              type: "string",
              description: "Full name of the user",
            },
            total_chits: {
              type: "integer",
              minimum: 1,
              description: "Total number of chits for the user",
            },
            mobile: {
              type: "number",
              description: "Mobile number of the user",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
          },
          required: ["user_id", "name", "total_chits", "mobile", "created_at"],
        },
        UserDetailsResponse: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "Unique user identifier",
            },
            name: {
              type: "string",
              description: "Full name of the user",
            },
            mobile: {
              type: "number",
              description: "Mobile number of the user",
            },
            total_chits: {
              type: "integer",
              minimum: 1,
              description: "Total number of chits for the user",
            },
          },
          required: ["user_id", "name", "mobile", "total_chits"],
        },
        UserDetailedResponse: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "Unique user identifier",
            },
            name: {
              type: "string",
              description: "Full name of the user",
            },
            mobile: {
              type: "number",
              description: "Mobile number of the user",
            },
            total_chits: {
              type: "integer",
              minimum: 1,
              description: "Total number of chits for the user",
            },
            chit_payment_history: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ChitPayment",
              },
              description: "Complete chit payment history for the user",
            },
            loan_details: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Loan",
              },
              description: "All loan details associated with the user",
            },
          },
          required: ["user_id", "name", "mobile", "total_chits", "chit_payment_history", "loan_details"],
        },
        Chit: {
          type: "object",
          properties: {
            chit_id: {
              type: "string",
              format: "uuid",
              description: "Unique chit identifier",
            },
            total_chits: {
              type: "integer",
              minimum: 1,
              description: "Total number of chits",
            },
            is_active: {
              type: "boolean",
              description: "Whether the chit is active",
              default: true,
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "Associated user identifier",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Chit creation timestamp",
            },
          },
          required: ["chit_id", "total_chits", "is_active", "user_id", "created_at"],
        },
        ChitPayment: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Payment record ID",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Payment record creation timestamp",
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "User identifier",
            },
            chit_id: {
              type: "string",
              format: "uuid",
              description: "Chit identifier",
            },
            due_amount: {
              type: "integer",
              description: "Amount due for this installment",
              example: 100,
            },
            amount_paid: {
              type: "integer",
              description: "Amount paid by user",
              default: 0,
            },
            balance: {
              type: "integer",
              nullable: true,
              description: "Remaining balance",
            },
            weekly_installment: {
              type: "integer",
              description: "Week number of this installment",
            },
            payment_mode: {
              type: "string",
              nullable: true,
              description: "Mode of payment (cash, online, etc.)",
            },
            paid_on: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Payment completion timestamp",
            },
            is_paid: {
              type: "boolean",
              description: "Whether payment is completed",
              default: false,
            },
            transaction_history: {
              type: "array",
              nullable: true,
              items: {
                $ref: "#/components/schemas/TransactionHistoryEntry",
              },
              description: "History of all transactions for this payment",
            },
          },
          required: ["user_id", "chit_id", "due_amount", "amount_paid", "weekly_installment", "is_paid"],
        },
        Config: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Configuration record ID",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Configuration creation timestamp",
            },
            attribute: {
              type: "string",
              nullable: true,
              description: "Configuration attribute name",
              example: "chits_week",
            },
            value: {
              type: "string",
              nullable: true,
              description: "Configuration value",
              example: "1",
            },
          },
        },
        WeeklyChitsUpdateResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
              example: "Successfully created 5 payment records for week 1",
            },
            current_week: {
              type: "integer",
              description: "Current week number that was processed",
              example: 1,
            },
            payments_created: {
              type: "integer",
              description: "Number of payment records created",
              example: 5,
            },
            chits_processed: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ChitPayment",
              },
              description: "List of created payment records",
            },
          },
          required: ["message", "current_week", "payments_created", "chits_processed"],
        },
        ChitPaymentRequest: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "User identifier",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            chit_id: {
              type: "string",
              format: "uuid",
              description: "Chit identifier",
              example: "987fcdeb-51a2-43d1-9f12-345678901234",
            },
            amount: {
              type: "integer",
              minimum: 1,
              description: "Amount to be paid",
              example: 500,
            },
            payment_mode: {
              type: "string",
              description: "Mode of payment",
              example: "cash",
              enum: ["cash", "online", "bank_transfer", "upi"],
            },
          },
          required: ["user_id", "chit_id", "amount", "payment_mode"],
        },
        ChitPaymentResponse: {
          type: "object",
          properties: {
            payment_id: {
              type: "integer",
              description: "Payment record ID",
              example: 1,
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "User identifier",
            },
            chit_id: {
              type: "string",
              format: "uuid",
              description: "Chit identifier",
            },
            due_amount: {
              type: "integer",
              description: "Total amount due for this installment",
              example: 1000,
            },
            amount_paid: {
              type: "integer",
              description: "Total amount paid so far",
              example: 500,
            },
            balance: {
              type: "integer",
              description: "Remaining balance",
              example: 500,
            },
            is_paid: {
              type: "boolean",
              description: "Whether payment is completed",
              example: false,
            },
            paid_on: {
              type: "string",
              format: "date-time",
              description: "Payment completion timestamp",
            },
            payment_mode: {
              type: "string",
              description: "Mode of payment used",
              example: "cash",
            },
            weekly_installment: {
              type: "integer",
              description: "Week number of this installment",
              example: 1,
            },
            transaction_history: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TransactionHistoryEntry",
              },
              description: "Complete history of all transactions for this payment",
            },
          },
          required: [
            "payment_id",
            "user_id",
            "chit_id",
            "due_amount",
            "amount_paid",
            "balance",
            "is_paid",
            "paid_on",
            "payment_mode",
            "weekly_installment",
            "transaction_history",
          ],
        },
        CreateUserRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Full name of the user",
              example: "John Doe",
            },
            total_chits: {
              type: "integer",
              minimum: 1,
              description: "Total number of chits for the user",
              example: 10,
            },
            mobile: {
              type: "number",
              description: "Mobile number of the user",
              example: 9876543210,
            },
          },
          required: ["name", "total_chits", "mobile"],
        },
        CreateUserResponse: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "Unique user identifier",
            },
            name: {
              type: "string",
              description: "Full name of the user",
            },
            total_chits: {
              type: "integer",
              minimum: 1,
              description: "Total number of chits for the user",
            },
            mobile: {
              type: "number",
              description: "Mobile number of the user",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
            chit: {
              $ref: "#/components/schemas/Chit",
              description: "Associated chit information",
            },
          },
          required: ["user_id", "name", "total_chits", "mobile", "created_at", "chit"],
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["ok", "error"],
              description: "Health status of the service",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Current timestamp",
            },
            uptime: {
              type: "number",
              description: "Server uptime in seconds",
            },
            environment: {
              type: "string",
              description: "Current environment",
            },
            version: {
              type: "string",
              description: "API version",
            },
          },
          required: ["status", "timestamp", "uptime", "environment", "version"],
        },
        TransactionHistoryEntry: {
          type: "object",
          properties: {
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Transaction timestamp",
              example: "2023-12-01T10:30:00Z",
            },
            amount: {
              type: "integer",
              description: "Amount paid in this transaction",
              example: 500,
            },
            mode: {
              type: "string",
              description: "Payment mode used",
              example: "cash",
            },
          },
          required: ["timestamp", "amount", "mode"],
        },
        Loan: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Loan record ID",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Loan creation timestamp",
            },
            loan_id: {
              type: "string",
              format: "uuid",
              description: "Unique loan identifier",
            },
            is_active: {
              type: "boolean",
              description: "Whether the loan is active",
              default: true,
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "Associated user identifier",
            },
            interest_rate: {
              type: "string",
              description: "Interest rate for the loan",
              example: "12.5",
            },
            interest_type: {
              type: "string",
              description: "Type of interest calculation",
              example: "monthly",
            },
            borrowed_amount: {
              type: "integer",
              nullable: true,
              description: "Amount borrowed by the user",
              example: 50000,
            },
            balance: {
              type: "integer",
              description: "Current outstanding balance",
              default: 0,
              example: 0,
            },
            amount_paid: {
              type: "integer",
              description: "Total amount paid towards the loan",
              default: 0,
              example: 5000,
            },
            is_paid: {
              type: "boolean",
              description: "Whether the loan is fully paid",
              default: false,
            },
            transaction_history: {
              type: "array",
              nullable: true,
              items: {
                $ref: "#/components/schemas/TransactionHistoryEntry",
              },
              description: "History of all loan payment transactions",
            },
          },
          required: [
            "loan_id",
            "is_active",
            "user_id",
            "interest_rate",
            "interest_type",
            "balance",
            "amount_paid",
            "is_paid",
            "created_at",
          ],
        },
        LoanApplicationRequest: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "User identifier",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            interest_rate: {
              type: "string",
              description: "Interest rate for the loan",
              example: "12.5",
            },
            interest_type: {
              type: "string",
              description: "Type of interest calculation",
              example: "monthly",
              enum: ["monthly", "yearly", "daily"],
            },
            borrowed_amount: {
              type: "integer",
              minimum: 1,
              description: "Amount to be borrowed",
              example: 50000,
            },
          },
          required: ["user_id", "interest_rate", "interest_type", "borrowed_amount"],
        },
        LoanApplicationResponse: {
          type: "object",
          properties: {
            loan_id: {
              type: "string",
              format: "uuid",
              description: "Unique loan identifier",
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "Associated user identifier",
            },
            interest_rate: {
              type: "string",
              description: "Interest rate for the loan",
              example: "12.5",
            },
            interest_type: {
              type: "string",
              description: "Type of interest calculation",
              example: "monthly",
            },
            is_active: {
              type: "boolean",
              description: "Whether the loan is active",
              example: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Loan creation timestamp",
            },
            borrowed_amount: {
              type: "integer",
              description: "Amount borrowed by the user",
              example: 50000,
            },
            balance: {
              type: "integer",
              description: "Current outstanding balance",
              example: 0,
            },
          },
          required: [
            "loan_id",
            "user_id",
            "interest_rate",
            "interest_type",
            "is_active",
            "created_at",
            "borrowed_amount",
            "balance",
          ],
        },
        LoanPaymentRequest: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
              description: "User identifier",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            loan_id: {
              type: "string",
              format: "uuid",
              description: "Loan identifier",
              example: "987fcdeb-51a2-43d1-9f12-345678901234",
            },
            amount: {
              type: "integer",
              minimum: 1,
              description: "Amount to be paid towards the loan",
              example: 5000,
            },
            payment_mode: {
              type: "string",
              description: "Mode of payment",
              example: "online",
              enum: ["cash", "online", "bank_transfer", "upi"],
            },
          },
          required: ["user_id", "loan_id", "amount", "payment_mode"],
        },
        LoanPaymentResponse: {
          type: "object",
          properties: {
            loan_id: {
              type: "string",
              format: "uuid",
              description: "Loan identifier",
            },
            user_id: {
              type: "string",
              format: "uuid",
              description: "User identifier",
            },
            borrowed_amount: {
              type: "integer",
              description: "Original borrowed amount",
              example: 50000,
            },
            balance: {
              type: "integer",
              description: "Remaining balance after payment",
              example: 45000,
            },
            amount_paid: {
              type: "integer",
              description: "Total amount paid towards the loan",
              example: 5000,
            },
            is_active: {
              type: "boolean",
              description: "Whether the loan is still active",
              example: true,
            },
            is_paid: {
              type: "boolean",
              description: "Whether the loan is fully paid",
              example: false,
            },
            payment_mode: {
              type: "string",
              description: "Mode of payment used",
              example: "online",
            },
            transaction_history: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TransactionHistoryEntry",
              },
              description: "Complete history of all loan payment transactions",
            },
          },
          required: [
            "loan_id",
            "user_id",
            "borrowed_amount",
            "balance",
            "amount_paid",
            "is_active",
            "is_paid",
            "payment_mode",
            "transaction_history",
          ],
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "User Management",
        description: "User onboarding and management endpoints",
      },
      {
        name: "Chit Management",
        description: "Chit creation and management endpoints",
      },
      {
        name: "Chits",
        description: "Chit deactivation and force closure endpoints",
      },
      {
        name: "Payments",
        description: "Payment processing endpoints",
      },
      {
        name: "Loans",
        description: "Loan application and management endpoints",
      },
      {
        name: "Analytics",
        description: "Analytics and reporting endpoints",
      },
    ],
  },
  apis: [
    "./src/routes/**/*.ts", // Path to the API files
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
