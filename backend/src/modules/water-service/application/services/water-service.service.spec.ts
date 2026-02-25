import { Test, TestingModule } from '@nestjs/testing';
import { WaterServiceService } from './water-service.service';

describe('WaterServiceService', () => {
  let service: WaterServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaterServiceService],
    }).compile();

    service = module.get<WaterServiceService>(WaterServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
