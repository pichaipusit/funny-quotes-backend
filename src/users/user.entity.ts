import { Exclude } from 'class-transformer';
import { Quote } from 'src/quotes/quote.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Quote, (quote) => quote.user)
  quotes: Quote[];
}
