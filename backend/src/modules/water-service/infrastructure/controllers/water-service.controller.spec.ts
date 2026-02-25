import { Test, TestingModule } from '@nestjs/testing';
import { WaterServiceController } from './water-service.controller';

describe('WaterServiceController', () => {
  let controller: WaterServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaterServiceController],
    }).compile();

    controller = module.get<WaterServiceController>(WaterServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
