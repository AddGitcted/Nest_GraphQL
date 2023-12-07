import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

import { EmailEntity } from './email.entity';
import { EmailId } from './email.interfaces';
import { IAddEmail, UserEmail } from './email.types';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  /**
   * Récupère un email par rapport à un identifiant
   * @param id Identifiant de l'email à récupérer
   * @returns L'email correspondant à l'identifiant ou undefined
   */
  get(id: EmailId): Promise<UserEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  /**
   * Ajoute un email à un utilisateur
   * @param newEmail Email à ajouter
   * @returns L'email ajouté
   */
  async addEmail(newEmail: IAddEmail): Promise<UserEmail> {
    const user = await this.userService.get(newEmail.userId);

    if (user.status === 'inactive') {
      throw new ForbiddenException(
        `Impossible d'ajouter un e-mail à un utilisateur inactif`,
      );
    }
    const userEmail = this.emailRepository.create(newEmail);
    const savedUserEmail = await this.emailRepository.save(userEmail);
    return savedUserEmail;
  }

  async removeEmail(emailId: EmailId): Promise<EmailId> {
    await this.emailRepository.delete(emailId);
    return emailId;
  }
}
