import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./user.model";

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

  @ManyToOne(() => Users, (user) => user.repairs)
  user: Users

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}