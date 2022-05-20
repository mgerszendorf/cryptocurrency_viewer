import { HealthController } from "./application/controllers/health.controller";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
