import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ExportsService } from './exports.service';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DonationsModule } from '../donations/donations.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [CampaignsModule, DonationsModule, AuditModule],
  controllers: [AdminController],
  providers: [AdminService, ExportsService],
})
export class AdminModule {}
