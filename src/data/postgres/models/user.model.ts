import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum Status {
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED'
}

enum Role {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE'
}

@Entity()
export class Users extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false,
    length: 60,
    type: 'varchar'
  })
  name: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true
  })
  email: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255
  })
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT
  })
  role: Role

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.AVAILABLE
  })
  status: Status

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}