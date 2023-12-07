import { EmailFiltersArgs } from './email.types';
import { FindOptionsWhere, In } from 'typeorm';
import { EmailEntity } from './email.entity';

// Méthode pour créer un filtre sur les emails et éviter de dupliquer le code dans les resolvers
export function createEmailFilter(filters: EmailFiltersArgs): FindOptionsWhere<EmailEntity> {
  let addressFilters: string[] = [];

  if (filters.address?.equal) {
    addressFilters.push(filters.address.equal);
  }

  if (filters.address?.in?.length > 0) {
    addressFilters = [...addressFilters, ...filters.address.in];
  }

  return addressFilters.length > 0 ? { address: In(addressFilters) } : {};
}