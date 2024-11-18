import { OwnerToCreate } from "../entity/owner.type";
import { OwnerNotFoundError } from "../exceptions/OwnerNotFoundError";
import { OwnerRepository } from "../repository/owner.repository";

export class OwnerService {
  private readonly repository;

  constructor(repository: OwnerRepository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.read();
  }

  async getById(id: number) {
    const owner = await this.repository.readById(id);
    if(owner === null) {
      throw new OwnerNotFoundError('The owner is not found.')
    }
    return owner;
  }

  async create(owner: OwnerToCreate) {
    return await this.repository.create(owner);
  }
}