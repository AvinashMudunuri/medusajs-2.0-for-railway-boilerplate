import { loadEnv, Modules, defineConfig } from "@medusajs/framework/utils";
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  TWILIO_VERIFY_SERVICE_SID,
  RAZORPAY_ID,
  RAZORPAY_SECRET,
  RAZORPAY_ACCOUNT,
  RAZORPAY_WEBHOOK_SECRET,
} from "lib/constants";

loadEnv(process.env.NODE_ENV, process.cwd());

const moduleProviderServices = [
  ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL
    ? [
        {
          resolve: "@medusajs/notification-sendgrid",
          id: "sendgrid",
          options: {
            channels: ["email"],
            api_key: SENDGRID_API_KEY,
            from: SENDGRID_FROM_EMAIL,
          },
        },
      ]
    : []),
  ...(RESEND_API_KEY && RESEND_FROM_EMAIL
    ? [
        {
          resolve: "./src/modules/email-notifications",
          id: "resend",
          options: {
            channels: ["email"],
            api_key: RESEND_API_KEY,
            from: RESEND_FROM_EMAIL,
          },
        },
      ]
    : []),
  ...(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER
    ? [
        {
          resolve: "./src/modules/sms-notifications",
          id: "twilio",
          options: {
            channels: ["sms"],
            account_sid: TWILIO_ACCOUNT_SID,
            auth_token: TWILIO_AUTH_TOKEN,
            phone_number: TWILIO_PHONE_NUMBER,
            verify_service_sid: TWILIO_VERIFY_SERVICE_SID,
          },
        },
      ]
    : []),
];

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    {
      key: "otp",
      resolve: "./src/modules/otp",
      options: {
        account_sid: TWILIO_ACCOUNT_SID,
        auth_token: TWILIO_AUTH_TOKEN,
        phone_number: TWILIO_PHONE_NUMBER,
        verify_service_sid: TWILIO_VERIFY_SERVICE_SID,
      },
    },
    {
      key: Modules.FILE,
      resolve: "@medusajs/file",
      options: {
        providers: [
          ...(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY
            ? [
                {
                  resolve: "./src/modules/minio-file",
                  id: "minio",
                  options: {
                    endPoint: MINIO_ENDPOINT,
                    accessKey: MINIO_ACCESS_KEY,
                    secretKey: MINIO_SECRET_KEY,
                    bucket: MINIO_BUCKET, // Optional, default: medusa-media
                  },
                },
              ]
            : [
                {
                  resolve: "@medusajs/file-local",
                  id: "local",
                  options: {
                    upload_dir: "static",
                    backend_url: `${BACKEND_URL}/static`,
                  },
                },
              ]),
        ],
      },
    },
    ...(REDIS_URL
      ? [
          {
            key: Modules.EVENT_BUS,
            resolve: "@medusajs/event-bus-redis",
            options: {
              redisUrl: REDIS_URL,
            },
          },
          {
            key: Modules.WORKFLOW_ENGINE,
            resolve: "@medusajs/workflow-engine-redis",
            options: {
              redis: {
                url: REDIS_URL,
              },
            },
          },
        ]
      : []),
    ...((SENDGRID_API_KEY && SENDGRID_FROM_EMAIL) ||
    (RESEND_API_KEY && RESEND_FROM_EMAIL) ||
    (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER)
      ? [
          {
            key: Modules.NOTIFICATION,
            resolve: "@medusajs/notification",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/notification-local",
                  id: "notification",
                  options: {
                    channels: ["feed"],
                  },
                },
                ...moduleProviderServices,
              ],
            },
          },
        ]
      : []),
    ...(RAZORPAY_ID && RAZORPAY_SECRET
      ? [
          {
            key: Modules.PAYMENT,
            resolve: "@medusajs/payment",
            options: {
              providers: [
                {
                  resolve:
                    "@tsc_tech/medusa-plugin-razorpay-payment/providers/razorpay",
                  id: "razorpay",
                  options: {
                    key_id: RAZORPAY_ID,
                    key_secret: RAZORPAY_SECRET,
                    razorpay_account: RAZORPAY_ACCOUNT,
                    automatic_expiry_period: 30,
                    manual_expiry_period: 20,
                    refund_speed: "normal",
                    webhook_secret: RAZORPAY_WEBHOOK_SECRET,
                  },
                },
              ],
            },
          },
        ]
      : []),
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY
      ? [
          {
            resolve: "@rokmohar/medusa-plugin-meilisearch",
            options: {
              config: {
                host: MEILISEARCH_HOST,
                apiKey: MEILISEARCH_ADMIN_KEY,
              },
              settings: {
                products: {
                  indexSettings: {
                    searchableAttributes: [
                      "title",
                      "description",
                      "variant_sku",
                    ],
                    displayedAttributes: [
                      "id",
                      "title",
                      "description",
                      "variant_sku",
                      "thumbnail",
                      "handle",
                    ],
                  },
                  primaryKey: "id",
                },
              },
            },
          },
        ]
      : []),
  ],
  plugins: [],
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);
