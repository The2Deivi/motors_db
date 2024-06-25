import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum Status {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

@Entity()
export class Repairs extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false,
    type: 'timestamp',
    length: 120
  })
  date: string

  @Column({
    nullable: false,
    enum: Status,
    default: Status.PENDING
  })
  status: Status

  @Column({
    nullable: false,
    type: 'int'
  })
  userid: number

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}