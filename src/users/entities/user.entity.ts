import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    user_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, default: 'user' })
    role: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}