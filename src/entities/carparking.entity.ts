import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carpark')
export class CarPark {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  carParkNo: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column('float',)
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ type: 'int' })
  totalLots: number;

  @Column({ type: 'int' })
  availableLots: number;

  @Column({ type: 'varchar', length: 255 })
  carParkType!: string;

  @Column({ type: 'varchar', length: 255 })
  typeOfParkingSystem!: string;

  @Column({ type: 'boolean' })
  shortTermParking!: boolean;

  @Column({ type: 'boolean' })
  freeParking!: boolean;

  @Column({ type: 'boolean' })
  nightParking!: boolean;

  @Column({ type: 'int' })
  carParkDecks!: number;

  @Column('float')
  gantryHeight!: number;

  @Column({ type: 'boolean' })
  carParkBasement!: boolean;
}
