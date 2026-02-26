import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../../modules/user/infrastructure/entities/user.orm-entity';
import { WaterServiceOrmEntity } from '../../modules/water-service/infrastructure/entities/water-service.orm-entity';

export class WaterServicesSeed {
  static async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UserOrmEntity);
    const waterServiceRepository = dataSource.getRepository(
      WaterServiceOrmEntity,
    );

    // Grab a normal user (not admin if possible) to assign the services to
    const targetUser = await userRepository.findOne({
      where: { email: 'user@user.com' },
    });

    if (!targetUser) {
      console.log('[WaterServicesSeed] Target user not found. Skipping seed.');
      return;
    }

    const count = await waterServiceRepository.count();
    if (count > 0) {
      console.log(
        '[WaterServicesSeed] Water services already exist, skipping seed.',
      );
      return;
    }

    const dummyServices = [
      // Villas del Álamo (Mineral de la Reforma)
      {
        serviceNumber: 'VDA-0001',
        street: 'Circuito Los Robles 12',
        neighborhood: 'Villas del Álamo',
        city: 'Mineral de la Reforma',
        postalCode: '42184',
      },
      {
        serviceNumber: 'VDA-0002',
        street: 'Calle Álamo Plateado 45',
        neighborhood: 'Villas del Álamo',
        city: 'Mineral de la Reforma',
        postalCode: '42184',
      },
      {
        serviceNumber: 'VDA-0003',
        street: 'Avenida Principal 110',
        neighborhood: 'Villas del Álamo',
        city: 'Mineral de la Reforma',
        postalCode: '42184',
      },
      {
        serviceNumber: 'VDA-0004',
        street: 'Retorno Arce 3',
        neighborhood: 'Villas del Álamo',
        city: 'Mineral de la Reforma',
        postalCode: '42184',
      },
      {
        serviceNumber: 'VDA-0005',
        street: 'Calle Fresno 89',
        neighborhood: 'Villas del Álamo',
        city: 'Mineral de la Reforma',
        postalCode: '42184',
      },

      // Zempoala (UPP surroundings)
      {
        serviceNumber: 'ZEM-0001',
        street: 'Carretera Pachuca-Sahagún Km 20',
        neighborhood: 'Ex-Hacienda Santa Mónica',
        city: 'Zempoala',
        postalCode: '43830',
      },
      {
        serviceNumber: 'ZEM-0002',
        street: 'Calle Benito Juárez 14',
        neighborhood: 'Centro',
        city: 'Zempoala',
        postalCode: '43830',
      },
      {
        serviceNumber: 'ZEM-0003',
        street: 'Privada los Pinos 5',
        neighborhood: 'San Antonio Oxtoyucan',
        city: 'Zempoala',
        postalCode: '43830',
      },
      {
        serviceNumber: 'ZEM-0004',
        street: 'Avenida las Palmas 22',
        neighborhood: 'Jagüey de Téllez',
        city: 'Zempoala',
        postalCode: '43830',
      },
      {
        serviceNumber: 'ZEM-0005',
        street: 'Calle de las Rosas 1',
        neighborhood: 'San Pedro Tlaquilpan',
        city: 'Zempoala',
        postalCode: '43833',
      },

      // Pachuca
      {
        serviceNumber: 'PAC-0001',
        street: 'Calle Guerrero 200',
        neighborhood: 'Centro',
        city: 'Pachuca de Soto',
        postalCode: '42000',
      },
      {
        serviceNumber: 'PAC-0002',
        street: 'Revolución 500',
        neighborhood: 'Periodistas',
        city: 'Pachuca de Soto',
        postalCode: '42060',
      },
      {
        serviceNumber: 'PAC-0003',
        street: 'Boulevard Minero 12',
        neighborhood: 'Plutarco Elías Calles',
        city: 'Pachuca de Soto',
        postalCode: '42036',
      },
      {
        serviceNumber: 'PAC-0004',
        street: 'Calle Ferrocarril Central 8',
        neighborhood: 'Maestranza',
        city: 'Pachuca de Soto',
        postalCode: '42060',
      },
      {
        serviceNumber: 'PAC-0005',
        street: 'Avenida Madero 400',
        neighborhood: 'Doctores',
        city: 'Pachuca de Soto',
        postalCode: '42090',
      },
    ];

    const entities = dummyServices.map((service) =>
      waterServiceRepository.create({
        ...service,
        userId: targetUser.id,
      }),
    );

    await waterServiceRepository.save(entities);
    console.log(
      `[WaterServicesSeed] Successfully seeded ${entities.length} dummy water services for testing.`,
    );
  }
}
