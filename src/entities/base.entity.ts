import { PrimaryGeneratedColumn, Column, UpdateDateColumn, DeleteDateColumn, CreateDateColumn, ObjectIdColumn } from 'typeorm';

export abstract class BaseEntity {
    @ObjectIdColumn()
    id: string;

    // @Column({ type: 'boolean', default: true })
    // isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isArchived: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: new Date() })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: new Date() })
    updatedAt: Date;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    lastChangedBy: string;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date
    // @Column({ type: 'varchar', length: 300, nullable: true })
    // internalComment: string | null;
}
