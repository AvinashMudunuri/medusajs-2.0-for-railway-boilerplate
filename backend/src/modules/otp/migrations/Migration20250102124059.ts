import { Migration } from '@mikro-orm/migrations';

export class Migration20250102124059 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "otp" ("id" text not null, "otp" text null, "otpExpiresAt" timestamptz null, "isPhoneVerified" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "otp_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "otp" cascade;');
  }

}
