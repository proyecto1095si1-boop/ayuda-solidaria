import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DonationsModule } from '../donations/donations.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [CampaignsModule, DonationsModule, AuditModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
