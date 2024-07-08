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
  })
  date: string

  @Column({
    nullable: false,
    type: 'int'
  })

  motorsNumber: number

  @Column({
    nullable: false,
    type: 'text',
  })
  description: string;

  @Column({
    type: 'enum',
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