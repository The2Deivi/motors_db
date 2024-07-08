import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, InsertEvent, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { bcryptAdapter } from "../../../config";

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

  // constructor(password: string) {
  //   super()
  //   this.password = password
  // }

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
    type: 'boolean',
    default: false
  })
  emailValidated: boolean

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

  @BeforeInsert()
  encryptPassword() {
    this.password = bcryptAdapter.hash(this.password)
  }
}