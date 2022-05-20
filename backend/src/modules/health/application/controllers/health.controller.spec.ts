import { HealthController } from "./health.controller";
import { HealthModule } from "../../health.module";
import { MemoryHealthIndicator } from "@nestjs/terminus";
import { Test, TestingModule } from "@nestjs/testing";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ imports: [HealthModule] })
      .overrideProvider(MemoryHealthIndicator)
      .useValue({ checkHeap: () => null })
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should return healthy check response", async () => {
    const health = await controller.check();

    expect(health.status).toEqual("ok");
  });
});
