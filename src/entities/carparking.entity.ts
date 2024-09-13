import { CreateDateColumn, UpdateDateColumn,  Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('carpark')
export class CarPark {
  @PrimaryGeneratedColumn()
  id:string;

  @Column()
  address:string;

  @Column('float')
  latitude:number;

  @Column('float')
  longitude:number;

  @Column()
  total_lots:number;

  @Column()
  available_lots:number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
